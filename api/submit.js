/* ============================================================
   FIRST BATCH — /api/submit (v3)
   Validates, rate-limits, filters spam, then writes to Airtable
   and emails H via Resend.

   Payload: { fields, brief?, hp? }
   - fields: Name, Company, LinkedIn?, Contact, Timestamp
   - brief:  founder brief (Category/Stage/Stuck), unlock notes
             (Notes), or partner application (Type/Makes/
             Certifications/Minimums)
   - hp:     honeypot — non-empty means bot; accept + discard

   Routing:
   - brief.Type === 'Partner application' → Partner Applications table
   - everything else → Founder Leads table (+ Source column)

   Env vars (Vercel → Settings → Environment Variables):
     AIRTABLE_TOKEN
     AIRTABLE_BASE_ID            appm5hPqDHPQcXrhX (F&B Upstream)
     AIRTABLE_TABLE_ID           Founder Leads table id
     AIRTABLE_PARTNER_TABLE_ID   Partner Applications table id
                                 (defaults to tblP6YIG6sWFEDKQF)
     RESEND_API_KEY
     NOTIFY_EMAIL
   ============================================================ */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map(); // per-instance; resets on cold start — good enough

function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > MAX_PER_WINDOW;
}

function validate(fields) {
  const errors = [];
  const name = (fields.Name || '').trim();
  const company = (fields.Company || '').trim();
  const contact = (fields.Contact || '').replace(/\D/g, '');
  if (name.length < 2 || name.length > 120) errors.push('Name');
  if (company.length < 2 || company.length > 200) errors.push('Company');
  if (contact.length !== 10) errors.push('Contact');
  if (fields.LinkedIn && !/linkedin\.com\/(in|company)\//i.test(fields.LinkedIn)) errors.push('LinkedIn');
  return errors;
}

const clip = (v, n = 2000) => typeof v === 'string' ? v.slice(0, n).trim() : '';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fields, brief, hp } = req.body || {};
  if (!fields) return res.status(400).json({ error: 'Missing fields' });

  // Honeypot: pretend success, store nothing
  if (hp) return res.status(200).json({ ok: true });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  const errors = validate(fields);
  if (errors.length) return res.status(400).json({ error: `Invalid: ${errors.join(', ')}` });

  const {
    AIRTABLE_TOKEN,
    AIRTABLE_BASE_ID,
    AIRTABLE_TABLE_ID,
    AIRTABLE_PARTNER_TABLE_ID,
    RESEND_API_KEY,
    NOTIFY_EMAIL
  } = process.env;

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    console.error('[First Batch] Missing Airtable env vars');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // ── Build the Airtable record ─────────────────────────────
  const isPartner = brief && brief.Type === 'Partner application';
  const base = {
    Name: clip(fields.Name, 120),
    Company: clip(fields.Company, 200),
    Contact: (fields.Contact || '').replace(/\D/g, ''),
    Timestamp: clip(fields.Timestamp, 40) || new Date().toISOString()
  };

  let tableId, record;
  if (isPartner) {
    tableId = AIRTABLE_PARTNER_TABLE_ID || 'tblP6YIG6sWFEDKQF';
    record = { ...base };
    // Only set columns that have a value, so records stay clean per type.
    const setIf = (col, val, n = 300) => { const c = clip(val, n); if (c) record[col] = c; };
    setIf('LinkedIn', fields.LinkedIn, 300);
    setIf('Type', brief.PartnerType, 60);          // Contract manufacturer / Food technologist / R&D / etc.
    // Only write Email if it looks valid — a malformed value could reject the record.
    if (brief.Email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(brief.Email.trim())) setIf('Email', brief.Email, 200);
    setIf('Categories', brief.Categories);
    setIf('Makes', brief.Makes);
    setIf('Certifications', brief.Certifications);
    setIf('Minimums', brief.Minimums);
    setIf('Specialties', brief.Specialties);
    setIf('Experience', brief.Experience, 100);
    setIf('Engagement', brief.Engagement, 100);
    setIf('Stages', brief.Stages);
    setIf('Portfolio', brief.Portfolio, 500);
  } else {
    tableId = AIRTABLE_TABLE_ID;
    const isBrief = brief && (brief.Category || brief.Stage || brief.Stuck);
    record = {
      ...base,
      LinkedIn: clip(fields.LinkedIn, 300),
      Source: isBrief ? 'Founder brief' : 'Network unlock'
    };
    // Only write Email if it looks valid — a malformed value could reject the record.
    if (fields.Email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.Email.trim())) {
      record.Email = clip(fields.Email, 200);
    }
    if (brief) {
      if (brief.Category) record.Category = clip(brief.Category, 300);
      if (brief.Stage) record.Stage = clip(brief.Stage, 100);
      if (brief.Stuck) record.Stuck = clip(brief.Stuck);
      if (brief.Notes) record.Notes = clip(brief.Notes);
    }
  }

  // ── 1. Save to Airtable ───────────────────────────────────
  // encodeURIComponent so a table NAME with spaces (e.g. "Founder Leads")
  // works as well as a table id. Un-encoded spaces produce a broken URL
  // that Airtable rejects — a common cause of silent write failures.
  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableId)}`;
  let airtableStatus = 'unknown';
  try {
    const airtableRes = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: record, typecast: true })
    });

    if (airtableRes.ok) {
      airtableStatus = 'saved ✓';
    } else {
      const err = await airtableRes.text();
      airtableStatus = `FAILED ${airtableRes.status} — ${err.slice(0, 400)}`;
      console.error('[First Batch] Airtable error:', airtableRes.status, err);
      // Don't fail the whole request — still send the email (which now
      // reports the failure reason so nothing is lost or hidden).
    }
  } catch (airtableErr) {
    airtableStatus = `FAILED (network) — ${airtableErr.message}`;
    console.error('[First Batch] Airtable fetch threw:', airtableErr);
  }

  // ── 2. Email notification via Resend ──────────────────────
  if (RESEND_API_KEY && NOTIFY_EMAIL) {
    try {
      const partnerLabel = record.Type ? `PARTNER APPLICATION (${record.Type})` : 'PARTNER APPLICATION';
      const label = isPartner ? partnerLabel : (record.Source === 'Founder brief' ? 'FOUNDER BRIEF' : 'network unlock');
      const details = Object.entries(record)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: NOTIFY_EMAIL,
          subject: `${isPartner ? `🏭 Partner${record.Type ? ' · ' + record.Type : ''}` : record.Source === 'Founder brief' ? '🔥 Brief' : 'New lead'} — ${record.Name} @ ${record.Company}`,
          text: `New ${label} on First Batch:\n\n${details}\n\n──────────\nAirtable: ${airtableStatus}\nTable: ${tableId}`
        })
      });
    } catch (emailErr) {
      console.warn('[First Batch] Resend email failed:', emailErr);
    }
  }

  return res.status(200).json({ ok: true, airtable: airtableStatus });
};

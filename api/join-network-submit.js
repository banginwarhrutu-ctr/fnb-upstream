/* ============================================================
   JOIN THE NETWORK — /api/join-network-submit
   Validates, rate-limits, then writes each submission to the
   "Referral-Partner-Intake" table in the F&B Upstream Airtable
   base, and emails a notification via Resend — reusing the same
   env vars as /api/submit.js.

   Env vars (Vercel → Settings → Environment Variables):
     AIRTABLE_TOKEN
     AIRTABLE_BASE_ID       appm5hPqDHPQcXrhX (F&B Upstream)
     RESEND_API_KEY         (optional — skipped if unset)
     NOTIFY_EMAIL           (optional — skipped if unset)
   ============================================================ */

const AIRTABLE_TABLE_NAME = 'Referral-Partner-Intake';

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

const clip = (v, n = 500) => typeof v === 'string' ? v.slice(0, n).trim() : '';

function validate(f) {
  const errors = [];
  if (!f.name || f.name.trim().length < 2) errors.push('name');
  const digits = (f.phone || '').replace(/\D/g, '');
  if (!(digits.length === 10 || (digits.length === 12 && digits.startsWith('91')))) errors.push('phone');
  if (!f.companyName || f.companyName.trim().length < 2) errors.push('companyName');
  if (!f.city || !f.city.trim()) errors.push('city');
  if (!f.state) errors.push('state');
  if (!f.moq) errors.push('moq');
  const hasService = (f.services && f.services.trim()) || (f.servicesOther && f.servicesOther.trim());
  if (!hasService) errors.push('services');
  return errors;
}

module.exports = async function handler(req, res) {
  try {
    return await handleSubmit(req, res);
  } catch (err) {
    console.error('[Join the Network] Unhandled error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
};

async function handleSubmit(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Honeypot — pretend success, store nothing.
  if (body.website) return res.status(200).json({ ok: true });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  const errors = validate(body);
  if (errors.length) return res.status(400).json({ error: `Invalid: ${errors.join(', ')}` });

  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, RESEND_API_KEY, NOTIFY_EMAIL } = process.env;
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error('[Join the Network] Missing Airtable env vars');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const digits = (body.phone || '').replace(/\D/g, '');
  const phone = digits.length === 12 ? digits.slice(2) : digits;

  const record = {
    Name: clip(body.name, 120),
    Designation: clip(body.designation, 120),
    Phone: phone,
    'Company Name': clip(body.companyName, 200),
    City: clip(body.city, 100),
    State: clip(body.state, 100),
    Services: clip(body.services, 500),
    'Services Other': clip(body.servicesOther, 300),
    Certifications: clip(body.certifications, 500),
    'Certifications Other': clip(body.certificationsOther, 300),
    Categories: clip(body.categories, 500),
    MOQ: clip(body.moq, 100),
    'Pilot Run': clip(body.pilotRun, 10),
    'R&D Feasibility': clip(body.rndFeasibility, 10),
    Notes: clip(body.notes, 2000),
    Timestamp: clip(body.timestamp, 40) || new Date().toISOString()
  };

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
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
      console.error('[Join the Network] Airtable error:', airtableRes.status, err);
    }
  } catch (airtableErr) {
    airtableStatus = `FAILED (network) — ${airtableErr.message}`;
    console.error('[Join the Network] Airtable fetch threw:', airtableErr);
  }

  if (airtableStatus.startsWith('FAILED')) {
    // Unlike /api/submit.js, surface this as a real failure to the visitor —
    // this form has no other safety net besides the browser-local backup.
    if (RESEND_API_KEY && NOTIFY_EMAIL) await notify(record, airtableStatus, RESEND_API_KEY, NOTIFY_EMAIL);
    return res.status(502).json({ error: 'Could not save to Airtable' });
  }

  if (RESEND_API_KEY && NOTIFY_EMAIL) await notify(record, airtableStatus, RESEND_API_KEY, NOTIFY_EMAIL);

  return res.status(200).json({ ok: true });
}

async function notify(record, airtableStatus, RESEND_API_KEY, NOTIFY_EMAIL) {
  try {
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
        subject: `🌐 Join the Network — ${record.Name} @ ${record['Company Name']}`,
        text: `New "Join the Network" submission on First Batch:\n\n${details}\n\n──────────\nAirtable: ${airtableStatus}\nTable: Referral-Partner-Intake`
      })
    });
  } catch (emailErr) {
    console.warn('[Join the Network] Resend email failed:', emailErr);
  }
}

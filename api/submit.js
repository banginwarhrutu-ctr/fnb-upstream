/* ============================================================
   F&B UPSTREAM — /api/submit
   Serverless proxy: saves lead to Airtable + sends email via Resend.
   All secrets live in Vercel env vars — never in client JS.

   Env vars required (set in Vercel dashboard → Settings → Environment Variables):
     AIRTABLE_TOKEN      — Airtable Personal Access Token
     AIRTABLE_BASE_ID    — e.g. appXXXXXXXXXXXXXX
     AIRTABLE_TABLE_ID   — e.g. tblXXXXXXXXXXXXXX
     RESEND_API_KEY      — from resend.com (free tier works)
     NOTIFY_EMAIL        — your email address to receive lead notifications
   ============================================================ */

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fields } = req.body || {};
  if (!fields) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const {
    AIRTABLE_TOKEN,
    AIRTABLE_BASE_ID,
    AIRTABLE_TABLE_ID,
    RESEND_API_KEY,
    NOTIFY_EMAIL
  } = process.env;

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
    console.error('[F&B Upstream] Missing Airtable env vars');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // ── 1. Save to Airtable ──────────────────────────────────
  const airtableEndpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;

  const airtableRes = await fetch(airtableEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });

  if (!airtableRes.ok) {
    const err = await airtableRes.text();
    console.error('[F&B Upstream] Airtable error:', airtableRes.status, err);
    // Don't fail the whole request — still try to send email
  }

  // ── 2. Send email notification via Resend ────────────────
  if (RESEND_API_KEY && NOTIFY_EMAIL) {
    try {
      const emailBody = `
New lead on F&B Upstream:

Name:     ${fields.Name || '—'}
Company:  ${fields.Company || '—'}
LinkedIn: ${fields.LinkedIn || '—'}
Contact:  ${fields.Contact || '—'}
Time:     ${fields.Timestamp || new Date().toISOString()}
      `.trim();

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: NOTIFY_EMAIL,
          subject: `New F&B Upstream lead — ${fields.Name || 'Unknown'} @ ${fields.Company || '?'}`,
          text: emailBody
        })
      });
    } catch (emailErr) {
      // Email failure is non-fatal — lead is already in Airtable
      console.warn('[F&B Upstream] Resend email failed:', emailErr);
    }
  }

  return res.status(200).json({ ok: true });
};

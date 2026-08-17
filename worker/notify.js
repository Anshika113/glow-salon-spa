/**
 * Booking notifications.
 *
 * Without this, an appointment request only lands in D1 and the salon has to go
 * looking for it — so in practice bookings get missed. This pushes each new
 * request straight to whoever runs the salon.
 *
 * Two independent channels, both optional. Each switches on only when its
 * secrets are present, so an unconfigured deploy behaves exactly as before.
 *
 *   Email (Resend)   RESEND_API_KEY, NOTIFY_TO, NOTIFY_FROM
 *   Telegram         TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 *
 * `notifyNewEnquiry` never throws, and returns true when at least one channel
 * accepted the message.
 *
 * How it's called depends on whether the row reached the database:
 *   • stored     → fired through `ctx.waitUntil()` after the response goes out,
 *                  so a slow mail provider can't delay the customer.
 *   • not stored → awaited, because the notification is then the *only* copy of
 *                  the booking and its result decides what the customer sees.
 *
 * That second path is what lets the site run with no database at all — see the
 * "Booking notifications" section of README.md for setup.
 */

const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

/**
 * Turn whatever the customer typed into a wa.me-safe number. Indian mobiles are
 * usually given as 10 digits, so a bare 10-digit number gets the country code
 * prefixed — override with the DEFAULT_COUNTRY_CODE var if you're not in India.
 */
function waNumber(phone, env) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  const cc = String(env.DEFAULT_COUNTRY_CODE || '91').replace(/\D/g, '');
  if (digits.length === 10) return cc + digits;
  return digits.replace(/^0+/, '');
}

function lines(enquiry) {
  return [
    ['Service', enquiry.service],
    ['Name', enquiry.name],
    ['Phone', enquiry.phone],
    ['Email', enquiry.email],
    ['Details', enquiry.message],
  ].filter(([, v]) => v);
}

// --- Email via Resend -------------------------------------------------------

async function sendEmail(enquiry, env) {
  const wa = waNumber(enquiry.phone, env);
  const rows = lines(enquiry)
    .map(
      ([k, v]) =>
        `<tr>
           <td style="padding:10px 16px 10px 0;color:#6f6961;font:500 11px/1.4 -apple-system,Segoe UI,sans-serif;letter-spacing:.14em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${esc(k)}</td>
           <td style="padding:10px 0;color:#171717;font:400 15px/1.55 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${esc(v)}</td>
         </tr>`
    )
    .join('');

  const html = `<div style="background:#f5f1ea;padding:28px">
  <div style="max-width:560px;margin:0 auto;background:#fffdfa;border:1px solid rgba(23,23,23,.14)">
    <div style="padding:26px 28px 20px;border-bottom:1px solid rgba(23,23,23,.14)">
      <div style="color:#b79b8b;font:500 11px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:.22em;text-transform:uppercase">New appointment request</div>
      <div style="margin-top:10px;color:#171717;font:400 26px/1.15 Georgia,serif">Glow Salon &amp; Spa</div>
    </div>
    <table style="width:100%;border-collapse:collapse;padding:8px 28px" cellpadding="0" cellspacing="0">
      <tbody><tr><td style="padding:8px 28px">
        <table style="width:100%;border-collapse:collapse" cellpadding="0" cellspacing="0"><tbody>${rows}</tbody></table>
      </td></tr></tbody>
    </table>
    <div style="padding:8px 28px 28px">
      ${wa ? `<a href="https://wa.me/${esc(wa)}" style="display:inline-block;padding:13px 20px;margin:0 8px 8px 0;background:#171717;color:#fffdfa;text-decoration:none;font:500 11px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:.16em;text-transform:uppercase">Reply on WhatsApp</a>` : ''}
      <a href="tel:${esc(String(enquiry.phone).replace(/\s/g, ''))}" style="display:inline-block;padding:13px 20px;margin:0 8px 8px 0;border:1px solid rgba(23,23,23,.3);color:#171717;text-decoration:none;font:500 11px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:.16em;text-transform:uppercase">Call ${esc(enquiry.phone)}</a>
    </div>
    <div style="padding:14px 28px;border-top:1px solid rgba(23,23,23,.14);color:#6f6961;font:400 12px/1.5 -apple-system,Segoe UI,sans-serif">
      Request ${esc(enquiry.ref)} · ${esc(enquiry.created_at)} · a request, not a confirmed booking — reply to agree a time.
      ${enquiry.stored ? '' : '<br><strong style="color:#8d3b34">This email is the only copy — it was not written to a database.</strong>'}
    </div>
  </div>
</div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.NOTIFY_FROM || 'Glow Salon & Spa <onboarding@resend.dev>',
      to: String(env.NOTIFY_TO).split(',').map((a) => a.trim()).filter(Boolean),
      // Replying in an email client goes to the customer, not into the void.
      reply_to: enquiry.email || undefined,
      subject: `New appointment request — ${enquiry.name}${enquiry.service ? ` · ${enquiry.service}` : ''}`,
      html,
    }),
  });

  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

// --- Telegram ---------------------------------------------------------------

async function sendTelegram(enquiry, env) {
  const wa = waNumber(enquiry.phone, env);
  const body = [
    '*New appointment request*',
    '',
    ...lines(enquiry).map(([k, v]) => `*${k}:* ${String(v).replace(/([_*[\]`])/g, '\\$1')}`),
    '',
    wa ? `[Reply on WhatsApp](https://wa.me/${wa})` : '',
    enquiry.stored ? '' : '_This message is the only copy — not saved to a database._',
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: body,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) throw new Error(`Telegram ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

// --- Entry point ------------------------------------------------------------

/** @returns {Promise<boolean>} true if at least one channel accepted the message */
export async function notifyNewEnquiry(enquiry, env) {
  const jobs = [];
  // Each job is wrapped so a synchronous throw can't escape before allSettled.
  if (env.RESEND_API_KEY && env.NOTIFY_TO) {
    jobs.push(['email', Promise.resolve().then(() => sendEmail(enquiry, env))]);
  }
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    jobs.push(['telegram', Promise.resolve().then(() => sendTelegram(enquiry, env))]);
  }

  if (!jobs.length) {
    console.warn(
      `enquiry ${enquiry.ref}: no notification channel configured ` +
        '(see "Booking notifications" in README.md)'
    );
    return false;
  }

  const settled = await Promise.allSettled(jobs.map(([, p]) => p));
  settled.forEach((r, i) => {
    const channel = jobs[i][0];
    if (r.status === 'fulfilled') console.log(`enquiry ${enquiry.ref}: ${channel} notification sent`);
    else console.error(`enquiry ${enquiry.ref}: ${channel} notification failed —`, r.reason?.message || r.reason);
  });

  return settled.some((r) => r.status === 'fulfilled');
}

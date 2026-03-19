import { Resend } from 'resend'

// Lazily instantiated so the module loads fine without RESEND_API_KEY set
let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!)
  return _resend
}
const FROM = process.env.EMAIL_FROM ?? "Olivia's Birthday <onboarding@resend.dev>"

function guestSummary(adult_count: number, child_count: number) {
  const parts = []
  if (adult_count > 0) parts.push(`${adult_count} adult${adult_count !== 1 ? 's' : ''}`)
  if (child_count > 0) parts.push(`${child_count} child${child_count !== 1 ? 'ren' : ''}`)
  return parts.join(' and ')
}

function attendingHtml(name: string, adult_count: number, child_count: number) {
  const guests = guestSummary(adult_count, child_count)
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background:#D4DDD0;font-family:Georgia,serif;">
<div style="max-width:460px;margin:0 auto;background:#FDFBF7;border-radius:14px;padding:40px 32px;border:2px solid #C5D1BF;text-align:center;">
  <p style="font-size:36px;margin:0 0 12px">🍊</p>
  <h1 style="font-family:Georgia,serif;font-size:28px;color:#2D3A28;margin:0 0 6px">See you there!</h1>
  <p style="font-size:16px;color:#4A5A42;line-height:1.7;margin:0 0 20px">
    Thanks, <strong>${name}</strong>!<br>We've got you down for <strong>${guests}</strong>.
  </p>
  <div style="width:36px;height:2px;background:#C5D1BF;margin:0 auto 20px"></div>
  <p style="font-size:15px;font-weight:600;color:#2D3A28;margin:0 0 6px">Sunday, May 17th, 2026</p>
  <p style="font-size:14px;color:#4A5A42;line-height:1.8;margin:0 0 20px">
    10:30 AM – 1:30 PM<br>
    Lyon Park Community Center<br>
    414 North Fillmore Street<br>
    Arlington, VA 22201
  </p>
  <div style="width:36px;height:1px;background:#C5D1BF;margin:0 auto 16px"></div>
  <p style="font-size:13px;color:#8B9E82;font-style:italic;margin:0">
    Come anytime &amp; stay as long as you'd like.<br>No gifts please! 🍊
  </p>
</div>
</body></html>`
}

function declinedHtml(name: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background:#D4DDD0;font-family:Georgia,serif;">
<div style="max-width:460px;margin:0 auto;background:#FDFBF7;border-radius:14px;padding:40px 32px;border:2px solid #C5D1BF;text-align:center;">
  <p style="font-size:36px;margin:0 0 12px">🍊</p>
  <h1 style="font-family:Georgia,serif;font-size:28px;color:#2D3A28;margin:0 0 6px">We'll miss you!</h1>
  <p style="font-size:16px;color:#4A5A42;line-height:1.7;margin:0">
    Thanks for letting us know, <strong>${name}</strong>.<br>
    <em>We'll save you a cutie!</em>
  </p>
</div>
</body></html>`
}

export async function sendConfirmationEmail({
  to,
  name,
  status,
  adult_count,
  child_count,
}: {
  to: string
  name: string
  status: 'attending' | 'declined'
  adult_count: number
  child_count: number
}) {
  if (!process.env.RESEND_API_KEY) return // no-op until key is configured

  await getResend().emails.send({
    from: FROM,
    to,
    subject: status === 'attending'
      ? "See you at Olivia's Birthday! 🍊"
      : "Thanks for letting us know 🍊",
    html: status === 'attending'
      ? attendingHtml(name, adult_count, child_count)
      : declinedHtml(name),
  })
}

import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!)
  return _resend
}

const FROM = process.env.EMAIL_FROM ?? "Olivia's Birthday <onboarding@resend.dev>"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://little-cutie-evite.vercel.app'

function guestSummary(adult_count: number, child_count: number) {
  const parts = []
  if (adult_count > 0) parts.push(`${adult_count} adult${adult_count !== 1 ? 's' : ''}`)
  if (child_count > 0) parts.push(`${child_count} child${child_count !== 1 ? 'ren' : ''}`)
  return parts.join(' & ') || '1 guest'
}

function attendingHtml(name: string, adult_count: number, child_count: number) {
  const guests = guestSummary(adult_count, child_count)
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#D4DDD0;font-family:Georgia,serif;">
<div style="max-width:480px;margin:0 auto;background:#FDFBF7;border-radius:16px;overflow:hidden;border:2px solid #C5D1BF;box-shadow:0 4px 24px rgba(45,58,40,0.10);">

  <!-- Header -->
  <div style="background:#2D3A28;padding:32px 32px 24px;text-align:center;">
    <p style="font-size:40px;margin:0 0 8px">🍊</p>
    <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#FDFBF7;margin:0 0 4px;letter-spacing:0.5px;">
      You&rsquo;re confirmed!
    </h1>
    <p style="font-size:14px;color:#C5D1BF;margin:0;letter-spacing:1px;text-transform:uppercase;">
      Olivia Linh Iyer&rsquo;s 1st Birthday
    </p>
  </div>

  <!-- Body -->
  <div style="padding:32px;text-align:center;">
    <p style="font-size:17px;color:#2D3A28;line-height:1.7;margin:0 0 24px;">
      Thanks, <strong>${name}</strong>!<br>
      We&rsquo;ve got you down for <strong style="color:#E8914F;">${guests}</strong>.
    </p>

    <!-- Divider -->
    <div style="width:40px;height:2px;background:#C5D1BF;margin:0 auto 24px;border-radius:1px;"></div>

    <!-- Event details -->
    <p style="font-size:16px;font-weight:700;color:#2D3A28;margin:0 0 6px;">Sunday, May 17th, 2026</p>
    <p style="font-size:14px;color:#4A5A42;line-height:1.9;margin:0 0 24px;">
      10:30 AM – 1:30 PM<br>
      Lyon Park Community Center<br>
      414 North Fillmore Street<br>
      Arlington, VA 22201
    </p>

    <!-- Divider -->
    <div style="width:40px;height:1px;background:#C5D1BF;margin:0 auto 20px;"></div>

    <p style="font-size:14px;color:#8B9E82;font-style:italic;margin:0 0 6px;">
      Come anytime &amp; stay as long as you&rsquo;d like.
    </p>
    <p style="font-size:14px;color:#8B9E82;margin:0;">No gifts please! 🍊</p>
  </div>

  <!-- Footer -->
  <div style="background:#F0F4EE;padding:16px 32px;text-align:center;border-top:1px solid #C5D1BF;">
    <p style="font-size:12px;color:#8B9E82;margin:0;">
      Need to update your RSVP?
      <a href="${SITE_URL}" style="color:#8B9E82;">Visit here</a>
    </p>
  </div>

</div>
</body></html>`
}

function declinedHtml(name: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#D4DDD0;font-family:Georgia,serif;">
<div style="max-width:480px;margin:0 auto;background:#FDFBF7;border-radius:16px;overflow:hidden;border:2px solid #C5D1BF;box-shadow:0 4px 24px rgba(45,58,40,0.10);">

  <!-- Header -->
  <div style="background:#2D3A28;padding:32px 32px 24px;text-align:center;">
    <p style="font-size:40px;margin:0 0 8px">🍊</p>
    <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#FDFBF7;margin:0 0 4px;">
      We&rsquo;ll miss you!
    </h1>
    <p style="font-size:14px;color:#C5D1BF;margin:0;letter-spacing:1px;text-transform:uppercase;">
      Olivia Linh Iyer&rsquo;s 1st Birthday
    </p>
  </div>

  <!-- Body -->
  <div style="padding:32px;text-align:center;">
    <p style="font-size:17px;color:#2D3A28;line-height:1.7;margin:0 0 16px;">
      Thanks for letting us know, <strong>${name}</strong>.
    </p>
    <p style="font-size:15px;color:#4A5A42;font-style:italic;margin:0;">
      We&rsquo;ll save you a cutie! 🍊
    </p>
  </div>

  <!-- Footer -->
  <div style="background:#F0F4EE;padding:16px 32px;text-align:center;border-top:1px solid #C5D1BF;">
    <p style="font-size:12px;color:#8B9E82;margin:0;">
      Changed your mind?
      <a href="${SITE_URL}" style="color:#8B9E82;">Update your RSVP here</a>
    </p>
  </div>

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
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping confirmation email')
    return
  }

  const subject = status === 'attending'
    ? "You're confirmed for Olivia Linh Iyer's 1st Birthday! 🍊"
    : "Thanks for letting us know 🍊"

  const result = await getResend().emails.send({
    from: FROM,
    to,
    subject,
    html: status === 'attending'
      ? attendingHtml(name, adult_count, child_count)
      : declinedHtml(name),
  })

  if (result.error) {
    console.error('[email] Resend error:', result.error)
    throw new Error(result.error.message)
  }

  console.log('[email] Sent to', to, '— id:', result.data?.id)
}

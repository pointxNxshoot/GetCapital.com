# Email Templates

Transactional emails built with [React Email](https://react.email) and sent via [Resend](https://resend.com).

## Required env vars

```
RESEND_API_KEY=re_...
EMAIL_FROM=Get Capital <alexander@get-capital.com.au>
EMAIL_REPLY_TO=alexander@get-capital.com.au
ADMIN_EMAIL=alexander@get-capital.com.au
APP_URL=https://get-capital.com.au
```

## Templates

| Template | Trigger | Phase |
|---|---|---|
| `notify-confirmation` | Email signup on /valuation or /listings | Pre-launch |
| `admin-alert-notify` | Same (sent to admin) | Pre-launch |
| `welcome` | Account creation | Pre-launch |
| `contact-auto-reply` | Contact form submission | Pre-launch |
| `contact-admin-alert` | Contact form (sent to admin) | Pre-launch |
| `listing-submitted` | Owner submits listing | Phase 3 |
| `listing-approved` | Admin approves listing | Phase 3 |
| `listing-rejected` | Admin rejects listing | Phase 3 |
| `new-inquiry` | Buyer inquires on listing | Phase 5 |
| `inquiry-approved` | Owner approves buyer | Phase 5 |
| `launch-announcement` | Manual send to all signups | Launch |

## Supabase verification email

A custom HTML template is at `_supabase/verify-email.html`. To use it:
1. Go to Supabase → Authentication → Email Templates → Confirm signup
2. Replace the default HTML with the contents of `verify-email.html`
3. Save

## Sending emails

```ts
import { sendEmail } from "@/lib/email";
import NotifyConfirmation from "@/emails/notify-confirmation";
import { createElement } from "react";

await sendEmail({
  to: "user@example.com",
  subject: "You're on the list",
  react: createElement(NotifyConfirmation, { email: "user@example.com", source: "valuation" }),
});
```

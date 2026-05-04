import { Resend } from "resend";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || "Get Capital <alexander@get-capital.com.au>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "alexander@get-capital.com.au";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
}: SendEmailOptions): Promise<{ id: string } | { error: string }> {
  try {
    const html = await render(react);

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      replyTo: replyTo || REPLY_TO,
      html,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { error: error.message };
    }

    return { id: data?.id || "unknown" };
  } catch (err) {
    console.error("[email] Send failed:", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

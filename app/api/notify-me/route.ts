import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "alexander@get-capital.com.au";
const FROM_EMAIL = "Capital <alexander@get-capital.com.au>";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  page_source: z.enum(["valuation", "listings", "general"]),
});

const featureNames: Record<string, string> = {
  valuation: "Valuation Tool",
  listings: "Marketplace Listings",
  general: "Capital",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, page_source } = parsed.data;
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Upsert: insert or increment submission_count
    const { error: dbError } = await supabase.rpc("upsert_notify_signup", {
      p_email: email,
      p_page_source: page_source,
      p_ip_address: ip,
      p_user_agent: userAgent,
    });

    if (dbError) {
      console.error("DB upsert error:", dbError);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    const featureName = featureNames[page_source];

    // Send confirmation email to user
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You're on the list — ${featureName} launching soon`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <p style="font-size: 16px; line-height: 1.6; color: #0A0A0A;">
            You're signed up to be notified when <strong>${featureName}</strong> goes live on Capital.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #0A0A0A;">
            We're in the final stages of building and testing. You'll be among the first to know.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #5C5C58; margin-top: 32px;">
            In the meantime, feel free to reply to this email if you have questions or want to chat.
          </p>
          <p style="font-size: 14px; color: #8C8C88; margin-top: 40px;">
            — The Capital team
          </p>
        </div>
      `,
    });

    // Send admin notification
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New notify-me signup: ${page_source}`,
      html: `
        <div style="font-family: monospace; padding: 20px;">
          <p><strong>New signup for:</strong> ${featureName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Page:</strong> ${page_source}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>IP:</strong> ${ip}</p>
          <p><strong>UA:</strong> ${userAgent}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("notify-me error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

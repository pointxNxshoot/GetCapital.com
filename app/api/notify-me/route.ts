import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";
import NotifyConfirmation from "@/emails/notify-confirmation";
import AdminAlertNotify from "@/emails/admin-alert-notify";
import { createElement } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "alexander@get-capital.com.au";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  page_source: z.enum(["valuation", "listings", "general"]),
});

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

    // Send emails in parallel
    await Promise.all([
      sendEmail({
        to: email,
        subject: "You're on the list",
        react: createElement(NotifyConfirmation, {
          email,
          source: page_source as "valuation" | "listings",
        }),
      }),
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `New signup: ${email}`,
        react: createElement(AdminAlertNotify, {
          email,
          source: page_source,
          timestamp: new Date().toISOString(),
          userAgent,
        }),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("notify-me error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

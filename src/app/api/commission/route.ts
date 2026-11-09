import { NextResponse } from "next/server";

interface CommissionRequestBody {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  capabilities?: string[];
  scope?: string;
  locale?: string;
  honeypot?: string;
  elapsedMs?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CommissionRequestBody;

    // 1. Spam / Honeypot & Timing Guard
    if (
      (typeof body.honeypot === "string" && body.honeypot.trim() !== "") ||
      (typeof body.elapsedMs === "number" && body.elapsedMs < 1200)
    ) {
      return NextResponse.json(
        { accepted: false, error: "Spam check rejected request." },
        { status: 400 }
      );
    }

    // 2. Server-side Field Validation
    const name = (body.name || "").trim();
    const company = (body.company || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const scope = (body.scope || "").trim();
    const capabilities = Array.isArray(body.capabilities)
      ? body.capabilities.map((c) => String(c))
      : [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      name.length < 2 ||
      company.length < 2 ||
      !emailRegex.test(email) ||
      scope.length < 20
    ) {
      return NextResponse.json(
        { accepted: false, error: "Invalid commission brief fields." },
        { status: 422 }
      );
    }

    // 3. Verify that a live backend delivery channel is configured.
    // Never claim acceptance if no backend delivery integration is configured.
    const webhookUrl = process.env.COMMISSION_WEBHOOK_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const receiverEmail =
      process.env.COMMISSION_RECEIVER_EMAIL || "dispatch@publimarca.do";

    if (webhookUrl) {
      const upstream = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          capabilities,
          scope,
          locale: body.locale || "en",
          receivedAt: new Date().toISOString()
        })
      });

      if (upstream.ok) {
        return NextResponse.json({ accepted: true }, { status: 200 });
      }
    }

    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Publimarca Dispatch <onboarding@resend.dev>",
          to: [receiverEmail],
          reply_to: email,
          subject: `Commission Brief — ${company}`,
          text: [
            `Name / Title: ${name}`,
            `Company / Venture: ${company}`,
            `Email: ${email}`,
            `Telephone: ${phone || "Not provided"}`,
            `Capabilities: ${capabilities.join(", ") || "General Inquiry"}`,
            `Scope:\n${scope}`
          ].join("\n")
        })
      });

      if (resendRes.ok) {
        return NextResponse.json({ accepted: true }, { status: 200 });
      }
    }

    return NextResponse.json(
      {
        accepted: false,
        configured: false,
        error:
          "No live backend delivery service (COMMISSION_WEBHOOK_URL or RESEND_API_KEY) is configured."
      },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { accepted: false, error: "Malformed request payload." },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Poruka je obavezna" }, { status: 400 });
    }

    await sendContactEmail({ name: name || "", email: email || "", message });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Contact form error:", e);
    return NextResponse.json({ error: "Greška" }, { status: 500 });
  }
}

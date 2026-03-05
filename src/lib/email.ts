import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = "annon-marketing@proton.me";

export async function notifyNewAd(ad: {
  title: string;
  slug: string;
  description: string;
  userName: string;
  userEmail: string;
}) {
  try {
    await resend.emails.send({
      from: "TransOglasi <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `Novi oglas: ${ad.title}`,
      html: `
        <h2>Novi oglas objavljen</h2>
        <p><strong>Naslov:</strong> ${ad.title}</p>
        <p><strong>Opis:</strong> ${ad.description.slice(0, 300)}${ad.description.length > 300 ? "..." : ""}</p>
        <p><strong>Korisnik:</strong> ${ad.userName} (${ad.userEmail})</p>
        <p><a href="https://transice-oglasi.com/hr/oglas/${ad.slug}">Pogledaj oglas</a></p>
      `,
    });
  } catch (error) {
    console.error("Email notification failed:", error);
  }
}

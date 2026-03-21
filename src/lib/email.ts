import nodemailer from "nodemailer";

const NOTIFY_EMAIL = "annon-marketing@proton.me";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function notifyNewAd(ad: {
  title: string;
  slug: string;
  description: string;
  userName: string;
  userEmail: string;
}) {
  try {
    await transporter.sendMail({
      from: `TransOglasi <${process.env.GMAIL_USER}>`,
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

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    await transporter.sendMail({
      from: `TransOglasi <${process.env.GMAIL_USER}>`,
      to: NOTIFY_EMAIL,
      subject: `Kontakt forma - ${data.name || "Anonimno"}`,
      text: `Ime: ${data.name || "N/A"}\nEmail: ${data.email || "N/A"}\n\nPoruka:\n${data.message}`,
    });
  } catch (error) {
    console.error("Contact email failed:", error);
  }
}

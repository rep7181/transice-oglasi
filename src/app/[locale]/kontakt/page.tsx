import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt",
};

export default function KontaktPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Kontakt</h1>
      <p className="text-sm text-gray-500 mb-6">
        Imate pitanje, prijedlog ili problem? Pošaljite nam poruku i odgovorit ćemo u najkraćem roku.
      </p>
      <ContactForm />
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="text-green-400 text-sm">Poruka poslana! Hvala na kontaktu.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-2xl">
      <input
        type="text"
        placeholder="Ime (opcionalno)"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="bg-primary-light border border-primary-light rounded px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 w-full md:w-32"
      />
      <input
        type="email"
        placeholder="Email (opcionalno)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="bg-primary-light border border-primary-light rounded px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 w-full md:w-44"
      />
      <input
        type="text"
        placeholder="Poruka..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
        className="bg-primary-light border border-primary-light rounded px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 flex-1"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-white text-primary text-xs font-bold px-4 py-2 rounded hover:bg-gray-200 transition disabled:opacity-50 whitespace-nowrap"
      >
        {status === "sending" ? "Šaljem..." : "Pošalji"}
      </button>
    </form>
  );
}

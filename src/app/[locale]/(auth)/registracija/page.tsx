"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Lozinke se ne podudaraju");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/profil");
      router.refresh();
    } catch {
      setError("Greška pri registraciji");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Registracija</h1>
          <p className="text-text-light text-center text-sm mb-6">
            Kreiraj besplatni račun
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ime / Nick</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="Vaše ime ili nadimak"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="vas@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Telefon <span className="text-text-light">(opcionalno)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="+385 91 234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lozinka</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="Najmanje 6 znakova"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Potvrdi lozinku
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="Ponovite lozinku"
                minLength={6}
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="age"
                required
                className="mt-1 rounded border-border"
              />
              <label htmlFor="age" className="text-xs text-text-light">
                Potvrđujem da imam 18 ili više godina i prihvaćam{" "}
                <Link href="/pravila" className="text-primary">
                  pravila korištenja
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Registracija..." : "Registriraj se"}
            </button>
          </form>

          <p className="text-center text-sm text-text-light mt-6">
            Već imaš račun?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

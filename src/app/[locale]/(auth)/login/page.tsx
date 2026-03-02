"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/profil");
      router.refresh();
    } catch {
      setError("Greška pri prijavi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Prijava</h1>
          <p className="text-text-light text-center text-sm mb-6">
            Prijavi se na svoj račun
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="vas@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lozinka</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="Vaša lozinka"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Prijava..." : "Prijavi se"}
            </button>
          </form>

          <p className="text-center text-sm text-text-light mt-6">
            Nemaš račun?{" "}
            <Link
              href="/registracija"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Registriraj se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

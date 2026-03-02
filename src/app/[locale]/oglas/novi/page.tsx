"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, CATEGORIES } from "@/lib/countries";

export default function NewAdPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    age: "",
    price: "",
    phone: "",
    whatsapp: "",
    viber: "",
    telegram: "",
    countrySlug: "",
    regionSlug: "",
    citySlug: "",
    categorySlug: "",
  });

  const selectedCountry = COUNTRIES.find((c) => c.slug === form.countrySlug);
  const selectedRegion = selectedCountry?.regions.find(
    (r) => r.slug === form.regionSlug
  );

  function updateField(field: string, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "countrySlug") {
        updated.regionSlug = "";
        updated.citySlug = "";
      }
      if (field === "regionSlug") {
        updated.citySlug = "";
      }
      return updated;
    });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      setError("Maksimalno 10 slika");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  }

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [images]);

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error || "Greška pri uploadu slika");
        }

        const uploadData = await uploadRes.json();
        imageUrls = uploadData.urls;
      }

      // Create ad
      const res = await fetch("/api/oglasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Greška pri kreiranju oglasa");
      }

      router.push(`/oglas/${data.ad.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Postavi novi oglas</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Osnovne informacije</h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              Naslov oglasa *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
              placeholder="npr. Ana - Zagreb, dostupna danas"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Opis *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm h-32 resize-y"
              placeholder="Opišite sebe i usluge koje nudite..."
              required
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Kategorija *
              </label>
              <select
                value={form.categorySlug}
                onChange={(e) => updateField("categorySlug", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-white"
                required
              >
                <option value="">Odaberi...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Godine</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="25"
                min={18}
                max={99}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Cijena (&euro;)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
              placeholder="Ostavi prazno za 'Po dogovoru'"
              min={0}
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Lokacija</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Država *</label>
            <select
              value={form.countrySlug}
              onChange={(e) => updateField("countrySlug", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-white"
              required
            >
              <option value="">Odaberi državu...</option>
              {COUNTRIES.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCountry && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Regija / Općina
              </label>
              <select
                value={form.regionSlug}
                onChange={(e) => updateField("regionSlug", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-white"
              >
                <option value="">Odaberi regiju...</option>
                {selectedCountry.regions.map((region) => (
                  <option key={region.slug} value={region.slug}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedRegion && (
            <div>
              <label className="block text-sm font-medium mb-1">Grad</label>
              <select
                value={form.citySlug}
                onChange={(e) => updateField("citySlug", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-white"
              >
                <option value="">Odaberi grad...</option>
                {selectedRegion.cities.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Kontakt</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
              placeholder="+385 91 234 5678"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="+385..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Viber</label>
              <input
                type="text"
                value={form.viber}
                onChange={(e) => updateField("viber", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="+385..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telegram</label>
              <input
                type="text"
                value={form.telegram}
                onChange={(e) => updateField("telegram", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm"
                placeholder="@username"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Slike</h2>
          <p className="text-sm text-text-light">
            Dodaj do 10 slika. Prva slika će biti naslovna.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {previews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                <img
                  src={url}
                  alt={`Slika ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  X
                </button>
              </div>
            ))}

            {images.length < 10 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center text-text-light hover:text-primary transition">
                <svg
                  className="w-8 h-8 mb-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-xs">Dodaj</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 text-lg"
          >
            {loading ? "Objavljivanje..." : "Objavi oglas"}
          </button>
        </div>

        <p className="text-xs text-text-light text-center">
          Objavom oglasa potvrđujete da imate 18+ godina i da se slažete sa
          pravilima korištenja.
        </p>
      </form>
    </div>
  );
}

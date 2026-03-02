import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/i18n/navigation";

export default async function AdminPage() {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    redirect("/login");
  }

  if (!user || user.role !== "ADMIN") redirect("/");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-text-light text-sm">Ukupno oglasa</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-text-light text-sm">Čeka odobrenje</p>
          <p className="text-3xl font-bold mt-1 text-accent">0</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-text-light text-sm">Aktivni oglasi</p>
          <p className="text-3xl font-bold mt-1 text-green-600">0</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-5">
          <p className="text-text-light text-sm">Registrirani korisnici</p>
          <p className="text-3xl font-bold mt-1">0</p>
        </div>
      </div>

      {/* Pending ads */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Oglasi na čekanju</h2>

        <div className="text-center py-8 text-text-light">
          <p>Nema oglasa na čekanju</p>
        </div>

        {/* Table structure for when there are ads */}
        <div className="hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium">Naslov</th>
                <th className="pb-3 font-medium">Korisnik</th>
                <th className="pb-3 font-medium">Lokacija</th>
                <th className="pb-3 font-medium">Datum</th>
                <th className="pb-3 font-medium">Akcije</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3">
                  <Link href="#" className="text-primary hover:text-primary-dark">
                    Primjer oglasa
                  </Link>
                </td>
                <td className="py-3">user@email.com</td>
                <td className="py-3">Zagreb, HR</td>
                <td className="py-3">28.02.2026</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs font-medium transition">
                      Odobri
                    </button>
                    <button className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium transition">
                      Odbij
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-2">Upravljaj korisnicima</h3>
          <p className="text-sm text-text-light mb-4">
            Pregledaj i upravljaj korisničkim računima
          </p>
          <Link
            href="/admin/korisnici"
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            Otvori &rarr;
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-2">Svi oglasi</h3>
          <p className="text-sm text-text-light mb-4">
            Pregledaj sve oglase po statusu
          </p>
          <Link
            href="/admin/oglasi"
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            Otvori &rarr;
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-2">Postavke</h3>
          <p className="text-sm text-text-light mb-4">
            Kategorije, lokacije, pravila sajta
          </p>
          <Link
            href="/admin/postavke"
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            Otvori &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "@/i18n/navigation";

export default async function ProfilePage() {
  let user;
  try {
    user = await getCurrentUser();
  } catch {
    redirect("/login");
  }

  if (!user) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Moj profil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-border p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-3">
            {user.name[0]}
          </div>
          <h2 className="font-semibold text-lg">{user.name}</h2>
          <p className="text-sm text-text-light">{user.email}</p>
          {user.phone && (
            <p className="text-sm text-text-light mt-1">{user.phone}</p>
          )}

          <form action="/api/auth/logout" method="POST" className="mt-4">
            <button
              type="submit"
              className="text-sm text-red-500 hover:text-red-600 transition"
            >
              Odjavi se
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Moji oglasi</h2>
              <Link
                href="/oglas/novi"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                + Novi oglas
              </Link>
            </div>

            <div className="text-center py-8 text-text-light">
              <p className="mb-2">Nemate još nijedan oglas</p>
              <Link
                href="/oglas/novi"
                className="text-primary hover:text-primary-dark font-medium text-sm"
              >
                Postavite svoj prvi oglas
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-lg mb-4">Kontakt informacije</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-light block mb-1">WhatsApp</span>
                <span>{user.whatsapp || "Nije postavljeno"}</span>
              </div>
              <div>
                <span className="text-text-light block mb-1">Viber</span>
                <span>{user.viber || "Nije postavljeno"}</span>
              </div>
              <div>
                <span className="text-text-light block mb-1">Telegram</span>
                <span>{user.telegram || "Nije postavljeno"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

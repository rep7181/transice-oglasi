import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika privatnosti",
};

export default function PrivatnostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Politika privatnosti</h1>
      <div className="prose prose-sm text-text space-y-4 text-sm leading-relaxed">
        <p><strong>Zadnje ažuriranje:</strong> 21. ožujka 2026.</p>

        <h2 className="text-lg font-bold mt-6">1. Uvod</h2>
        <p>Ova Politika privatnosti opisuje kako transice-oglasi.com (u daljnjem tekstu: &quot;Stranica&quot;) prikuplja, koristi i štiti vaše osobne podatke. Korištenjem Stranice pristajete na obradu podataka opisanu u ovoj politici.</p>

        <h2 className="text-lg font-bold mt-6">2. Podaci koje prikupljamo</h2>
        <p>Prikupljamo sljedeće podatke:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Podaci iz oglasa:</strong> naslov, opis, kontakt podaci (telefon, WhatsApp, Viber, Telegram), lokacija, dob i slike koje korisnik dobrovoljno objavi</li>
          <li><strong>Kontakt forma:</strong> ime, email adresa i poruka koju korisnik pošalje</li>
          <li><strong>Automatski podaci:</strong> IP adresa, vrsta preglednika, operativni sustav, stranice koje posjećujete i vrijeme posjeta</li>
          <li><strong>Kolačići:</strong> koristimo kolačiće za funkcionalnost stranice i analitiku</li>
        </ul>

        <h2 className="text-lg font-bold mt-6">3. Kako koristimo podatke</h2>
        <p>Vaše podatke koristimo za:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Prikazivanje oglasa na Stranici</li>
          <li>Odgovaranje na upite putem kontakt forme</li>
          <li>Poboljšanje funkcionalnosti i korisničkog iskustva</li>
          <li>Zaštitu od zlouporabe i neželjenog sadržaja</li>
          <li>Statističku analizu posjećenosti</li>
        </ul>

        <h2 className="text-lg font-bold mt-6">4. Dijeljenje podataka</h2>
        <p>Ne prodajemo niti dijelimo vaše osobne podatke s trećim stranama, osim:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Kada je to potrebno za pružanje usluge (npr. hosting provideri)</li>
          <li>Kada smo zakonski obvezni (npr. na zahtjev nadležnih tijela)</li>
          <li>Kontakt podaci iz oglasa su javno vidljivi jer ih korisnik dobrovoljno objavljuje</li>
        </ul>

        <h2 className="text-lg font-bold mt-6">5. Kolačići</h2>
        <p>Stranica koristi kolačiće za:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Neophodni kolačići:</strong> za rad stranice i odabir jezika</li>
          <li><strong>Analitički kolačići:</strong> za praćenje posjećenosti (Google Analytics)</li>
          <li><strong>Kolačići trećih strana:</strong> oglašivački partneri mogu koristiti vlastite kolačiće</li>
        </ul>
        <p>Možete upravljati kolačićima u postavkama svog preglednika.</p>

        <h2 className="text-lg font-bold mt-6">6. Sigurnost podataka</h2>
        <p>Poduzimamo razumne tehničke i organizacijske mjere za zaštitu vaših podataka od neovlaštenog pristupa, gubitka ili zlouporabe. Međutim, nijedan prijenos podataka putem interneta nije 100% siguran.</p>

        <h2 className="text-lg font-bold mt-6">7. Vaša prava</h2>
        <p>Imate pravo:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Zatražiti pristup svojim osobnim podacima</li>
          <li>Zatražiti ispravak netočnih podataka</li>
          <li>Zatražiti brisanje svojih podataka i oglasa</li>
          <li>Povući privolu za obradu podataka</li>
        </ul>
        <p>Za ostvarivanje ovih prava kontaktirajte nas putem kontakt forme.</p>

        <h2 className="text-lg font-bold mt-6">8. Zadržavanje podataka</h2>
        <p>Oglase i pripadajuće podatke zadržavamo dok su aktivni na Stranici. Nakon uklanjanja oglasa, podaci se brišu u razumnom roku. Anonimne statističke podatke možemo zadržati neograničeno.</p>

        <h2 className="text-lg font-bold mt-6">9. Vanjske poveznice</h2>
        <p>Stranica može sadržavati poveznice na druge web stranice. Ne odgovaramo za politike privatnosti ili sadržaj tih stranica.</p>

        <h2 className="text-lg font-bold mt-6">10. Izmjene politike</h2>
        <p>Zadržavamo pravo izmjene ove Politike privatnosti u bilo kojem trenutku. Preporučujemo povremeno provjeriti ovu stranicu.</p>

        <h2 className="text-lg font-bold mt-6">11. Kontakt</h2>
        <p>Za sva pitanja vezana uz privatnost, kontaktirajte nas putem kontakt forme u podnožju stranice.</p>
      </div>
    </div>
  );
}

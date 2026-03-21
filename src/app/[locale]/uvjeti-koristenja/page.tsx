import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uvjeti korištenja",
};

export default function UvjetiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Uvjeti korištenja</h1>
      <div className="prose prose-sm text-text space-y-4 text-sm leading-relaxed">
        <p><strong>Zadnje ažuriranje:</strong> 21. ožujka 2026.</p>

        <h2 className="text-lg font-bold mt-6">1. Prihvaćanje uvjeta</h2>
        <p>Korištenjem web stranice transice-oglasi.com (u daljnjem tekstu: &quot;Stranica&quot;) pristajete na ove Uvjete korištenja. Ako se ne slažete s ovim uvjetima, molimo vas da ne koristite Stranicu.</p>

        <h2 className="text-lg font-bold mt-6">2. Dobna granica</h2>
        <p>Stranica je namijenjena isključivo osobama starijim od 18 godina. Korištenjem Stranice potvrđujete da imate najmanje 18 godina. Stranica ne preuzima odgovornost za pristup maloljetnih osoba.</p>

        <h2 className="text-lg font-bold mt-6">3. Opis usluge</h2>
        <p>Stranica pruža besplatnu platformu za objavljivanje osobnih oglasa i kontakata. Stranica ne naplaćuje objavljivanje oglasa i ne sudjeluje u transakcijama između korisnika.</p>

        <h2 className="text-lg font-bold mt-6">4. Korisničke obveze</h2>
        <p>Korisnici se obvezuju da:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Neće objavljivati sadržaj koji uključuje maloljetne osobe</li>
          <li>Neće objavljivati lažne ili obmanjujuće informacije</li>
          <li>Neće koristiti Stranicu za nezakonite aktivnosti</li>
          <li>Neće objavljivati sadržaj koji krši prava trećih osoba</li>
          <li>Neće slati neželjene poruke (spam) drugim korisnicima</li>
          <li>Snose punu odgovornost za sadržaj koji objave</li>
        </ul>

        <h2 className="text-lg font-bold mt-6">5. Sadržaj korisnika</h2>
        <p>Korisnici su u potpunosti odgovorni za sadržaj koji objave na Stranici. Stranica ne pregledava, ne odobrava i ne jamči za točnost ili zakonitost objavljenog sadržaja. Zadržavamo pravo ukloniti bilo koji sadržaj bez prethodne najave.</p>

        <h2 className="text-lg font-bold mt-6">6. Ograničenje odgovornosti</h2>
        <p>Stranica se pruža &quot;takva kakva jest&quot; bez ikakvih jamstava. Ne odgovaramo za:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Točnost, potpunost ili pouzdanost sadržaja koji objave korisnici</li>
          <li>Bilo kakvu štetu nastalu korištenjem Stranice</li>
          <li>Interakcije između korisnika</li>
          <li>Prekide u radu ili nedostupnost Stranice</li>
        </ul>

        <h2 className="text-lg font-bold mt-6">7. Intelektualno vlasništvo</h2>
        <p>Dizajn, logotip i izvorni kod Stranice vlasništvo su operatora Stranice. Korisnici zadržavaju prava na sadržaj koji objave, ali daju Stranici neekskluzivnu licencu za prikazivanje tog sadržaja.</p>

        <h2 className="text-lg font-bold mt-6">8. Uklanjanje sadržaja</h2>
        <p>Ako želite ukloniti svoj oglas ili prijaviti neprimjeren sadržaj, kontaktirajte nas putem kontakt forme u podnožju stranice. Trudimo se obraditi zahtjeve u roku od 48 sati.</p>

        <h2 className="text-lg font-bold mt-6">9. Izmjene uvjeta</h2>
        <p>Zadržavamo pravo izmjene ovih Uvjeta u bilo kojem trenutku. Nastavak korištenja Stranice nakon izmjena smatra se prihvaćanjem novih uvjeta.</p>

        <h2 className="text-lg font-bold mt-6">10. Kontakt</h2>
        <p>Za sva pitanja vezana uz ove Uvjete korištenja, kontaktirajte nas putem kontakt forme na Stranici.</p>
      </div>
    </div>
  );
}

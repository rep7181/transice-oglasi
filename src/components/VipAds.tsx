"use client";

const AFFILIATE_URL = "https://offers.cam4tracking.com/aff_c?offer_id=3354&aff_id=9005";

const vipAds = [
  {
    title: "Seksi trans djevojka dostupna za webcam show",
    description: "Zgodna i iskusna trans djevojka nudi privatne webcam sesije. Uživo show, sexting i video pozivi. Diskrecija zagarantirana. Dostupna 24/7 za tvoje uživanje.",
    city: "Online",
    category: "Webcam",
    age: 23,
  },
  {
    title: "Vruća transica čeka tvoj poziv - live cam",
    description: "Prelijepa latinoamerikanka trans model sa savršenim tijelom. Privatni show uživo, ispuni svoje fantazije. Registracija besplatna!",
    city: "Online",
    category: "Webcam",
    age: 25,
  },
  {
    title: "Trans model - besplatna registracija za cam show",
    description: "Atraktivna trans djevojka nudi ekskluzivne privatne webcam nastupe. Interaktivni show uživo. Pridruži se besplatno i uživaj!",
    city: "Online",
    category: "Webcam",
    age: 22,
  },
  {
    title: "Egzotična trans ljepotica - webcam uživo",
    description: "Senzualna i zavodljiva trans dama s iskustvom. Privatni video chat, ispunjavanje želja uživo. Besplatan pristup!",
    city: "Online",
    category: "Webcam",
    age: 27,
  },
];

function VipCard({ ad }: { ad: typeof vipAds[0] }) {
  return (
    <a
      href={AFFILIATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-lg shadow-sm overflow-hidden border border-border block hover:shadow-md transition"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">VIP</span>
          <span className="text-xs text-text-muted">({ad.age} god.)</span>
        </div>
        <span className="text-[11px] text-text-muted">upravo sada</span>
      </div>
      <div className="px-4 py-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted border-b border-gray-100">
        <span className="inline-flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
          {ad.category}
        </span>
        <span className="font-medium text-text">{ad.city}</span>
      </div>
      <div className="px-4 py-2.5">
        <p className="text-sm text-text leading-relaxed">{ad.description}</p>
      </div>
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">{ad.category}</span>
        <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-medium px-2 py-0.5 rounded-full">{ad.city}</span>
      </div>
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-xs bg-black text-white px-3 py-1.5 rounded font-medium">Detalji</span>
        <span className="text-[11px] text-text-muted">0 pregleda</span>
      </div>
    </a>
  );
}

export default function VipAds() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {vipAds.map((ad, i) => (
        <VipCard key={i} ad={ad} />
      ))}
    </div>
  );
}

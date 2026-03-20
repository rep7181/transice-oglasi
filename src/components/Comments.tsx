"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export default function Comments({ adId }: { adId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/oglasi/${adId}/comments`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});
  }, [adId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/oglasi/${adId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "Anonimno", text: text.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [comment, ...prev]);
        setText("");
      }
    } catch {}
    setSending(false);
  }

  function timeAgo(date: string) {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return "upravo sada";
    if (s < 3600) return `prije ${Math.floor(s / 60)} min`;
    if (s < 86400) return `prije ${Math.floor(s / 3600)}h`;
    if (s < 604800) return `prije ${Math.floor(s / 86400)} dana`;
    return `prije ${Math.floor(s / 604800)} tj.`;
  }

  return (
    <div className="bg-white rounded-lg border border-border p-5">
      <h3 className="font-bold text-sm text-primary mb-4">
        Komentari ({comments.length})
      </h3>

      {/* Form */}
      <form onSubmit={submit} className="space-y-2 mb-4">
        <input
          type="text"
          placeholder="Ime (opcionalno)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <textarea
          placeholder="Napiši komentar..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
        >
          {sending ? "Šaljem..." : "Objavi komentar"}
        </button>
      </form>

      {/* List */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text">{c.name}</span>
                <span className="text-[11px] text-text-muted">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-text leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-muted">Još nema komentara. Budi prvi!</p>
      )}
    </div>
  );
}

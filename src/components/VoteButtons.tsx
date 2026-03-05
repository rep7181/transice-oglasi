"use client";

import { useState, useEffect } from "react";

interface VoteButtonsProps {
  adId: string;
  initialLikes: number;
  initialDislikes: number;
}

function getVotes(): Record<string, "like" | "dislike"> {
  try {
    return JSON.parse(localStorage.getItem("votes") || "{}");
  } catch {
    return {};
  }
}

export default function VoteButtons({ adId, initialLikes, initialDislikes }: VoteButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [voted, setVoted] = useState<"like" | "dislike" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const votes = getVotes();
    if (votes[adId]) {
      setVoted(votes[adId]);
    }
  }, [adId]);

  async function vote(type: "like" | "dislike") {
    if (voted || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/oglasi/${adId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setVoted(type);

        const votes = getVotes();
        votes[adId] = type;
        localStorage.setItem("votes", JSON.stringify(votes));
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => vote("like")}
        disabled={voted !== null || loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
          voted === "like"
            ? "bg-gray-200 border-gray-400 text-gray-700"
            : voted
              ? "bg-gray-50 border-border text-text-light cursor-not-allowed"
              : "bg-white border-border text-text hover:bg-gray-50 hover:border-gray-400"
        }`}
      >
        <span>👍</span> Sviđa mi se <span className="font-bold">{likes}</span>
      </button>
      <button
        onClick={() => vote("dislike")}
        disabled={voted !== null || loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
          voted === "dislike"
            ? "bg-red-100 border-red-400 text-red-700"
            : voted
              ? "bg-gray-50 border-border text-text-light cursor-not-allowed"
              : "bg-white border-border text-text hover:bg-red-50 hover:border-red-300"
        }`}
      >
        <span>👎</span> Ne sviđa mi se <span className="font-bold">{dislikes}</span>
      </button>
    </div>
  );
}

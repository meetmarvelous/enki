"use client";
import { Heart } from "lucide-react";
import type { Prompt } from "@/lib/data";

interface CardProps {
  p: Prompt;
  onOpen?: (p: Prompt) => void;
  faved: boolean;
  toggleFav: (id: string) => void;
}

export default function Card({ p, onOpen, faved, toggleFav }: CardProps) {
  return (
    <div className="enki-card" onClick={() => onOpen?.(p)}>
      <div className="enki-card-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.art.url} alt={p.title} />
        <span className={`enki-card-badge${p.isVideo ? ' video' : ''}`}>{p.isVideo ? 'Video' : 'Image'}</span>
        <div className="enki-card-tl-hover">
          <span className="enki-card-stat mono">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>
            {p.downloads.toLocaleString()}
          </span>
          <span className="enki-card-stat mono enki-card-stat-price">${p.price.toFixed(2)}</span>
        </div>
        <button
          className={`enki-heart${faved ? ' active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
        >
          <Heart size={14} fill={faved ? 'currentColor' : 'none'} />
        </button>
        <div className="enki-card-overlay">
          <div className="enki-card-overlay-bottom">
            <div className="enki-card-overlay-title serif">{p.title}</div>
            <div className="enki-card-overlay-artist mono">{p.artist.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { ChevronDown } from "lucide-react";

interface FiltersProps {
  active: string[];
  toggle: (tag: string) => void;
}

export default function Filters({ active, toggle }: FiltersProps) {
  const quick = ['portrait', 'cinematic', 'infographic', 'architecture', 'editorial', 'abstract'];
  return (
    <div className="enki-filters">
      <span className="enki-chip" style={{ background: 'transparent', border: 'none', color: 'var(--ink-3)', fontFamily: 'var(--mono)', textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.12em', paddingLeft: 0 }}>Tags ·</span>
      {quick.map(t => (
        <span key={t} className={`enki-chip${active.includes(t) ? ' active' : ''}`} onClick={() => toggle(t)}>{t}</span>
      ))}
      <span className="enki-chip">+ more</span>
      <span className="enki-filter-divider" />
      <span className="enki-chip">Model: any <ChevronDown size={12} /></span>
      <span className="enki-chip">$0 – $2 <ChevronDown size={12} /></span>
      <div className="enki-sort">
        <span className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Sort</span>
        <strong>Trending</strong>
        <ChevronDown size={12} />
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import DetailPanel from "@/components/DetailPanel";
import { PROMPTS, MODELS } from "@/lib/data";
import type { Prompt } from "@/lib/data";

export default function SearchPage() {
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<Prompt | null>(null);
  const active = ['infographic', 'editorial'];
  const list = PROMPTS.filter(p => p.tags.some(t => active.includes(t)));

  const toggleFav = (id: string) => {
    setFavs(s => ({ ...s, [id]: !s[id] }));
  };

  return (
    <>
      <Header active="search" />
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr' }}>
        <div className="enki-filter-sidebar">
          <div style={{ marginBottom: 32 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>Searching for</div>
            <div className="serif" style={{ fontSize: 24, fontStyle: 'italic', lineHeight: 1.1 }}>&quot;infographic prompts for editorial use&quot;</div>
          </div>
          <div className="enki-filter-group">
            <div className="enki-filter-group-title">Type</div>
            <div className="enki-filter-row"><span><input type="checkbox" defaultChecked />Images</span><span className="enki-filter-count">18</span></div>
            <div className="enki-filter-row"><span><input type="checkbox" />Videos</span><span className="enki-filter-count">6</span></div>
          </div>
          <div className="enki-filter-group">
            <div className="enki-filter-group-title">Tags</div>
            {['infographic', 'editorial', 'minimal', 'portrait', 'cinematic', 'architecture', 'abstract', 'dramatic'].map((t, i) => (
              <div key={t} className="enki-filter-row">
                <span><input type="checkbox" defaultChecked={active.includes(t)} />{t}</span>
                <span className="enki-filter-count">{(i * 3 + 5) % 18 + 2}</span>
              </div>
            ))}
          </div>
          <div className="enki-filter-group">
            <div className="enki-filter-group-title">Model</div>
            {MODELS.slice(0, 5).map((m, i) => (
              <div key={m} className="enki-filter-row">
                <span><input type="checkbox" defaultChecked={i < 2} />{m}</span>
                <span className="enki-filter-count">{(i * 5 + 3) % 14 + 1}</span>
              </div>
            ))}
          </div>
          <div className="enki-filter-group">
            <div className="enki-filter-group-title">Price</div>
            <div style={{ padding: '8px 0' }}>
              <input type="range" min={0} max={5} defaultValue={2} step={0.05} style={{ width: '100%', accentColor: 'var(--ember)' }} />
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span>$0.00</span><span>up to $2.00</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ padding: '24px 40px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--rule)' }}>
            <div>
              <div className="enki-page-eyebrow">Results · {list.length} prompts</div>
              <h2 className="serif" style={{ fontSize: 36, fontStyle: 'italic', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1 }}>Filtered.</h2>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {active.map(t => (
                <span key={t} className="enki-chip active">{t} <span className="enki-chip-x">×</span></span>
              ))}
              <span className="enki-chip" style={{ background: 'transparent', border: '1px dashed var(--rule)', color: 'var(--ink-3)' }}>Clear all</span>
            </div>
          </div>
          <div className="enki-masonry" style={{ paddingTop: 24, columnCount: 3 }}>
            {list.map(p => (
              <Card key={p.id} p={p} onOpen={setOpen} faved={!!favs[p.id]} toggleFav={toggleFav} />
            ))}
          </div>
        </div>
      </div>
      {open && (
        <DetailPanel
          p={open}
          onClose={() => setOpen(null)}
          faved={!!favs[open.id]}
          toggleFav={toggleFav}
        />
      )}
    </>
  );
}


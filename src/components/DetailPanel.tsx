"use client";
import { useState, useMemo } from "react";
import { X, Heart, Bookmark, Copy, ChevronDown, Check, Maximize } from "lucide-react";
import type { Prompt } from "@/lib/data";
import { makeArtwork } from "@/lib/data";

interface DetailPanelProps {
  p: Prompt;
  onClose: () => void;
  faved: boolean;
  toggleFav: (id: string) => void;
  activeNetwork: string;
}

export default function DetailPanel({ p, onClose, faved, toggleFav, activeNetwork }: DetailPanelProps) {
  const [vars, setVars] = useState(() => Object.fromEntries(p.variables.map(v => [v.name, v.value])));
  const [activeVar, setActiveVar] = useState(p.variables[0]?.name);
  const [heroIdx, setHeroIdx] = useState(0);
  const [ratio, setRatio] = useState('4:5');
  const [resolution, setResolution] = useState('2K');
  const [generator, setGenerator] = useState('Nano Banana Pro');

  const RATIOS = ['3:4', '4:5', '1:1', '2:3', '4:3', '16:9'];
  const RESOLUTIONS = ['1K', '2K', '4K'];

  const userGenerations = useMemo(() => {
    const seedBase = parseInt(p.id.split('_')[1] || '0') * 7;
    return [0,1,2,3,4,5].map(i => ({
      art: makeArtwork(seedBase + i + 100),
      label: ['2h ago','yesterday','3d ago','1w ago','2w ago','3w ago'][i],
    }));
  }, [p.id]);

  const heroImages = [
    { art: p.art, label: 'Cover', kind: 'cover' as const },
    ...p.versions.map((a, i) => ({ art: a, label: `v0${i+1}`, kind: 'artist' as const })),
    ...userGenerations.map((g, i) => ({ art: g.art, label: `run ${i+1}`, kind: 'user' as const })),
  ];

  const current = heroImages[heroIdx];
  const locked = p.visibility === 'vars-only';

  const tokens = useMemo(() => {
    const out: { type: 't' | 'v'; text?: string; name?: string }[] = [];
    let last = 0;
    const re = /\[(\w+)\]/g;
    let m;
    while ((m = re.exec(p.promptTemplate))) {
      if (m.index > last) out.push({ type: 't', text: p.promptTemplate.slice(last, m.index) });
      out.push({ type: 'v', name: m[1] });
      last = m.index + m[0].length;
    }
    if (last < p.promptTemplate.length) out.push({ type: 't', text: p.promptTemplate.slice(last) });
    return out;
  }, [p.promptTemplate]);

  return (
    <>
      <div className="enki-overlay" onClick={onClose} />
      <aside className="enki-panel" onClick={e => e.stopPropagation()}>
        <button className="enki-panel-close" onClick={onClose} title="Close (Esc)"><X size={14} /></button>

        <div className="enki-panel-hero-stack">
          <div className="enki-panel-hero-main" title="Click to maximize">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.art.url} alt={p.title} />
            <div className="enki-hero-overlay-hint mono">
              {current.kind === 'user' ? `Your run` : current.kind === 'artist' ? `Artist version · ${current.label}` : 'Cover'}
              <span style={{ opacity: 0.6, marginLeft: 8 }}>· click to expand</span>
            </div>
            <button className="enki-hero-maximize" title="Maximize"><Maximize size={14} /></button>
          </div>
          <div className="enki-panel-hero-thumbs">
            {heroImages.slice(0, 5).map((h, i) => (
              <div key={i} className={`enki-hero-thumb${heroIdx === i ? ' active' : ''}`} onClick={() => setHeroIdx(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.art.url} alt="" />
                <div className="enki-hero-thumb-label mono">{h.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="enki-panel-body">
          <div className="enki-panel-eyebrow">
            {p.isVideo ? 'Video prompt' : 'Image prompt'} · {p.publishedAt} · {p.downloads.toLocaleString()} uses
          </div>
          <h1 className="enki-panel-title serif">
            <em>{p.title.split(' ').slice(0, -1).join(' ')}</em> {p.title.split(' ').slice(-1)}
          </h1>

          <div className="enki-panel-by">
            <div className="enki-panel-avatar">{p.artist.avatar}</div>
            <div>
              <div className="enki-panel-by-name">By <strong>{p.artist.name}</strong></div>
              <div className="enki-panel-by-meta">@{p.artist.handle} · {p.model}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <button className={`enki-icon-btn${faved ? ' active' : ''}`} style={{ color: faved ? 'var(--ember)' : 'var(--ink-2)' }} onClick={() => toggleFav(p.id)}>
                <Heart size={14} fill={faved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          <div className="enki-tag-pills">
            {p.tags.map(t => <span key={t} className="enki-tag-pill">{t}</span>)}
          </div>
          <div className="enki-rule" />

          <div className="enki-panel-section-label">
            <span>{locked ? 'Variables · prompt body locked' : 'The prompt'}</span>
            <span className="mono" style={{ textTransform: 'none', letterSpacing: 0 }}>{p.variables.length} variables</span>
          </div>

          {locked ? (
            <div className="enki-prompt-locked">
              <div className="enki-vars-stack">
                {p.variables.map(v => (
                  <div key={v.name} className={`enki-var-row${activeVar === v.name ? ' active' : ''}`} onClick={() => setActiveVar(v.name)}>
                    <div className="enki-var-row-label">{v.label}</div>
                    {v.type === 'checkbox' ? (
                      <label className="enki-var-row-checkbox" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={!!vars[v.name]} onChange={e => setVars(s => ({ ...s, [v.name]: e.target.checked }))} />
                        <span>On</span>
                      </label>
                    ) : (
                      <textarea className="enki-var-row-input" value={String(vars[v.name])} onChange={e => setVars(s => ({ ...s, [v.name]: e.target.value }))} onClick={e => e.stopPropagation()} rows={1} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="enki-prompt-margin">
              <div className="enki-prompt-text serif">
                {tokens.map((tok, i) => {
                  if (tok.type === 't') return <span key={i}>{tok.text}</span>;
                  const v = p.variables.find(x => x.name === tok.name);
                  if (!v) return null;
                  if (v.type === 'checkbox') {
                    return (
                      <span key={i} className={`enki-var checkbox${vars[v.name] ? ' checked' : ''}${activeVar === v.name ? ' active' : ''}`} onClick={() => { setActiveVar(v.name); setVars(s => ({ ...s, [v.name]: !s[v.name] })); }}>
                        {v.label}
                      </span>
                    );
                  }
                  return (
                    <span key={i} className={`enki-var${activeVar === v.name ? ' active' : ''}`} onClick={() => setActiveVar(v.name)}>
                      {String(vars[v.name])}
                    </span>
                  );
                })}
              </div>
              <div className="enki-prompt-comments">
                {p.variables.map(v => (
                  <div key={v.name} className={`enki-comment${activeVar === v.name ? ' active' : ''}`} onClick={() => setActiveVar(v.name)}>
                    <div className="enki-comment-name">
                      <span>[{v.name}]</span>
                      <span className="enki-comment-type">{v.type}</span>
                    </div>
                    {v.type === 'checkbox' ? (
                      <label className="enki-comment-checkbox" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={!!vars[v.name]} onChange={e => setVars(s => ({ ...s, [v.name]: e.target.checked }))} />
                        {v.label}
                      </label>
                    ) : (
                      <input className="enki-comment-input" value={String(vars[v.name])} onChange={e => setVars(s => ({ ...s, [v.name]: e.target.value }))} onClick={e => e.stopPropagation()} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="enki-size-picker">
            <div className="enki-size-row">
              <span className="enki-size-label mono">Aspect</span>
              <div className="enki-size-chips">
                {RATIOS.map(r => (
                  <button key={r} className={`enki-size-chip mono${ratio === r ? ' active' : ''}`} onClick={() => setRatio(r)}>{r}</button>
                ))}
              </div>
            </div>
            <div className="enki-size-row">
              <span className="enki-size-label mono">Resolution</span>
              <div className="enki-size-chips">
                {RESOLUTIONS.map(r => (
                  <button key={r} className={`enki-size-chip mono${resolution === r ? ' active' : ''}`} onClick={() => setResolution(r)}>{r}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="enki-rule" />

          <div className="enki-actions">
            <button className="enki-btn">
              Generate · ${p.price.toFixed(2)}
              <span className="mono" style={{ fontSize: 10, opacity: 0.7, marginLeft: 4 }}>{generator} · {activeNetwork}</span>
            </button>
            <button className="enki-btn enki-btn-secondary"><Bookmark size={14} /> Save</button>
            <button className="enki-btn enki-btn-secondary"><Copy size={12} /> Share</button>
          </div>

          <div className="enki-rule" />

          <div className="enki-panel-section-label">
            <span>Your generations from this prompt</span>
            <span className="mono" style={{ textTransform: 'none', letterSpacing: 0 }}>{userGenerations.length} runs · last 30 days</span>
          </div>
          <div className="enki-user-gens">
            {userGenerations.map((g, i) => (
              <div key={i} className={`enki-user-gen${heroIdx === 5 + i ? ' active' : ''}`} onClick={() => setHeroIdx(5 + i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.art.url} alt="" />
                <div className="enki-user-gen-meta mono">
                  <span>{g.label}</span><span>·</span><span>${p.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

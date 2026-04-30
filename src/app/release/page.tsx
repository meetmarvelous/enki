"use client";
import { useState, useMemo, useRef } from "react";
import Header from "@/components/Header";
import { NETWORKS, makeArtwork, parseTokens } from "@/lib/data";
import { Zap, Copy } from "lucide-react";

const REL_MODELS = [
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', cost: 0.04 },
  { id: 'gpt-image-2', name: 'GPT-Image-2', cost: 0.06 },
  { id: 'midjourney-v7', name: 'Midjourney v7', cost: 0.08 },
];
const REL_RATIOS = ['1:1', '4:5', '3:2', '16:9', '9:16', '21:9'];
const REL_DISPLAY_MODES = [
  { id: 'free', label: 'Free prompt', sub: 'Open the full prompt · anyone can copy & remix it' },
  { id: 'premium', label: 'Premium prompt', sub: 'Body locked · buyer fills variables and pays per render' },
];

export default function ReleasePage() {
  const [title, setTitle] = useState('Quiet Window, Late Afternoon');
  const [promptBody, setPromptBody] = useState('A photograph of [subject], [mood], lit by [lighting]. [grain] Editorial. Restrained.');
  const [activeVar, setActiveVar] = useState('subject');
  const [varValues, setVarValues] = useState<Record<string, string>>({ subject: 'a young woman, dark hair', mood: 'contemplative, soft', lighting: '', grain: '' });
  const [varLabels, setVarLabels] = useState<Record<string, string>>({ subject: 'Subject', mood: 'Mood', lighting: 'Lighting', grain: 'Add film grain' });
  const [varTypes, setVarTypes] = useState<Record<string, string>>({ subject: 'text', mood: 'text', lighting: 'text', grain: 'checkbox' });
  const [preferredModels, setPreferredModels] = useState(['nano-banana-pro']);
  const [preferredRatio, setPreferredRatio] = useState('4:5');
  const [ratioOptional, setRatioOptional] = useState(true);
  const [displayMode, setDisplayMode] = useState('free');
  const [artistPrice, setArtistPrice] = useState(0.10);
  const [refAllow, setRefAllow] = useState(true);
  const [refMax, setRefMax] = useState(2);
  const [wallet, setWallet] = useState<string | null>(null);
  const [versions, setVersions] = useState([true, true, true, false]);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const tokens = useMemo(() => parseTokens(promptBody), [promptBody]);
  const isFree = displayMode === 'free';
  const verifyCount = versions.filter(Boolean).length;
  const canPublish = verifyCount >= (isFree ? 1 : 4);

  const apiCost = useMemo(() => {
    const sel = REL_MODELS.filter(m => preferredModels.includes(m.id));
    return sel.length ? Math.max(...sel.map(m => m.cost)) : 0;
  }, [preferredModels]);
  const subtotal = apiCost + artistPrice;
  const fee = subtotal * 0.07;
  const consumerPrice = subtotal + fee;

  const toggleModel = (id: string) => setPreferredModels(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <>
      <Header active="release" />
      <div className="enki-release-bar">
        <div className="enki-release-titlebox">
          <label className="mono enki-release-titlebox-label">Prompt title</label>
          <input className="enki-release-titlebox-input serif" value={title} onChange={e => setTitle(e.target.value)} placeholder="Untitled prompt" spellCheck={false} />
        </div>
        <div className="enki-release-actions">
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 14px 0 0', borderRight: '1px solid var(--rule)', fontSize: 11, color: 'var(--ink-2)', gap: 2 }}>
            <span><span style={{ width: 6, height: 6, borderRadius: '50%', background: canPublish ? 'var(--ember)' : 'var(--ink-3)', display: 'inline-block', marginRight: 6 }} /><span className="mono">{verifyCount}/{isFree ? '1+' : '4'} verified</span></span>
          </div>
          <button className="enki-btn enki-btn-secondary" style={{ fontSize: 12, padding: '9px 16px' }} onClick={() => setVersions([true, true, true, true])}>
            <Zap size={14} /> Generate empty slots
          </button>
          <button className={`enki-btn${wallet ? ' connected' : ''}`} style={{ fontSize: 11, padding: '9px 14px', fontFamily: 'var(--mono)', background: wallet ? 'var(--ember-soft)' : 'var(--paper)', color: wallet ? 'var(--ember)' : 'var(--ink-2)', borderColor: wallet ? 'var(--ember)' : 'var(--rule)' }} onClick={() => setWallet(w => w ? null : '0x4Cf8…9aB2')}>
            {wallet ? <><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ember)', display: 'inline-block' }} /> {wallet}</> : 'Connect wallet'}
          </button>
          <button className="enki-btn" style={{ padding: '9px 18px', fontSize: 12 }} disabled={!canPublish || !wallet}>Publish prompt</button>
        </div>
      </div>

      <div className="enki-release-workspace">
        {/* Col 1: Settings */}
        <aside className="enki-release-pane enki-release-pane-settings">
          <div className="enki-release-pane-head">
            <span className="mono enki-release-pane-num">01</span>
            <span className="enki-release-pane-title">Settings</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Display mode</div>
            {REL_DISPLAY_MODES.map(m => (
              <button key={m.id} onClick={() => setDisplayMode(m.id)} style={{ textAlign: 'left', padding: '10px 12px', border: `1px solid ${displayMode === m.id ? 'var(--ink)' : 'var(--rule)'}`, background: 'var(--paper)', cursor: 'pointer', boxShadow: displayMode === m.id ? 'inset 0 0 0 1px var(--ink)' : 'none' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--ink)', marginBottom: 2 }}>{m.label}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', lineHeight: 1.4 }}>{m.sub}</div>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>Preferred models <span style={{ textTransform: 'none', letterSpacing: '0.02em' }}>multi-select</span></div>
            {REL_MODELS.map(m => (
              <button key={m.id} onClick={() => toggleModel(m.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', border: `1px solid ${preferredModels.includes(m.id) ? 'var(--ember)' : 'var(--rule)'}`, background: preferredModels.includes(m.id) ? 'var(--ember-soft)' : 'var(--paper)', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>{m.name}</span>
                <span className="mono" style={{ fontSize: 11, color: preferredModels.includes(m.id) ? 'var(--ember)' : 'var(--ink-3)' }}>${m.cost.toFixed(2)}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Preferred ratio</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <button className={`enki-size-chip mono${ratioOptional ? ' active' : ''}`} onClick={() => setRatioOptional(true)} style={{ fontStyle: 'italic' }}>Any ratio</button>
              {REL_RATIOS.map(r => (
                <button key={r} className={`enki-size-chip mono${!ratioOptional && preferredRatio === r ? ' active' : ''}`} onClick={() => { setRatioOptional(false); setPreferredRatio(r); }}>{r}</button>
              ))}
            </div>
          </div>
          {!isFree && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Pricing</div>
              <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Artist fee per use</label>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, borderBottom: '1px solid var(--ink)', padding: '2px 0' }}>
                    <span className="mono" style={{ fontSize: 13, color: 'var(--ink-3)' }}>$</span>
                    <input type="number" step="0.01" min="0" value={artistPrice.toFixed(2)} onChange={e => setArtistPrice(parseFloat(e.target.value) || 0)} style={{ border: 'none', background: 'transparent', fontFamily: 'var(--serif)', fontSize: 18, width: 64, textAlign: 'right', color: 'var(--ink)', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)' }}><span>API cost</span><span className="mono">${apiCost.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)' }}><span>Your fee</span><span className="mono">${artistPrice.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)' }}><span>Platform fee <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>7%</span></span><span className="mono">${fee.toFixed(3)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: '1px solid var(--rule)', paddingTop: 8, marginTop: 4, color: 'var(--ink)' }}><span>Buyer pays</span><span className="serif" style={{ fontSize: 22, fontWeight: 300 }}>${consumerPrice.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Col 2: Prompt */}
        <section className="enki-release-pane">
          <div className="enki-release-pane-head">
            <span className="mono enki-release-pane-num">02</span>
            <span className="enki-release-pane-title">Prompt</span>
            <button className="enki-btn enki-btn-secondary" style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: 11 }}>+ Variable</button>
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <div className="serif" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', color: 'transparent', border: '1px solid transparent', background: 'var(--paper)', overflow: 'hidden', zIndex: 1, padding: '16px 18px', fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {promptBody.replace(/\[(\w+)\]/g, (match, name) => match).split(/(\[\w+\])/).map((part, i) => {
                const m = part.match(/^\[(\w+)\]$/);
                if (m) return <span key={i} style={{ background: activeVar === m[1] ? 'var(--ember)' : 'var(--ember-soft)', color: activeVar === m[1] ? 'var(--paper)' : 'var(--ember)' }}>{part}</span>;
                return <span key={i}>{part}</span>;
              })}
              {'\n'}
            </div>
            <textarea ref={promptRef} className="serif" value={promptBody} onChange={e => setPromptBody(e.target.value)} spellCheck={false} rows={6} style={{ position: 'relative', width: '100%', border: '1px solid var(--rule)', background: 'transparent', padding: '16px 18px', fontSize: 18, lineHeight: 1.5, resize: 'none', fontFamily: 'var(--serif)', caretColor: 'var(--ink)', zIndex: 2, color: 'var(--ink)', outline: 'none', minHeight: 160, boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tokens.length === 0 ? (
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', fontStyle: 'italic' }}>No variables yet · type [name] to add one</span>
            ) : tokens.map(t => (
              <span key={t} onClick={() => setActiveVar(t)} style={{ fontSize: 9, padding: '2px 6px', border: 'none', background: activeVar === t ? 'var(--paper)' : 'var(--paper-2)', color: activeVar === t ? 'var(--ink)' : 'var(--ink-3)', letterSpacing: '0.04em', cursor: 'pointer', borderBottom: activeVar === t ? '1px solid var(--ink)' : 'none' }}>[{t}]</span>
            ))}
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', display: 'flex', gap: 8 }}>
            <span>{promptBody.length} chars</span><span>·</span><span>{tokens.length} variables</span><span>·</span><span>autosaves every keystroke</span>
          </div>
        </section>

        {/* Col 3: Variables */}
        <section className="enki-release-pane">
          <div className="enki-release-pane-head">
            <span className="mono enki-release-pane-num">03</span>
            <span className="enki-release-pane-title">Variables</span>
            <span className="mono enki-release-pane-meta">defaults &amp; types</span>
          </div>
          {tokens.length === 0 ? (
            <div style={{ marginTop: 8, textAlign: 'center', padding: 24 }}>
              <div className="serif">No variables yet</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>Add [tokens] in your prompt — each appears here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tokens.map(t => (
                <div key={t} onClick={() => setActiveVar(t)} style={{ border: `1px solid ${activeVar === t ? 'var(--ink)' : 'var(--rule)'}`, background: 'var(--paper)', padding: '10px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: activeVar === t ? 'inset 0 0 0 1px var(--ink)' : 'none' }}>
                  <div>
                    <span className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Variable name</span>
                    <input className="serif" value={varLabels[t] || t} onChange={e => setVarLabels(s => ({ ...s, [t]: e.target.value }))} style={{ width: '100%', fontFamily: 'var(--serif)', fontSize: 16, border: 'none', outline: 'none', background: 'transparent', color: 'var(--ink)', padding: '2px 0', borderBottom: '1px solid var(--rule-2)' }} />
                  </div>
                  <div style={{ display: 'inline-flex', border: '1px solid var(--rule)', background: 'var(--paper-2)', padding: 2, alignSelf: 'flex-start' }}>
                    <button className="mono" onClick={e => { e.stopPropagation(); setVarTypes(s => ({ ...s, [t]: 'text' })); }} style={{ background: varTypes[t] === 'text' ? 'var(--ink)' : 'transparent', color: varTypes[t] === 'text' ? 'var(--paper)' : 'var(--ink-3)', border: 'none', padding: '4px 12px', fontSize: 10, cursor: 'pointer' }}>Text input</button>
                    <button className="mono" onClick={e => { e.stopPropagation(); setVarTypes(s => ({ ...s, [t]: 'checkbox' })); }} style={{ background: varTypes[t] === 'checkbox' ? 'var(--ink)' : 'transparent', color: varTypes[t] === 'checkbox' ? 'var(--paper)' : 'var(--ink-3)', border: 'none', padding: '4px 12px', fontSize: 10, cursor: 'pointer' }}>Yes / No checkbox</button>
                  </div>
                  <div>
                    <span className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Default value</span>
                    <input value={varValues[t] || ''} onChange={e => setVarValues(s => ({ ...s, [t]: e.target.value }))} placeholder="e.g. a young woman, dark hair…" style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--rule-2)', background: 'transparent', fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--ink-2)', padding: '4px 0', outline: 'none' }} onClick={e => e.stopPropagation()} />
                    <span className="mono" style={{ fontSize: 9, color: 'var(--ink-3)', fontStyle: 'italic' }}>Used until the buyer changes it.</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Col 4: Verify */}
        <section className="enki-release-pane enki-release-pane-verify">
          <div className="enki-release-pane-head">
            <span className="mono enki-release-pane-num">04</span>
            <span className="enki-release-pane-title">Verify</span>
            <span className="mono enki-release-pane-meta">{verifyCount} of {isFree ? '1 required, 4 recommended' : '4 required'}</span>
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: -4 }}>{isFree ? 'Free prompts need at least one reference render.' : 'Premium prompts require four reference renders.'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0, 1, 2, 3].map(i => {
              const a = makeArtwork(i * 4 + 7);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '144px 1fr', gap: 14, border: '1px solid var(--rule)', background: versions[i] ? 'var(--paper)' : 'transparent', padding: 10 }}>
                  <div style={{ width: 144, aspectRatio: '4/5', background: 'var(--paper-2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {versions[i] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                      <button className="enki-btn" style={{ fontSize: 11, padding: '7px 14px' }} onClick={() => setVersions(v => v.map((x, j) => j === i ? true : x))}>
                        <Zap size={14} /> Generate
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--ink-2)', letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
                      Version 0{i + 1}
                      {versions[i] && <span style={{ color: 'var(--ember)', fontSize: 9 }}>● ready</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>x402 link preview</div>
            <div className="enki-x402-link">
              <span><strong>x402://</strong>enkiart.xyz/p/quiet-window</span>
              <span style={{ cursor: 'pointer' }}><Copy size={12} /></span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

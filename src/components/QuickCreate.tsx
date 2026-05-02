"use client";
import { useMemo, useState } from "react";
import { Bookmark, ChevronDown, Plus, X, Zap } from "lucide-react";
import { QC_MODELS, QC_RATIOS, QC_RESOLUTIONS, makeArtwork, parseTokens } from "@/lib/data";
import type { ArtworkData } from "@/lib/data";

export interface QuickCreateGalleryItem {
  art: ArtworkData;
  label: string;
}

interface QuickCreateResultSet {
  prompt: string;
  model: string;
  ratio: string;
  res: string;
  imgs: QuickCreateGalleryItem[];
  cost: string;
}

interface QuickCreateProps {
  defaultPrompt?: string;
  startOpen?: boolean;
  onAddToGallery?: (item: QuickCreateGalleryItem) => void;
}

function QuickCreateResults({ results, onClose, onAddToGallery }: {
  results: QuickCreateResultSet;
  onClose: () => void;
  onAddToGallery?: (img: QuickCreateGalleryItem) => void;
}) {
  return (
    <div className="enki-qc-results">
      <div className="enki-qc-results-head">
        <div>
          <div className="mono enki-qc-results-eyebrow">Generated / ${results.cost} / {results.model}</div>
          <div className="serif enki-qc-results-title">{results.imgs.length} new {results.imgs.length === 1 ? "image" : "images"}</div>
        </div>
        <button className="enki-icon-btn" onClick={onClose} title="Close"><X size={14} /></button>
      </div>
      <div className="enki-qc-results-grid">
        {results.imgs.map((g, i) => (
          <div key={i} className="enki-qc-result">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.art.url} alt="" />
            <div className="enki-qc-result-actions">
              <button className="enki-btn enki-btn-secondary" style={{ flex: 1 }} onClick={() => onAddToGallery?.(g)}>
                <Plus size={14} /> Add to gallery
              </button>
              <button className="enki-icon-btn" title="Save as prompt"><Bookmark size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="enki-qc-results-prompt mono">
        <span className="enki-qc-results-prompt-label">prompt</span>
        <span>{results.prompt}</span>
      </div>
    </div>
  );
}

export default function QuickCreate({ defaultPrompt = "", startOpen = false, onAddToGallery }: QuickCreateProps) {
  const [open, setOpen] = useState(startOpen);
  const [mode, setMode] = useState<"generate" | "release">("generate");
  const [prompt, setPrompt] = useState(defaultPrompt || "A photograph of [subject] at [location], [mood], lit by [lighting].");
  const [vars, setVars] = useState<Record<string, string>>({
    subject: "a young woman with dark hair",
    location: "a small wooden room",
    mood: "contemplative",
    lighting: "late afternoon window",
  });
  const [model, setModel] = useState("nano-banana-pro");
  const [ratio, setRatio] = useState("3:4");
  const [res, setRes] = useState("2K");
  const [count, setCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<QuickCreateResultSet | null>(null);
  const [resultsOpen, setResultsOpen] = useState(false);

  const tokens = useMemo(() => parseTokens(prompt), [prompt]);
  const tokenNames = useMemo(() => Array.from(new Set(tokens)), [tokens]);
  const isRelease = mode === "release";
  const m = QC_MODELS.find(x => x.id === model) || QC_MODELS[0];
  const total = (m.cost * count).toFixed(2);
  const allFilled = tokenNames.every(t => (vars[t] || "").trim().length > 0);

  const filledPrompt = useMemo(() => {
    return prompt.replace(/\[(\w+)\]/g, (_, n) => vars[n] || `[${n}]`);
  }, [prompt, vars]);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const seed = Math.floor(Math.random() * 9999);
      const imgs = Array.from({ length: count }).map((_, i) => ({
        art: makeArtwork(seed + i * 13),
        label: `run ${i + 1}`,
      }));
      setResults({ prompt: filledPrompt, model: m.name, ratio, res, imgs, cost: total });
      setResultsOpen(true);
      setGenerating(false);
    }, 800);
  };

  return (
    <>
      <div className={`enki-qc${open ? " open" : ""}`}>
        <button className="enki-qc-bar" onClick={() => setOpen(o => !o)}>
          <span className="enki-qc-bar-bolt"><Zap size={12} /></span>
          <span className="enki-qc-bar-label serif">Quick create</span>
          <span className="mono enki-qc-bar-hint">{open ? "Click to collapse" : "Paste a prompt - wrap variables in [brackets]"}</span>
          <span className={`enki-qc-bar-chev${open ? " up" : ""}`}><ChevronDown size={14} /></span>
        </button>

        {open && (
          <div className="enki-qc-panel">
            <div className="enki-qc-sheet-handle" />
            <div className="enki-qc-sheet-head">
              <div className="enki-qc-segmented">
                <button className={mode === "generate" ? "active" : ""} onClick={() => setMode("generate")}>Generate</button>
                <button className={mode === "release" ? "active" : ""} onClick={() => setMode("release")}>Release</button>
              </div>
              <button className="enki-qc-sheet-close" onClick={() => setOpen(false)} aria-label="Close"><X size={14} /></button>
            </div>

            <div className="enki-qc-scroll">
              <div className="enki-qc-grid">
                <div className="enki-qc-col">
                  <div className="enki-qc-section-label mono">
                    {isRelease ? "Prompt template" : "Prompt"}
                    {isRelease && <button className="enki-qc-var-add">+ Variable</button>}
                  </div>
                  <textarea
                    className="enki-qc-textarea"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="A photograph of [subject], [mood], lit by [lighting]..."
                    rows={3}
                  />
                  <div className="enki-qc-token-row">
                    {tokenNames.length === 0 ? (
                      <span className="enki-qc-hint mono">Wrap a word in [brackets] to make it editable</span>
                    ) : tokenNames.map(t => (
                      <span key={t} className={`enki-qc-token mono${(vars[t] || "").trim() ? " filled" : ""}`}>[{t}]</span>
                    ))}
                  </div>

                  <div className="enki-qc-settings">
                    <div className="enki-qc-setting">
                      <label className="mono enki-qc-setting-label">Model</label>
                      <select className="enki-qc-select" value={model} onChange={e => setModel(e.target.value)}>
                        {QC_MODELS.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                      </select>
                    </div>
                    <div className="enki-qc-setting">
                      <label className="mono enki-qc-setting-label">Aspect</label>
                      <select className="enki-qc-select" value={ratio} onChange={e => setRatio(e.target.value)}>
                        {QC_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="enki-qc-setting">
                      <label className="mono enki-qc-setting-label">Resolution</label>
                      <select className="enki-qc-select" value={res} onChange={e => setRes(e.target.value)}>
                        {QC_RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="enki-qc-setting">
                      <label className="mono enki-qc-setting-label">{isRelease ? "Price per run" : "Generations"}</label>
                      <select className="enki-qc-select" value={count} onChange={e => setCount(parseInt(e.target.value))}>
                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{isRelease ? "$0.10" : `x ${n}`}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="enki-qc-col">
                  <div className="enki-qc-section-label mono">
                    Variables
                    <span className="enki-qc-section-meta">{tokenNames.length} detected</span>
                  </div>
                  {tokenNames.length === 0 ? (
                    <div className="enki-qc-vars-empty">
                      <div className="serif">Wrap a word in [brackets] in your prompt.</div>
                      <div className="mono enki-qc-vars-empty-hint">e.g. <em>portrait of [subject], [mood] mood</em></div>
                    </div>
                  ) : (
                    <div className="enki-qc-vars">
                      {tokenNames.map(t => (
                        <div key={t} className={`enki-qc-var${(vars[t] || "").trim() ? " filled" : ""}`}>
                          <label className="mono enki-qc-var-label">{t}</label>
                          <input
                            className="enki-qc-var-input"
                            value={vars[t] || ""}
                            onChange={e => setVars(s => ({ ...s, [t]: e.target.value }))}
                            placeholder={isRelease ? "Comma-separated options: option a, option b..." : `value for [${t}]...`}
                          />
                          {isRelease && (
                            <div className="enki-qc-var-types">
                              {["Text", "Image", "NFT", "Select"].map(type => <button key={type}>{type}</button>)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="enki-qc-cost">
                    <div className="enki-qc-cost-line">
                      <span className="mono">{isRelease ? "Earn on" : `${count} x ${m.name}`}</span>
                      <span className="mono enki-qc-cost-faint">Solana / 4a...ef21</span>
                    </div>
                    <button
                      className="enki-btn enki-btn-primary enki-qc-generate"
                      disabled={generating || !prompt.trim() || (!isRelease && !allFilled)}
                      onClick={generate}
                    >
                      {generating ? "Generating..." : isRelease ? <>Release prompt / {tokenNames.length} var{tokenNames.length === 1 ? "" : "s"}</> : <>Generate / ${total}</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {results && resultsOpen && (
        <QuickCreateResults
          results={results}
          onClose={() => setResultsOpen(false)}
          onAddToGallery={(img) => {
            if (onAddToGallery) onAddToGallery(img);
          }}
        />
      )}
    </>
  );
}

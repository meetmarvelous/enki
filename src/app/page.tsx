"use client";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import Card from "@/components/Card";
import DetailPanel from "@/components/DetailPanel";
import { PROMPTS } from "@/lib/data";
import type { Prompt } from "@/lib/data";

export default function HomePage() {
  const [tags, setTags] = useState<string[]>([]);
  const [favs, setFavs] = useState<Record<string, boolean>>({ p_2: true, p_5: true });
  const [open, setOpen] = useState<Prompt | null>(null);
  const [activeNet, setActiveNet] = useState("Base");

  const filtered = useMemo(() => {
    let list = PROMPTS;
    if (tags.length) list = list.filter(p => tags.every(t => p.tags.includes(t)));
    return list;
  }, [tags]);

  const toggleTag = (t: string) => {
    setTags(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  };

  const toggleFav = (id: string) => {
    setFavs(s => ({ ...s, [id]: !s[id] }));
  };

  return (
    <>
      <Header active="home" />
      <div className="enki-page-title" style={{ paddingBottom: 18 }}>
        <div className="enki-page-eyebrow">
          Curated this week · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </div>
        <h1 className="enki-page-h1 serif">
          <em>Discover</em> prompts<br />worth keeping.
        </h1>
      </div>
      <Filters active={tags} toggle={toggleTag} />
      <div className="enki-masonry" style={{ columnCount: 4 }}>
        {filtered.map(p => (
          <Card
            key={p.id}
            p={p}
            onOpen={setOpen}
            faved={!!favs[p.id]}
            toggleFav={toggleFav}
          />
        ))}
      </div>
      {open && (
        <DetailPanel
          p={open}
          onClose={() => setOpen(null)}
          faved={!!favs[open.id]}
          toggleFav={toggleFav}
          activeNetwork={activeNet}
        />
      )}
    </>
  );
}

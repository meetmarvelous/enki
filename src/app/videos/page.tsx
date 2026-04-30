"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import Card from "@/components/Card";
import DetailPanel from "@/components/DetailPanel";
import { PROMPTS } from "@/lib/data";
import type { Prompt } from "@/lib/data";

export default function VideosPage() {
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<Prompt | null>(null);
  const list = PROMPTS.filter(p => p.isVideo);

  const toggleFav = (id: string) => {
    setFavs(s => ({ ...s, [id]: !s[id] }));
  };

  return (
    <>
      <Header active="videos" />
      <div className="enki-page-title">
        <div className="enki-page-eyebrow">Video · {list.length} prompts</div>
        <h1 className="enki-page-h1 serif"><em>Motion</em>, time &amp;<br/>the moving frame.</h1>
        <div className="enki-page-lede">Cinematic clips, looping b-roll, slow-motion vignettes — each prompt comes with four director-approved reference renders.</div>
      </div>
      <Filters active={[]} toggle={() => {}} />
      <div className="enki-masonry" style={{ columnCount: 4 }}>
        {list.map(p => (
          <Card key={p.id} p={p} onOpen={setOpen} faved={!!favs[p.id]} toggleFav={toggleFav} />
        ))}
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


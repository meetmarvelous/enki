"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import Card from "@/components/Card";
import { PROMPTS } from "@/lib/data";

export default function VideosPage() {
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const list = PROMPTS.filter(p => p.isVideo);
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
          <Card key={p.id} p={p} faved={!!favs[p.id]} toggleFav={(id) => setFavs(s => ({ ...s, [id]: !s[id] }))} />
        ))}
      </div>
    </>
  );
}

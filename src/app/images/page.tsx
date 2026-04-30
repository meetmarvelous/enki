"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import Card from "@/components/Card";
import { PROMPTS } from "@/lib/data";

export default function ImagesPage() {
  const [favs, setFavs] = useState<Record<string, boolean>>({});
  const list = PROMPTS.filter(p => !p.isVideo);
  return (
    <>
      <Header active="images" />
      <div className="enki-page-title">
        <div className="enki-page-eyebrow">Images · {list.length} prompts</div>
        <h1 className="enki-page-h1 serif"><em>Stills</em>, frames &amp;<br/>fixed compositions.</h1>
        <div className="enki-page-lede">Hand-tuned image prompts from artists who release four reference renders before they ship.</div>
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

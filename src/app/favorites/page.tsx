"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import DetailPanel from "@/components/DetailPanel";
import { PROMPTS } from "@/lib/data";
import type { Prompt } from "@/lib/data";

export default function FavoritesPage() {
  const [open, setOpen] = useState<Prompt | null>(null);
  const allFavs = PROMPTS.slice(0, 9);
  
  return (
    <>
      <Header active="favorites" />
      <div className="enki-page-title">
        <div className="enki-page-eyebrow">Your favorites · {allFavs.length} prompts</div>
        <h1 className="enki-page-h1 serif"><em>Saved.</em><br/>Always within reach.</h1>
        <div className="enki-page-lede">The prompts you keep coming back to. Tap the bookmark on any card to add or remove it.</div>
      </div>
      <div className="enki-masonry" style={{ columnCount: 4 }}>
        {allFavs.map(p => <Card key={p.id} p={p} onOpen={setOpen} faved toggleFav={() => {}} />)}
      </div>
      {open && (
        <DetailPanel
          p={open}
          onClose={() => setOpen(null)}
          faved={true}
          toggleFav={() => {}}
        />
      )}
    </>
  );
}


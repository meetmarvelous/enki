"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import Card from "@/components/Card";
import DetailPanel from "@/components/DetailPanel";
import QuickCreate from "@/components/QuickCreate";
import type { QuickCreateGalleryItem } from "@/components/QuickCreate";
import { PROMPTS } from "@/lib/data";
import type { Prompt } from "@/lib/data";

export default function HomePage() {
  const [tags, setTags] = useState<string[]>([]);
  const [favs, setFavs] = useState<Record<string, boolean>>({ p_2: true, p_5: true });
  const [open, setOpen] = useState<Prompt | null>(null);
  const [activeNet] = useState("Base");
  const [myGen, setMyGen] = useState<Prompt[]>([]);

  const filtered = useMemo(() => {
    let list = PROMPTS;
    if (tags.length) list = list.filter(p => tags.every(t => p.tags.includes(t)));
    return list;
  }, [tags]);
  const feed = useMemo(() => [...myGen, ...filtered], [myGen, filtered]);

  const toggleTag = (t: string) => {
    setTags(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  };

  const toggleFav = (id: string) => {
    setFavs(s => ({ ...s, [id]: !s[id] }));
  };

  const addToGallery = (g: QuickCreateGalleryItem) => {
    setMyGen(s => [{
      id: 'mygen_' + Date.now() + Math.random(),
      title: 'Your generation',
      art: g.art, isVideo: false,
      artist: { name: 'You', handle: 'sam.mehta', avatar: 'SM', bio: 'QuickCreate studio output.' },
      tags: ['mine'], price: 0, downloads: 1,
      variables: [], promptTemplate: '', versions: [g.art, g.art, g.art, g.art],
      model: 'Nano Banana Pro', publishedAt: 'just now',
      rating: 5,
      visibility: 'full',
      description: 'A quick generation created from the Discover dock.',
    }, ...s]);
  };

  return (
    <div className="enki" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header active="home" />
      <div className="enki-page-title" style={{ paddingBottom: 18 }}>
        <div className="enki-page-eyebrow">
          Curated · this week
        </div>
        <h1 className="enki-page-h1 serif">
          <em>Discover</em> prompts<br />worth keeping.
        </h1>
      </div>
      <div className="enki-mobile-tabs">
        <Link href="/" className="active">All <span>{PROMPTS.length}</span></Link>
        <Link href="/images">Images <span>{PROMPTS.filter(p => !p.isVideo).length}</span></Link>
        <Link href="/videos">Videos <span>{PROMPTS.filter(p => p.isVideo).length}</span></Link>
      </div>
      <Filters active={tags} toggle={toggleTag} />
      <div className="enki-masonry enki-desktop-feed" style={{ columnCount: 4 }}>
        {myGen.map(p => (
          <Card key={p.id} p={p} onOpen={setOpen} faved={!!favs[p.id]} toggleFav={toggleFav} />
        ))}
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
      <div className="enki-mobile-feed">
        <div>
          {feed.filter((_, i) => i % 2 === 0).map(p => (
            <Card key={p.id} p={p} onOpen={setOpen} faved={!!favs[p.id]} toggleFav={toggleFav} />
          ))}
        </div>
        <div className="enki-mobile-feed-offset">
          {feed.filter((_, i) => i % 2 === 1).map(p => (
            <Card key={p.id} p={p} onOpen={setOpen} faved={!!favs[p.id]} toggleFav={toggleFav} />
          ))}
        </div>
      </div>
      <QuickCreate onAddToGallery={addToGallery} />
      {open && (
        <DetailPanel
          p={open}
          onClose={() => setOpen(null)}
          faved={!!favs[open.id]}
          toggleFav={toggleFav}
          activeNetwork={activeNet}
        />
      )}
    </div>
  );
}

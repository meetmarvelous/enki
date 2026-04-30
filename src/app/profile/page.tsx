"use client";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import DetailPanel from "@/components/DetailPanel";
import { ARTISTS, PROMPTS, NETWORKS } from "@/lib/data";
import type { Prompt } from "@/lib/data";
import { ChevronDown } from "lucide-react";

const PROFILE_NETWORKS = ['Base', 'Optimism', 'Ethereum', 'Solana'];
const PROFILE_NFTS_BY_NET: Record<string, { id: string; collection: string; tokenId: string; symbol: string }[]> = {
  'Base': [
    { id: 'base-onchain-1', collection: 'Onchain Summer', tokenId: '#0421', symbol: '◐' },
    { id: 'base-degens-2', collection: 'Based Degens', tokenId: '#1144', symbol: '◇' },
    { id: 'base-toshi-3', collection: 'Toshi Originals', tokenId: '#078', symbol: '◼' },
  ],
  'Optimism': [
    { id: 'op-quests-1', collection: 'OP Quests', tokenId: '#3201', symbol: '▲' },
    { id: 'op-citizens-2', collection: 'Citizens House', tokenId: '#091', symbol: '✦' },
  ],
  'Ethereum': [
    { id: 'eth-azuki-1', collection: 'Azuki', tokenId: '#2841', symbol: '◐' },
    { id: 'eth-pudgy-2', collection: 'Pudgy Penguins', tokenId: '#991', symbol: '◇' },
    { id: 'eth-nouns-3', collection: 'Nouns', tokenId: '#78', symbol: '◼' },
    { id: 'eth-milady-4', collection: 'Milady', tokenId: '#507', symbol: '✦' },
  ],
  'Solana': [
    { id: 'sol-mad-1', collection: 'Mad Lads', tokenId: '#4421', symbol: '✦' },
    { id: 'sol-degods-2', collection: 'DeGods', tokenId: '#0192', symbol: '◆' },
  ],
};

export default function ProfilePage() {
  const a = ARTISTS[0];
  const allList = PROMPTS.filter((_, i) => i % 3 === 0).slice(0, 10);
  const [activeTab, setActiveTab] = useState('Released');
  const [nftFilterOpen, setNftFilterOpen] = useState(false);
  const [nftNetwork, setNftNetwork] = useState('Base');
  const [selectedNfts, setSelectedNfts] = useState<string[]>([]);
  const [open, setOpen] = useState<Prompt | null>(null);

  const currentNfts = PROFILE_NFTS_BY_NET[nftNetwork] || [];
  const allWalletNfts = useMemo(() => Object.values(PROFILE_NFTS_BY_NET).flat(), []);

  const promptNfts = useMemo(() => {
    const map: Record<string, string[]> = {};
    allList.forEach((p, i) => {
      const arr: string[] = [];
      if (i % 2 === 0) arr.push(allWalletNfts[i % allWalletNfts.length].id);
      if (i % 3 === 0) arr.push(allWalletNfts[(i + 2) % allWalletNfts.length].id);
      map[p.id] = [...new Set(arr)];
    });
    return map;
  }, [allWalletNfts, allList]);

  const list = useMemo(() => {
    if (selectedNfts.length === 0) return allList;
    return allList.filter(p => {
      const used = promptNfts[p.id] || [];
      return selectedNfts.some(s => used.includes(s));
    });
  }, [selectedNfts, promptNfts, allList]);

  const toggleNft = (id: string) => {
    setSelectedNfts(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  return (
    <>
      <Header active="" />
      <div className="enki-profile-banner">
        <div className="enki-profile-banner-art" />
        <div className="enki-profile-avatar enki-profile-avatar-overlap">{a.avatar}</div>
      </div>
      <div className="enki-profile-hero">
        <div>
          <div className="enki-profile-handle mono">@{a.handle}</div>
          <h1 className="enki-profile-name serif"><em>{a.name.split(' ')[0]}</em> {a.name.split(' ').slice(1).join(' ')}</h1>
          <div className="enki-profile-bio">{a.bio}</div>
          <div className="enki-profile-stats">
            <div className="enki-profile-stat"><div className="num serif">14</div><div className="label">Prompts</div></div>
            <div className="enki-profile-stat"><div className="num serif">2.4k</div><div className="label">Uses</div></div>
            <div className="enki-profile-stat"><div className="num serif">312</div><div className="label">Followers</div></div>
            <div className="enki-profile-stat"><div className="num serif">$184</div><div className="label">This month</div></div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignSelf: 'end' }}>
              <button className="enki-btn enki-btn-secondary">Follow</button>
              <button className="enki-btn">Message</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 40px 0', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
          {['Released', 'Drafts', 'Reviews', 'About'].map(s => (
            <div key={s} onClick={() => setActiveTab(s)} style={{ padding: '14px 0', borderBottom: activeTab === s ? '1px solid var(--ink)' : '1px solid transparent', color: activeTab === s ? 'var(--ink)' : 'var(--ink-3)', cursor: 'pointer' }}>
              {s} {s === 'Released' && <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 4 }}>14</span>}
            </div>
          ))}
        </div>
        {activeTab === 'Released' && (
          <div style={{ position: 'relative', paddingBottom: 8 }}>
            <button className={`enki-profile-nft-btn mono${selectedNfts.length ? ' active' : ''}`} onClick={() => setNftFilterOpen(o => !o)}>
              <span className="enki-profile-nft-icon">◇</span>
              {selectedNfts.length === 0 ? 'Filter by NFT' : `${selectedNfts.length} NFT${selectedNfts.length > 1 ? 's' : ''} selected`}
              <span className={`enki-profile-nft-chev${nftFilterOpen ? ' up' : ''}`}><ChevronDown size={12} /></span>
            </button>
            {nftFilterOpen && (
              <div className="enki-profile-nft-menu">
                <div className="enki-profile-nft-menu-head">
                  <div>
                    <div className="mono enki-profile-nft-menu-eyebrow">Your wallet · 0x4Cf8…9aB2</div>
                    <div className="serif enki-profile-nft-menu-title">Filter by reference NFT</div>
                  </div>
                  {selectedNfts.length > 0 && <button className="enki-profile-nft-menu-clear mono" onClick={() => setSelectedNfts([])}>Clear</button>}
                </div>
                <div className="enki-profile-nft-networks">
                  {PROFILE_NETWORKS.map(net => (
                    <button key={net} className={`enki-profile-nft-network mono${nftNetwork === net ? ' active' : ''}`} onClick={() => setNftNetwork(net)}>
                      {net}<span className="enki-profile-nft-network-count">{(PROFILE_NFTS_BY_NET[net] || []).length}</span>
                    </button>
                  ))}
                </div>
                <div className="enki-profile-nft-menu-hint mono">Show only artworks generated using one of your NFTs as reference.</div>
                <div className="enki-profile-nft-list">
                  {currentNfts.map(n => {
                    const sel = selectedNfts.includes(n.id);
                    return (
                      <button key={n.id} className={`enki-profile-nft-item${sel ? ' selected' : ''}`} onClick={() => toggleNft(n.id)}>
                        <span className="enki-profile-nft-thumb">{n.symbol}</span>
                        <span className="enki-profile-nft-meta">
                          <span className="serif enki-profile-nft-collection">{n.collection}</span>
                          <span className="mono enki-profile-nft-token">{n.tokenId}</span>
                        </span>
                        <span className={`enki-profile-nft-check${sel ? ' on' : ''}`}>{sel ? '✓' : ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedNfts.length > 0 && (
        <div className="enki-profile-nft-active">
          <span className="mono enki-profile-nft-active-label">Filtering by</span>
          {selectedNfts.map(id => {
            const n = allWalletNfts.find(x => x.id === id);
            if (!n) return null;
            return (
              <span key={id} className="enki-profile-nft-active-chip mono">
                <span className="enki-profile-nft-active-sym">{n.symbol}</span>
                {n.collection} {n.tokenId}
                <button onClick={() => toggleNft(id)} aria-label="remove">×</button>
              </span>
            );
          })}
          <span className="mono enki-profile-nft-active-count">{list.length} of {allList.length}</span>
        </div>
      )}

      {list.length === 0 ? (
        <div className="enki-profile-nft-empty">
          <div className="serif">No artworks match these NFTs.</div>
          <div className="mono">Try selecting different references, or clear the filter.</div>
        </div>
      ) : (
        <div className="enki-masonry" style={{ paddingTop: 24, columnCount: 4 }}>
          {list.map(p => (
            <div key={p.id} style={{ position: 'relative' }}>
              <Card p={p} onOpen={setOpen} faved={false} toggleFav={() => {}} />
              {(promptNfts[p.id] || []).length > 0 && (
                <div className="enki-profile-card-nft-badge mono">
                  {(promptNfts[p.id] || []).map(nid => {
                    const n = allWalletNfts.find(x => x.id === nid);
                    return n ? <span key={nid} title={`${n.collection} ${n.tokenId}`}>{n.symbol}</span> : null;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {open && (
        <DetailPanel
          p={open}
          onClose={() => setOpen(null)}
          faved={false}
          toggleFav={() => {}}
        />
      )}
    </>
  );
}


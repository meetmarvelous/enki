"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, Heart, Home, Image as ImageIcon, Plus, Search, User, Video } from "lucide-react";
import { NETWORKS } from "@/lib/data";

interface HeaderProps {
  active?: string;
}

function ProfileDropdown({ networks, activeNet, setActiveNet, onClose }: {
  networks: typeof NETWORKS;
  activeNet: string;
  setActiveNet: (n: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="enki-dropdown" onClick={e => e.stopPropagation()}>
      <div className="enki-dropdown-header">
        <div className="enki-avatar" style={{ width: 40, height: 40, fontSize: 14 }}>SM</div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>Sam Mehta</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>0x4a...ef21 / sam.mehta</div>
        </div>
      </div>
      <div className="enki-dropdown-section">
        <div className="enki-dropdown-label">Pay with</div>
        {networks.map(n => (
          <div key={n.name} className={`enki-network-item${activeNet === n.name ? " active" : ""}`} onClick={() => setActiveNet(n.name)}>
            <div className="enki-network-name">
              <div className="enki-network-dot" style={{ background: n.color }} />
              <div>
                <div style={{ fontSize: 13, color: "var(--ink)" }}>{n.name}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>{n.token} / {n.balance}</div>
              </div>
            </div>
            {activeNet === n.name && <span style={{ color: "var(--ember)" }}><Check size={12} /></span>}
          </div>
        ))}
      </div>
      <div className="enki-dropdown-section">
        <Link href="/profile" className="enki-dropdown-link" onClick={onClose}>My profile</Link>
        <Link href="/favorites" className="enki-dropdown-link" onClick={onClose}>Favorites</Link>
        <Link href="/released" className="enki-dropdown-link" onClick={onClose}>Released prompts</Link>
        <Link href="/earnings" className="enki-dropdown-link" onClick={onClose}>Earnings</Link>
        <Link href="/settings" className="enki-dropdown-link" onClick={onClose}>Settings</Link>
        <Link href="/" className="enki-dropdown-link" onClick={onClose} style={{ color: "var(--ink-3)", marginTop: 4 }}>Sign out</Link>
      </div>
    </div>
  );
}

export default function Header({ active = "home" }: HeaderProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeNet, setActiveNet] = useState("Base");
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <header className="enki-header">
        <div className="enki-mobile-topline mono">Gallery + prompt marketplace</div>
        <Link href="/" className="enki-logo serif">Enki Art</Link>
        <nav className="enki-nav">
          <Link href="/" className={active === "home" ? "active" : ""}>Discover</Link>
          <Link href="/images" className={active === "images" ? "active" : ""}>Images</Link>
          <Link href="/videos" className={active === "videos" ? "active" : ""}>Videos</Link>
          <Link href="/favorites" className={active === "favorites" ? "active" : ""}>Favorites</Link>
        </nav>
        <div className="enki-search">
          <span className="enki-search-icon"><Search size={16} /></span>
          <input
            placeholder="Search prompts, tags, artists..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
          <span className="mono enki-search-kbd">Ctrl K</span>
        </div>
        <div className="enki-header-actions">
          <Link href="/release" className={`enki-release-cta${active === "release" ? " active" : ""}`}>
            <Plus size={14} strokeWidth={1.75} />
            <span>Release prompt</span>
          </Link>
          <button className="enki-icon-btn" title="Notifications"><Bell size={14} /></button>
          <div style={{ position: "relative" }}>
            <div className="enki-avatar" onClick={() => setProfileOpen(!profileOpen)}>SM</div>
            {profileOpen && (
              <ProfileDropdown
                networks={NETWORKS}
                activeNet={activeNet}
                setActiveNet={setActiveNet}
                onClose={() => setProfileOpen(false)}
              />
            )}
          </div>
        </div>
      </header>
      <nav className="enki-mobile-nav" aria-label="Mobile navigation">
        <Link href="/" className={active === "home" ? "active" : ""}><Home size={17} /><span>Home</span></Link>
        <Link href="/images" className={active === "images" ? "active" : ""}><ImageIcon size={17} /><span>Images</span></Link>
        <Link href="/videos" className={active === "videos" ? "active" : ""}><Video size={17} /><span>Video</span></Link>
        <Link href="/favorites" className={active === "favorites" ? "active" : ""}><Heart size={17} /><span>Saved</span></Link>
        <Link href="/profile" className={active === "profile" ? "active" : ""}><User size={17} /><span>Profile</span></Link>
      </nav>
    </>
  );
}

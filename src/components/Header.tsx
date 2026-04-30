"use client";
import { useState } from "react";
import { Search, Plus, Bell, ChevronDown, Check } from "lucide-react";
import { NETWORKS } from "@/lib/data";

interface HeaderProps {
  active?: string;
  onNav?: (page: string) => void;
}

function ProfileDropdown({ networks, activeNet, setActiveNet, onClose }: {
  networks: typeof NETWORKS; activeNet: string;
  setActiveNet: (n: string) => void; onClose: () => void;
}) {
  return (
    <div className="enki-dropdown" onClick={e => e.stopPropagation()}>
      <div className="enki-dropdown-header">
        <div className="enki-avatar" style={{ width: 40, height: 40, fontSize: 14 }}>SM</div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>Sam Mehta</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>0x4a…ef21 · sam.mehta</div>
        </div>
      </div>
      <div className="enki-dropdown-section">
        <div className="enki-dropdown-label">Pay with</div>
        {networks.map(n => (
          <div key={n.name} className={`enki-network-item${activeNet === n.name ? ' active' : ''}`} onClick={() => setActiveNet(n.name)}>
            <div className="enki-network-name">
              <div className="enki-network-dot" style={{ background: n.color }} />
              <div>
                <div style={{ fontSize: 13, color: 'var(--ink)' }}>{n.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{n.token} · {n.balance}</div>
              </div>
            </div>
            {activeNet === n.name && <span style={{ color: 'var(--ember)' }}><Check size={12} /></span>}
          </div>
        ))}
      </div>
      <div className="enki-dropdown-section">
        <div className="enki-dropdown-link">My profile</div>
        <div className="enki-dropdown-link">Favorites</div>
        <div className="enki-dropdown-link">Released prompts</div>
        <div className="enki-dropdown-link">Earnings</div>
        <div className="enki-dropdown-link">Settings</div>
        <div className="enki-dropdown-link" style={{ color: 'var(--ink-3)', marginTop: 4 }}>Sign out</div>
      </div>
    </div>
  );
}

export default function Header({ active = "home", onNav }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeNet, setActiveNet] = useState("Base");

  return (
    <header className="enki-header">
      <div className="enki-logo serif">Enki Art</div>
      <nav className="enki-nav">
        <a className={active === "home" ? "active" : ""} onClick={() => onNav?.("home")}>Discover</a>
        <a className={active === "images" ? "active" : ""} onClick={() => onNav?.("images")}>Images</a>
        <a className={active === "videos" ? "active" : ""} onClick={() => onNav?.("videos")}>Videos</a>
        <a className={active === "favorites" ? "active" : ""} onClick={() => onNav?.("favorites")}>Favorites</a>
      </nav>
      <div className="enki-search">
        <span className="enki-search-icon"><Search size={16} /></span>
        <input placeholder="Search prompts, tags, artists…" />
        <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', border: '1px solid var(--rule)', padding: '2px 5px', borderRadius: 3 }}>⌘ K</span>
      </div>
      <div className="enki-header-actions">
        <button className={`enki-release-cta${active === 'release' ? ' active' : ''}`} onClick={() => onNav?.("release")}>
          <Plus size={14} strokeWidth={1.75} />
          <span>Release prompt</span>
        </button>
        <button className="enki-icon-btn" title="Notifications"><Bell size={14} /></button>
        <div style={{ position: 'relative' }}>
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
  );
}

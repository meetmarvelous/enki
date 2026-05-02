"use client";
import Header from "@/components/Header";
import Card from "@/components/Card";
import { PROMPTS } from "@/lib/data";

interface AccountPageProps {
  section: "released" | "earnings" | "settings";
}

export default function AccountPage({ section }: AccountPageProps) {
  const released = PROMPTS.filter((_, i) => i % 3 === 0).slice(0, 8);
  const revenue = released.reduce((sum, p) => sum + p.price * Math.round(p.downloads / 120), 0);

  return (
    <>
      <Header active="" />
      <div className="enki-page-title">
        <div className="enki-page-eyebrow">Account / {section}</div>
        <h1 className="enki-page-h1 serif">
          {section === "released" && <><em>Released</em><br />prompts.</>}
          {section === "earnings" && <><em>Earnings</em><br />ledger.</>}
          {section === "settings" && <><em>Studio</em><br />settings.</>}
        </h1>
        <div className="enki-page-lede">
          {section === "released" && "Your published prompt library, linked back into profile, search, favorites, and discovery."}
          {section === "earnings" && "A compact x402 revenue view for prompt use, artist fees, and network settlement."}
          {section === "settings" && "Wallet, display, release defaults, and creator profile controls for the Enki Art studio."}
        </div>
      </div>

      {section === "released" && (
        <div className="enki-masonry" style={{ columnCount: 4 }}>
          {released.map(p => <Card key={p.id} p={p} faved={false} toggleFav={() => {}} />)}
        </div>
      )}

      {section === "earnings" && (
        <main className="enki-account-grid">
          {[
            ["Gross revenue", `$${revenue.toFixed(2)}`],
            ["Prompt uses", released.reduce((sum, p) => sum + p.downloads, 0).toLocaleString()],
            ["Avg. artist fee", `$${(released.reduce((sum, p) => sum + p.price, 0) / released.length).toFixed(2)}`],
            ["Networks", "Base, Solana, Polygon"],
          ].map(([label, value]) => (
            <section key={label} className="enki-account-tile">
              <div className="mono enki-account-label">{label}</div>
              <div className="serif enki-account-value">{value}</div>
            </section>
          ))}
        </main>
      )}

      {section === "settings" && (
        <main className="enki-settings">
          {["Creator profile", "Wallet and payments", "Release defaults", "Notification routing"].map((label, i) => (
            <section key={label} className="enki-settings-row">
              <div>
                <div className="serif enki-settings-title">{label}</div>
                <div className="mono enki-settings-meta">{i === 0 ? "@mira.veil / museum editorial" : "Configured for production preview"}</div>
              </div>
              <button className="enki-btn enki-btn-secondary">Edit</button>
            </section>
          ))}
        </main>
      )}
    </>
  );
}

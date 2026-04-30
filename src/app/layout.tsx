import type { Metadata } from "next";
import "./globals.css";
import "./panel.css";
import "./screens.css";

export const metadata: Metadata = {
  title: "Enki Art",
  description: "Discover, create, and release AI prompt templates.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="enki" data-theme="light" style={{ minHeight: "100vh" }}>
          {children}
        </div>
      </body>
    </html>
  );
}

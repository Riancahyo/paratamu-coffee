import { useState, useEffect } from "react";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer style={{ background: "#1C1917", color: "rgba(255,255,255,0.8)", padding: isMobile ? "48px 24px 28px" : "60px 80px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1.5fr",
          gap: isMobile ? 28 : 48,
          marginBottom: 40, paddingBottom: 40,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>

          <div style={{
            gridColumn: isMobile ? "1 / -1" : "auto",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 24 : 28, color: "white", fontWeight: 700 }}>
              Paratamu
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", maxWidth: isMobile ? "100%" : 280 }}>
              Tempat nyaman untuk setiap momen. Kopi berkualitas, fasilitas lengkap, suasana hangat.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
              <a href="https://instagram.com/paratamucoffee" target="_blank" rel="noopener noreferrer"
                style={{ background: "rgba(255,255,255,0.08)", color: "white", padding: "8px 10px", borderRadius: 6, display: "flex", alignItems: "center" }}>
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: "white", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Menu</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Home", "About", "Facilities", "Menu", "Contact"].map(link => (
                <button key={link} onClick={() => scrollTo(link.toLowerCase())}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    textAlign: "left", color: "rgba(255,255,255,0.55)",
                    fontSize: 13, padding: 0, transition: "color 0.2s",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "var(--sage-light)"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: "white", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Jam Buka</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Setiap hari</p>
                <p style={{ fontSize: 13, color: "white", fontWeight: 500 }}>09.00 – 23.00</p>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <h4 style={{ color: "white", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Kontak</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: <MapPin size={13} />, text: "Jl. Karta Wijaya No.17, Klegen, Kec. Kartoharjo, Kota Madiun, Jawa Timur 63117" },
                { icon: <Phone size={13} />, text: "0813-3007-198" },
              ].map(c => (
                <div key={c.text} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--sage-light)", marginTop: 2, flexShrink: 0 }}>{c.icon}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", alignItems: "center",
          gap: 8, textAlign: "center",
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            © 2026 Rian Cahyo Anggoro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
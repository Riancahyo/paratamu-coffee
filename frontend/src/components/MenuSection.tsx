import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { menuApi, Menu } from "../services/api";

const CATEGORIES = ["Semua", "Coffee", "Non-Coffee", "Snacks"];

const FALLBACK: Record<string, string> = {
  Coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
  "Non-Coffee": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
  Snacks: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
};

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

export default function MenuSection() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [active, setActive] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    menuApi.getAll()
      .then(res => setMenus(res.data.data))
      .catch(() => setMenus([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleCategory = (cat: string) => {
    setActive(cat);
    setShowAll(false);
  };

  const filtered = active === "Semua" ? menus : menus.filter(m => m.category === active);
  const displayed = showAll ? filtered : filtered.slice(0, 4);

  return (
    <section id="menu" style={{ background: "var(--cream)", padding: "80px clamp(24px, 6vw, 80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 36 }}
        >
          <p style={{ color: "var(--sage)", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Menu Kami</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.2 }}>
            Pilihan untuk Setiap Selera
          </h2>
        </motion.div>

        <div style={{
          display: "flex", justifyContent: isMobile ? "flex-start" : "center",
          gap: 8, marginBottom: 32,
          flexWrap: isMobile ? "nowrap" : "wrap",
          overflowX: isMobile ? "scroll" : "visible",
          WebkitOverflowScrolling: "touch" as any,
          paddingBottom: 8,
          msOverflowStyle: "none" as any,
          scrollbarWidth: "none" as any,
          paddingLeft: isMobile ? 4 : 0,
          paddingRight: isMobile ? 4 : 0,
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              style={{
                padding: isMobile ? "8px 16px" : "9px 22px", fontSize: isMobile ? 12 : 13, borderRadius: 40, cursor: "pointer",
                fontFamily: "var(--font-body)", fontWeight: 600,
                border: active === cat ? "none" : "1.5px solid var(--gray-light)",
                background: active === cat ? "var(--sage)" : "white",
                color: active === cat ? "white" : "var(--gray)",
                transition: "all 0.22s", flexShrink: 0,
                boxShadow: active === cat ? "0 4px 12px rgba(124,154,126,0.3)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 36, height: 36, border: "3px solid var(--gray-light)", borderTop: "3px solid var(--sage)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(260px, 1fr))",
            gap: isMobile ? 12 : 16,
          }}>
            {displayed.map((menu, i) => (
              <motion.div
                key={menu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{
                  background: "white", borderRadius: 12, overflow: "hidden",
                  border: "1px solid var(--gray-light)", cursor: "default",
                }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
              >
                <div style={{ position: "relative", height: isMobile ? 130 : 160, overflow: "hidden" }}>
                  <img
                    src={menu.image_url || FALLBACK[menu.category] || FALLBACK["Coffee"]}
                    alt={menu.name}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
                  />
                  <span style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
                    color: "var(--sage-dark)", fontSize: 10, fontWeight: 700,
                    padding: "3px 10px", borderRadius: 20,
                    pointerEvents: "none",
                  }}>
                    {menu.category}
                  </span>
                </div>
                <div style={{ padding: isMobile ? "10px 12px 14px" : "12px 16px 16px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 16 : 20, marginBottom: 4 }}>{menu.name}</h3>
                  <p style={{ color: "var(--gray)", fontSize: isMobile ? 11 : 13, lineHeight: 1.6, marginBottom: 10 }}>{menu.description}</p>
                  <p style={{ color: "var(--sage-dark)", fontWeight: 700, fontSize: isMobile ? 14 : 18 }}>{formatPrice(menu.price)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length > 4 && (
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                border: "1.5px solid var(--sage)", color: "var(--sage-dark)",
                padding: isMobile ? "12px 28px" : "14px 40px", borderRadius: 6,
                fontFamily: "var(--font-body)", fontSize: isMobile ? 13 : 15, fontWeight: 600,
                letterSpacing: 0.5, cursor: "pointer", background: "transparent",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--sage)";
                (e.currentTarget as HTMLButtonElement).style.color = "white";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--sage-dark)";
              }}
            >
              {showAll ? "Sembunyikan ↑" : "Lihat Menu Lengkap →"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
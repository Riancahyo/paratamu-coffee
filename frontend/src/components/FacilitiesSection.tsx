import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Wifi, Coffee, Monitor, Users, Wind, Volume2, Zap, Clock } from "lucide-react";

const SPACES = [
  {
    id: "indoor",
    name: "Indoor",
    description: "Ruang dalam yang nyaman dengan AC dan ambient lighting. Cocok untuk kerja, ngobrol santai, atau date.",
    capacity: "2–30 Orang",
    image: "https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/indoor.jpg",
  },
  {
    id: "outdoor",
    name: "Outdoor",
    description: "Area terbuka dengan suasana segar. Nikmati kopi sambil menghirup udara alami.",
    capacity: "2–30 Orang",
    image: "https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/outdoor.jpg",
  },
  {
    id: "private",
    name: "Meeting Room",
    description: "Ruangan privat eksklusif dengan fasilitas lengkap. Ideal untuk meeting, arisan, atau acara khusus.",
    capacity: "6–20 Orang",
    image: "https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/meeting%20room.jpg",
  },
];

const FACILITIES = [
  { icon: <Wifi size={28} />, label: "Free WiFi 100Mbps", desc: "Internet cepat gratis untuk semua pengunjung. Streaming dan meeting lancar jaya!" },
  { icon: <Coffee size={28} />, label: "Coffee Bar Lengkap", desc: "Pilihan kopi dan minuman non-kopi dari biji lokal berkualitas tinggi." },
  { icon: <Monitor size={28} />, label: "Proyektor & Screen", desc: "Tersedia proyektor HD dan layar besar untuk presentasi profesional." },
  { icon: <Users size={28} />, label: "Meeting Room", desc: "Private room untuk meeting, workshop, atau gathering. Booking di form reservasi." },
  { icon: <Wind size={28} />, label: "AC & Ventilasi", desc: "Suhu ruangan selalu nyaman dengan AC modern dan sirkulasi udara yang baik." },
  { icon: <Volume2 size={28} />, label: "Sound System", desc: "Audio berkualitas untuk acara, background music, atau presentasi." },
  { icon: <Zap size={28} />, label: "Power Outlets", desc: "Stop kontak tersedia di setiap meja. Laptop dan gadget kamu aman, tidak perlu rebutan." },
  { icon: <Clock size={28} />, label: "Buka Sampai Malam", desc: "Buka sampai jam 11 malam. Cocok buat yang suka kerja atau ngobrol larut." },
];

export default function FacilitiesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const facilityColumns = isMobile ? "1fr 1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)";
  const spaceColumns = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)";

  return (
    <section id="facilities" style={{ background: "var(--cream-dark)", padding: "80px clamp(24px, 6vw, 80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <p style={{ color: "var(--sage)", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Fasilitas</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.2 }}>
            Semua yang Kamu Butuhkan
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: "grid", gridTemplateColumns: facilityColumns, gap: isMobile ? 12 : 20, marginBottom: 56 }}
        >
          {FACILITIES.map(f => (
            <div
              key={f.label}
              style={{
                display: "flex", flexDirection: "column", gap: 12,
                padding: isMobile ? "20px 16px" : "28px 24px",
                background: "white", borderRadius: 12,
                border: "1px solid var(--gray-light)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-6px)";
                el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div style={{ color: "var(--sage)", background: "rgba(124,154,126,0.1)", padding: isMobile ? 10 : 14, borderRadius: 10, width: "fit-content" }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: isMobile ? 14 : 16, color: "var(--black)", marginBottom: 6 }}>{f.label}</p>
                <p style={{ fontSize: isMobile ? 12 : 14, color: "var(--gray)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div>
          <p style={{ color: "var(--sage)", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>Pilih Space</p>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 3vw, 36px)", textAlign: "center", marginBottom: 32 }}>
            Temukan Tempat Favoritmu
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: spaceColumns, gap: isMobile ? 16 : 20 }}>
            {SPACES.map(s => (
              <div
                key={s.id}
                style={{
                  position: "relative", borderRadius: 16, overflow: "hidden",
                  height: isMobile ? 300 : 420, cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={s.image}
                  alt={s.name}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)"}
                  onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
                  pointerEvents: "none",
                }} />
                <span style={{
                  position: "absolute", top: 16, left: 16,
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white", fontSize: 12, fontWeight: 600,
                  padding: "5px 14px", borderRadius: 20,
                  pointerEvents: "none",
                }}>
                  {s.capacity}
                </span>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: isMobile ? "20px 18px" : "28px 24px",
                  pointerEvents: "none",
                }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    color: "white", fontSize: isMobile ? 22 : 26, fontWeight: 700, marginBottom: 6,
                  }}>
                    {s.name}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: isMobile ? 13 : 14, lineHeight: 1.6 }}>
                    {s.description}
                  </p>
                  <button
                    onClick={() => scrollTo("contact")}
                    style={{
                      marginTop: 14,
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      color: "white", borderRadius: 20,
                      padding: "7px 18px", cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                      transition: "background 0.2s",
                      pointerEvents: "all",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.28)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"}
                  >
                    Pesan Space →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
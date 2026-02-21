import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Coffee, Users, Clock, Star } from "lucide-react";

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section id="about" style={{ background: "var(--cream)", padding: "80px clamp(24px, 6vw, 80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{
            color: "var(--sage)", fontSize: 13, letterSpacing: 4,
            textTransform: "uppercase", fontWeight: 600,
            textAlign: "center", marginBottom: 30,
          }}
        >
          Tentang Kami
        </motion.p>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 48 : 80,
          alignItems: "center",
        }}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isMobile ? 0 : -40, y: isMobile ? 20 : 0 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ position: "relative", paddingBottom: isMobile ? 0 : 24 }}
          >
            <img
              src="https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/about.jpg"
              alt="Paratamu Coffee Interior"
              style={{
                width: "100%",
                height: isMobile ? 260 : 500,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <div style={{
              position: "absolute",
              bottom: isMobile ? 16 : -24,
              right: isMobile ? 16 : -24,
              background: "var(--sage)", color: "white",
              padding: isMobile ? "16px 20px" : "24px 28px",
              borderRadius: 8, textAlign: "center",
              boxShadow: "0 12px 32px rgba(124,154,126,0.3)",
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 28 : 40, fontWeight: 700, lineHeight: 1 }}>5+</div>
              <div style={{ fontSize: 12, fontWeight: 500, marginTop: 4, letterSpacing: 0.5 }}>Tahun Melayani</div>
            </div>

            {!isMobile && (
              <div style={{
                position: "absolute", top: -16, left: -16,
                width: "60%", height: "60%",
                border: "2px solid var(--sage-light)",
                borderRadius: 8, zIndex: -1,
              }} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 20 : 0 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3vw, 48px)",
              lineHeight: 1.2, color: "var(--black)",
            }}>
              Lebih dari Sekadar<br />Secangkir Kopi
            </h2>
            <p style={{ color: "var(--gray)", lineHeight: 1.85, fontSize: "clamp(14px, 1.5vw, 16px)" }}>
              Paratamu Coffee hadir sebagai ruang ketiga yang hangat dan inklusif.
              Tempat di mana kamu bisa bersantai, berkreasi, atau sekadar
              menikmati waktu bersama orang-orang tersayang.
            </p>
            <p style={{ color: "var(--gray)", lineHeight: 1.85, fontSize: "clamp(14px, 1.5vw, 16px)" }}>
              Kami menyajikan kopi pilihan dengan biji lokal berkualitas tinggi,
              dipadukan dengan suasana yang nyaman dan fasilitas yang lengkap
              untuk memenuhi setiap kebutuhanmu.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10, marginTop: 4,
            }}>
              {[
                { icon: <Coffee size={20} />, num: "20+", label: "Varian Menu" },
                { icon: <Users size={20} />, num: "10K+", label: "Pelanggan" },
                { icon: <Clock size={20} />, num: "14 Jam", label: "Buka Setiap Hari" },
                { icon: <Star size={20} />, num: "4.5", label: "Rating Google" },
              ].map(s => (
                <div
                  key={s.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px",
                    background: "var(--cream-dark)", borderRadius: 8,
                    border: "1px solid var(--gray-light)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div style={{ color: "var(--sage)", flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, lineHeight: 1.1 }}>{s.num}</div>
                    <div style={{ fontSize: 12, color: "var(--gray)", fontWeight: 500 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
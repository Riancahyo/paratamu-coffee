import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      style={{
        position: "relative", minHeight: "100vh",
        backgroundImage: "url(https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/home.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", alignItems: "center",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to right, rgba(20,20,20,0.78) 0%, rgba(20,20,20,0.35) 70%, rgba(20,20,20,0.1) 100%)",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        padding: "0 clamp(24px, 6vw, 80px)",
        maxWidth: 700,
        width: "100%",
      }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            color: "var(--sage-light)", fontSize: "clamp(11px, 1.5vw, 13px)",
            letterSpacing: 5, textTransform: "uppercase", marginBottom: 16,
          }}
        >
          Selamat Datang di Paratamu Coffee
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 6vw, 80px)",
            lineHeight: 1.1, color: "white", marginBottom: 20,
          }}
        >
          Tempat Nyaman<br />untuk Setiap <em>Momen</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "clamp(14px, 2vw, 18px)",
            lineHeight: 1.7, marginBottom: 36,
          }}
        >
          Nikmati kopi berkualitas, suasana hangat, dan fasilitas lengkap
          yang sempurna untuk bersantai maupun bekerja.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <button
            onClick={() => scrollTo("contact")}
            style={{
              background: "var(--sage)", color: "white",
              border: "none", borderRadius: 4,
              padding: "clamp(12px, 2vw, 16px) clamp(24px, 3vw, 36px)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 600,
              letterSpacing: 0.5,
              boxShadow: "0 8px 24px rgba(124,154,126,0.4)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"}
          >
            Reservasi Sekarang
          </button>

          <button
            onClick={() => scrollTo("facilities")}
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)", color: "white",
              border: "1.5px solid rgba(255,255,255,0.7)",
              borderRadius: 4,
              padding: "clamp(12px, 2vw, 16px) clamp(24px, 3vw, 36px)",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.5vw, 15px)", fontWeight: 600,
              letterSpacing: 0.5,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "white"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.5)"}
          >
            Lihat Fasilitas
          </button>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        onClick={() => scrollTo("about")}
        style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          cursor: "pointer", color: "rgba(255,255,255,0.6)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Scroll</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
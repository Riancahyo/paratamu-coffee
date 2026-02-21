import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = ["Home", "About", "Facilities", "Menu", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const matched = LINKS.find(l => l.toLowerCase() === id);
            if (matched) setActive(matched);
          }
        });
      },
      { threshold: 0.4 }
    );
    LINKS.forEach(link => {
      const el = document.getElementById(link.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNav = (link: string) => {
    setActive(link);
    setMobileOpen(false);
    const el = document.getElementById(link.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          padding: isMobile ? "16px 20px" : scrolled ? "14px 60px" : "22px 60px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled || mobileOpen ? "rgba(250,247,242,0.97)" : "transparent",
          backdropFilter: scrolled || mobileOpen ? "blur(12px)" : "none",
          borderBottom: scrolled || mobileOpen ? "1px solid rgba(124,154,126,0.2)" : "none",
          transition: "all 0.35s ease",
        }}
      >
        <img
          src="https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/logo.png"
          alt="Paratamu Logo"
          onClick={() => handleNav("Home")}
          style={{
            height: isMobile ? 30 : 40,      
            cursor: "pointer",
            objectFit: "contain", 
          }}
        />

        {!isMobile && (
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {LINKS.map(link => (
              <button
                key={link}
                onClick={() => handleNav(link)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500,
                  color: scrolled
                    ? (active === link ? "var(--sage-dark)" : "var(--black)")
                    : (active === link ? "var(--sage-light)" : "white"),
                  letterSpacing: 0.5, outline: "none",
                  transition: "all 0.2s",
                }}
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => handleNav("Contact")}
              style={{
                background: scrolled ? "var(--sage)" : "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)", color: "white",
                border: "1.5px solid rgba(255,255,255,0.7)",
                borderRadius: 4, padding: "9px 26px", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600,
                letterSpacing: 0.5, transition: "all 0.3s ease",
              }}
            >
              Reservasi
            </button>
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: scrolled || mobileOpen ? "var(--black)" : "white",
              padding: 4, display: "flex", alignItems: "center",
              transition: "color 0.2s",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
              </motion.div>
            </AnimatePresence>
          </button>
        )}
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", top: 57, left: 0, right: 0, zIndex: 999,
              background: "rgba(250,247,242,0.98)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid var(--gray-light)",
              padding: "8px 20px 24px",
              display: "flex", flexDirection: "column", gap: 0,
            }}
          >
            {LINKS.map(link => (
              <button
                key={link}
                onClick={() => handleNav(link)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left", fontSize: 15,
                  fontWeight: active === link ? 700 : 500,
                  color: active === link ? "var(--sage-dark)" : "var(--black)",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  fontFamily: "var(--font-body)",
                  transition: "color 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                {link}
                {active === link && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sage)", display: "inline-block" }} />
                )}
              </button>
            ))}
            <button
              onClick={() => handleNav("Contact")}
              style={{
                marginTop: 16,
                background: "var(--sage)", color: "white",
                border: "none", borderRadius: 8,
                padding: "14px", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600,
                letterSpacing: 0.3,
              }}
            >
              Reservasi Sekarang
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
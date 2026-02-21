import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const GALLERY = [
  "https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/home.jpg",
  "https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/galery%201.jpg",
  "https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/meeting%20room.jpg",
  "https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/about.jpg",
  "https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/galery%203.jpg",
];

export default function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section style={{ background: "var(--cream-dark)", padding: "80px clamp(24px, 6vw, 80px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <p style={{ color: "var(--sage)", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Galeri</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.2 }}>Momen di Paratamu</h2>
        </motion.div>

        {!isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}
          >
            <div style={{ borderRadius: 12, overflow: "hidden", height: 420 }}>
              <img
                src={GALLERY[0]}
                alt="Gallery main"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)"}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {GALLERY.slice(1).map((src, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: "hidden", height: 204 }}>
                  <img
                    src={src}
                    alt={`Gallery ${i + 2}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"}
                    onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div style={{ gridColumn: "1 / -1", borderRadius: 12, overflow: "hidden", height: 220 }}>
              <img
                src={GALLERY[0]}
                alt="Gallery main"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.03)"}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
              />
            </div>
            {GALLERY.slice(1).map((src, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", height: 150 }}>
                <img
                  src={src}
                  alt={`Gallery ${i + 2}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"}
                  onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
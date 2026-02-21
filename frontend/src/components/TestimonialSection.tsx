import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonialApi, Testimonial } from "../services/api";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    testimonialApi.getAll()
      .then(res => setTestimonials(res.data.data))
      .catch(() => setTestimonials([]));
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section style={{ background: "var(--cream)", padding: "80px clamp(24px, 6vw, 80px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <p style={{ color: "var(--sage)", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Testimoni</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.2 }}>
            Kata Mereka Tentang Kami
          </h2>
        </motion.div>

        <div style={{ position: "relative", padding: isMobile ? "0" : "0 20px" }}>
          {!isMobile && (
            <>
              <button className="swiper-prev-btn" style={navBtnStyle("left")}>
                <ChevronLeft size={20} />
              </button>
              <button className="swiper-next-btn" style={navBtnStyle("right")}>
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={isMobile ? 16 : 24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation={isMobile ? false : { prevEl: ".swiper-prev-btn", nextEl: ".swiper-next-btn" }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            style={{ paddingBottom: 48 }}
          >
            {testimonials.map(t => (
              <SwiperSlide key={t.id}>
                <div style={{
                  background: "white", borderRadius: 12,
                  padding: isMobile ? "24px 20px" : "32px 28px",
                  border: "1px solid var(--gray-light)",
                  height: "100%",
                  display: "flex", flexDirection: "column", gap: 16,
                }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={15} fill="var(--brown-light)" color="var(--brown-light)" />
                    ))}
                  </div>
                  
                  <p style={{
                    color: "var(--gray)", lineHeight: 1.75,
                    fontSize: isMobile ? 13 : 15,
                    fontStyle: "italic", flex: 1,
                  }}>
                    "{t.message}"
                  </p>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                      src={t.avatar_url || `https://i.pravatar.cc/80?u=${t.name}`}
                      alt={t.name}
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, color: "var(--black)" }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: "var(--sage)", fontWeight: 500 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

const navBtnStyle = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  [side === "left" ? "left" : "right"]: -20,
  top: "45%", transform: "translateY(-50%)",
  zIndex: 10,
  width: 44, height: 44,
  borderRadius: "50%",
  border: "1.5px solid var(--gray-light)",
  background: "white",
  color: "var(--sage-dark)",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  transition: "all 0.2s",
});
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useForm } from "react-hook-form";
import { MapPin, Clock, Phone, CheckCircle, Instagram } from "lucide-react";
import { reservationApi } from "../services/api";

type FormData = {
  name: string; phone: string;
  date: string; time: string; space: string;
  guests: number; notes: string;
};

const SPACES = ["Indoor", "Outdoor", "Private Room"];
const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError("");
    try {
      await reservationApi.create(data);
      setSuccess(true);
      reset();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: isMobile ? "10px 12px" : "11px 14px",
    border: "1.5px solid var(--gray-light)",
    borderRadius: 8, fontSize: isMobile ? 14 : 15,
    fontFamily: "var(--font-body)",
    background: "white", color: "var(--black)",
    outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: "var(--black)",
    letterSpacing: 0.3, marginBottom: 5, display: "block",
  };

  return (
    <section id="contact" style={{ background: "var(--cream-dark)", padding: "80px clamp(24px, 6vw, 80px) 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <p style={{ color: "var(--sage)", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>Reservasi & Kontak</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.2 }}>
            Kunjungi atau Hubungi Kami
          </h2>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1.8fr",
          gap: isMobile ? 16 : 24,
          marginBottom: 40,
          alignItems: "stretch",
        }}>
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 16 : 0 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{ display: "flex", flexDirection: isMobile ? "column" : "column", gap: 10 }}
          >
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr",
              gap: 10,
            }}>
              {[
                { icon: <MapPin size={16} />, title: "Lokasi", content: "Jl. Karta Wijaya No.17, Klegen, Kec. Kartoharjo, Kota Madiun, Jawa Timur 63117" },
                { icon: <Clock size={16} />, title: "Jam Operasional", content: "Setiap hari: 09.00 – 23.00" },
                { icon: <Phone size={16} />, title: "WhatsApp", content: "0813-3007-198" },
              ].map(item => (
                <div key={item.title} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: isMobile ? "14px" : "18px 20px", background: "white",
                  borderRadius: 12, border: "1px solid var(--gray-light)",
                }}>
                  <div style={{ color: "var(--sage)", background: "rgba(124,154,126,0.1)", padding: 8, borderRadius: 6, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: isMobile ? 12 : 15, marginBottom: 3, color: "var(--black)" }}>{item.title}</p>
                    <p style={{ color: "var(--gray)", fontSize: isMobile ? 11 : 14, lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.content}</p>
                  </div>
                </div>
              ))}

              <div style={{
                padding: isMobile ? "14px" : "18px 20px", background: "white",
                borderRadius: 12, border: "1px solid var(--gray-light)",
                display: "flex", flexDirection: "column", justifyContent: "center",
              }}>
                <p style={{ fontWeight: 700, fontSize: isMobile ? 12 : 15, marginBottom: 10, color: "var(--black)" }}>Sosial Media</p>
                <a
                  href="https://instagram.com/paratamucoffee"
                  target="_blank" rel="noopener noreferrer"
                  title="@paratamucoffee"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: isMobile ? 28 : 34, height: isMobile ? 28 : 34, 
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", // Warna kembali
                    color: "white", 
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <Instagram size={isMobile ? 16 : 20} /> 
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 30, y: isMobile ? 16 : 0 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              background: "white", borderRadius: 12,
              padding: isMobile ? "24px 20px" : "36px 40px",
              border: "1px solid var(--gray-light)",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 28, marginBottom: isMobile ? 18 : 24 }}>Form Reservasi</h3>

            {success ? (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <CheckCircle size={48} color="var(--sage)" style={{ margin: "0 auto 14px" }} />
                <h4 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 10 }}>Reservasi Berhasil!</h4>
                <p style={{ color: "var(--gray)", lineHeight: 1.7, fontSize: 14 }}>Terima kasih! Kami akan menghubungi kamu untuk konfirmasi dalam waktu 1x24 jam.</p>
                <button onClick={() => setSuccess(false)} style={{ marginTop: 20, background: "var(--sage)", color: "white", border: "none", borderRadius: 6, padding: "11px 24px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600 }}>
                  Buat Reservasi Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 16 }}>
                  <div>
                    <label style={labelStyle}>Nama Lengkap *</label>
                    <input {...register("name", { required: true })} style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : "var(--gray-light)" }} placeholder="Masukkan Nama" />
                  </div>
                  <div>
                    <label style={labelStyle}>No. WhatsApp *</label>
                    <input {...register("phone", { required: true })} style={{ ...inputStyle, borderColor: errors.phone ? "#ef4444" : "var(--gray-light)" }} placeholder="08xxxxxxxxxx" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 16 }}>
                  <div>
                    <label style={labelStyle}>Tanggal *</label>
                    <input {...register("date", { required: true })} type="date" style={{ ...inputStyle, borderColor: errors.date ? "#ef4444" : "var(--gray-light)" }} min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <label style={labelStyle}>Jam *</label>
                    <select {...register("time", { required: true })} style={{ ...inputStyle, borderColor: errors.time ? "#ef4444" : "var(--gray-light)" }}>
                      <option value="">Pilih jam</option>
                      {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 16 }}>
                  <div>
                    <label style={labelStyle}>Pilih Space *</label>
                    <select {...register("space", { required: true })} style={{ ...inputStyle, borderColor: errors.space ? "#ef4444" : "var(--gray-light)" }}>
                      <option value="">Pilih space</option>
                      {SPACES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Jumlah Tamu</label>
                    <input {...register("guests")} type="number" min={1} max={50} defaultValue={2} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Catatan Tambahan</label>
                  <textarea {...register("notes")} style={{ ...inputStyle, height: isMobile ? 60 : 80, resize: "vertical" }} placeholder="Kebutuhan khusus, acara spesial, dll..." />
                </div>

                {error && <p style={{ color: "#ef4444", fontSize: 13 }}>{error}</p>}

                <button
                  type="submit" disabled={submitting}
                  style={{
                    background: submitting ? "var(--gray-light)" : "var(--sage)",
                    color: submitting ? "var(--gray)" : "white",
                    border: "none", borderRadius: 8, padding: isMobile ? "12px" : "14px",
                    fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  {submitting ? "Mengirim..." : "Kirim Reservasi"}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", height: isMobile ? 200 : 280, marginBottom: 56 }}>
          <img
            src="https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/maps_lok.png"
            alt="Paratamu Coffee Location"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <a
            href="https://maps.app.goo.gl/7jNDKmNxMeTjQCoA8"
            target="_blank" rel="noopener noreferrer"
            style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 6, textDecoration: "none",
            }}
          >
            <MapPin size={isMobile ? 24 : 32} color="white" />
            <h3 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: isMobile ? 20 : 28, fontWeight: 700, marginBottom: 2 }}>
              Paratamu Coffee
            </h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: isMobile ? 12 : 15, textAlign: "center", padding: "0 16px" }}>
              Jl. Karta Wijaya No.17, Klegen, Kec. Kartoharjo, Kota Madiun, Jawa Timur 63117
            </p>
            <span style={{
              marginTop: 8,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "white", padding: isMobile ? "6px 16px" : "8px 22px",
              borderRadius: 20, fontSize: isMobile ? 12 : 13, fontWeight: 600,
            }}>
              Buka di Google Maps
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
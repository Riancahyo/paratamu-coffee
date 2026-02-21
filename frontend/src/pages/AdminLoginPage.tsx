import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { adminApi } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) navigate("/admin/dashboard");
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.login(email, password);
      localStorage.setItem("admin_token", res.data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      fontFamily: "var(--font-body)",
      background: "#1C1917",
    }}>
      {!isMobile && (
        <div style={{
          width: "45%", position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "48px",
        }}>
          <img
            src="https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/home.jpg"
            alt="Paratamu Coffee"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(10,10,8,0.92) 0%, rgba(10,10,8,0.4) 50%, rgba(10,10,8,0.2) 100%)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(124,154,126,0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(124,154,126,0.4)",
              borderRadius: 20, padding: "6px 14px", marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--sage)" }} />
              <span style={{ fontSize: 12, color: "var(--sage-light)", fontWeight: 600, letterSpacing: 1 }}>ADMIN PANEL</span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)", color: "white",
              fontSize: 36, lineHeight: 1.25, marginBottom: 12,
            }}>
              Kelola Paratamu<br />dengan Mudah
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7 }}>
              Dashboard untuk mengelola menu, reservasi,<br />dan testimoni pelanggan.
            </p>
          </div>
        </div>
      )}

      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "32px 24px" : "48px 64px",
        background: "#1C1917",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", maxWidth: isMobile ? 320 : 400 }}
        >
          <div style={{ textAlign: "center", marginBottom: isMobile ? 20 : 32 }}>
            <div style={{
              width: isMobile ? 150 : 400,
              height: isMobile ? 56 : 100,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto",
            }}>
              <img
                src="https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/logo.png"
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <p style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: isMobile ? 11 : 13,
              marginTop: isMobile ? 8 : 16,
              letterSpacing: 0.3,
            }}>
              Admin Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 18 }}>
            <div>
              <label style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                display: "block", marginBottom: 7,
              }}>Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Masukkan email"
                required
                style={{
                  width: "100%", padding: isMobile ? "11px 14px" : "13px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, fontSize: isMobile ? 13 : 14, color: "white",
                  outline: "none", fontFamily: "var(--font-body)",
                  boxSizing: "border-box", transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(188,163,127,0.6)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div>
              <label style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                display: "block", marginBottom: 7,
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  style={{
                    width: "100%", padding: isMobile ? "11px 42px 11px 14px" : "13px 44px 13px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, fontSize: isMobile ? 13 : 14, color: "white",
                    outline: "none", fontFamily: "var(--font-body)",
                    boxSizing: "border-box", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(188,163,127,0.6)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.3)", padding: 0, display: "flex",
                  }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 8, padding: "9px 13px",
                color: "#fca5a5", fontSize: 12,
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                marginTop: isMobile ? 2 : 4,
                background: loading ? "rgba(188,163,127,0.4)" : "var(--sage)",
                color: "white", border: "none", borderRadius: 10,
                padding: isMobile ? "12px" : "14px",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)",
                fontSize: isMobile ? 14 : 15,
                fontWeight: 700, letterSpacing: 0.3, transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 4px 20px rgba(188,163,127,0.25)",
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              {loading ? "Masuk..." : "Masuk ke Dashboard"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
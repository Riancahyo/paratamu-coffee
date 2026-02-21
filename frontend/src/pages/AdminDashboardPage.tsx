import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { menuApi, reservationApi, testimonialApi, adminApi, Menu, Reservation, Testimonial } from "../services/api";
import {
  UtensilsCrossed, CalendarCheck, MessageSquare,
  LogOut, Plus, Pencil, Trash2, Upload, Star, X, Menu as MenuIcon, AlertTriangle,
} from "lucide-react";

type Tab = "menu" | "reservasi" | "testimoni";

const CATEGORIES = ["Coffee", "Non-Coffee", "Snacks"];
const STATUSES = ["pending", "confirmed", "cancelled"];
const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending:   { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  confirmed: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  cancelled: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
};

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

function ConfirmDialog({ open, title, message, onConfirm, onCancel, isMobile }: {
  open: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void; isMobile: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
          }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: "white", borderRadius: 18,
              padding: isMobile ? "28px 22px" : "36px 40px",
              maxWidth: 380, width: "100%",
              boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
              textAlign: "center",
            }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "#fef2f2", border: "2px solid #fecaca",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
            }}>
              <AlertTriangle size={26} color="#ef4444" />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8, color: "var(--black)" }}>
              {title}
            </h3>
            <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.65, marginBottom: 26 }}>
              {message}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onCancel} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                border: "1.5px solid var(--gray-light)", background: "var(--cream-dark)",
                cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600,
                color: "var(--black)",
              }}>Batal</button>
              <button onClick={onConfirm} style={{
                flex: 1, padding: "12px", borderRadius: 10,
                border: "none", background: "#ef4444",
                cursor: "pointer", fontFamily: "var(--font-body)",
                fontSize: 14, fontWeight: 700, color: "white",
                boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
              }}>Hapus</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("menu");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuForm, setMenuForm] = useState<Partial<Menu>>({});
  const [editingMenu, setEditingMenu] = useState<number | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [activeCatFilter, setActiveCatFilter] = useState("Semua");
  const fileRef = useRef<HTMLInputElement>(null);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resLoading, setResLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("semua");

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testiLoading, setTestiLoading] = useState(true);
  const [testiForm, setTestiForm] = useState<Partial<Testimonial>>({ rating: 5 });
  const [showTestiForm, setShowTestiForm] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});

  const showConfirm = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin");
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => { loadMenus(); loadReservations(); loadTestimonials(); }, []);

  useEffect(() => {
    document.body.style.overflow = (isMobile && sidebarOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, sidebarOpen]);

  const loadMenus = () => {
    setMenuLoading(true);
    menuApi.getAll().then(r => setMenus(r.data.data)).finally(() => setMenuLoading(false));
  };
  const loadReservations = () => {
    setResLoading(true);
    reservationApi.getAll().then(r => setReservations(r.data.data)).finally(() => setResLoading(false));
  };
  const loadTestimonials = () => {
    setTestiLoading(true);
    testimonialApi.getAll().then(r => setTestimonials(r.data.data)).finally(() => setTestiLoading(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const res = await adminApi.uploadImage(file);
      setMenuForm(f => ({ ...f, image_url: res.data.url }));
    } catch { alert("Gagal upload gambar"); }
    finally { setUploadingImg(false); }
  };

  const handleSaveMenu = async () => {
    if (!menuForm.name || !menuForm.price || !menuForm.category) return alert("Lengkapi data menu!");
    try {
      if (editingMenu) await menuApi.update(editingMenu, menuForm);
      else await menuApi.create(menuForm as Omit<Menu, "id" | "created_at">);
      setShowMenuForm(false); setMenuForm({}); setEditingMenu(null);
      loadMenus();
    } catch { alert("Gagal menyimpan menu"); }
  };

  const handleDeleteMenu = (id: number, name: string) => {
    showConfirm(
      "Hapus Menu",
      `Yakin ingin menghapus "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      async () => { setConfirmOpen(false); await menuApi.delete(id); loadMenus(); }
    );
  };

  const handleEditMenu = (m: Menu) => {
    setMenuForm(m); setEditingMenu(m.id); setShowMenuForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = async (id: number, status: string) => {
    await reservationApi.updateStatus(id, status); loadReservations();
  };

  const handleSaveTesti = async () => {
    if (!testiForm.name || !testiForm.message) return alert("Lengkapi data testimoni!");
    try {
      await testimonialApi.create(testiForm as Omit<Testimonial, "id">);
      setShowTestiForm(false); setTestiForm({ rating: 5 }); loadTestimonials();
    } catch { alert("Gagal menyimpan testimoni"); }
  };

  const handleDeleteTesti = (id: number, name: string) => {
    showConfirm(
      "Hapus Testimoni",
      `Yakin ingin menghapus testimoni dari "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      async () => { setConfirmOpen(false); await testimonialApi.delete(id); loadTestimonials(); }
    );
  };

  const menusByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = menus.filter(m => m.category === cat);
    return acc;
  }, {} as Record<string, Menu[]>);

  const testiByRating = [5, 4, 3, 2, 1].reduce((acc, r) => {
    const items = testimonials.filter(t => t.rating === r);
    if (items.length) acc[r] = items;
    return acc;
  }, {} as Record<number, Testimonial[]>);

  const filteredRes = statusFilter === "semua" ? reservations : reservations.filter(r => r.status === statusFilter);
  const pendingCount = reservations.filter(r => r.status === "pending").length;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 13px",
    border: "1.5px solid var(--gray-light)", borderRadius: 8,
    fontSize: 14, fontFamily: "var(--font-body)",
    background: "white", outline: "none",
    boxSizing: "border-box", color: "var(--black)",
    transition: "border-color 0.2s",
  };

  const pill = (active: boolean): React.CSSProperties => ({
    padding: "7px 16px", borderRadius: 20, cursor: "pointer",
    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
    border: active ? "none" : "1.5px solid var(--gray-light)",
    background: active ? "var(--sage)" : "white",
    color: active ? "white" : "var(--gray)",
    whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.18s",
  });

  const NAV_ITEMS = [
    { id: "menu" as Tab, label: "Menu", icon: <UtensilsCrossed size={17} /> },
    { id: "reservasi" as Tab, label: "Reservasi", icon: <CalendarCheck size={17} />, badge: pendingCount > 0 ? pendingCount : null },
    { id: "testimoni" as Tab, label: "Testimoni", icon: <MessageSquare size={17} /> },
  ];

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, padding: "0 4px" }}>
        <div style={{
          width: 50, height: 50, borderRadius: 10, overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <img src="https://dkurrheuwqzcxtkthhit.supabase.co/storage/v1/object/public/images/logo_dashboard.png" style={{width:"100%",height:"100%",objectFit:"cover"}} />
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", color: "white", fontSize: 17, fontWeight: 700, lineHeight: 1.1 }}>
            Paratamu
          </p>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1, textTransform: "uppercase" }}>Admin Panel</p>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 2, textTransform: "uppercase", padding: "0 8px", marginBottom: 10 }}>Manajemen</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV_ITEMS.map(item => {
            const isActive = tab === item.id;
            return (
              <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 12px", borderRadius: 9,
                  background: isActive ? "rgba(124,154,126,0.16)" : "transparent",
                  border: isActive ? "1px solid rgba(124,154,126,0.25)" : "1px solid transparent",
                  color: isActive ? "var(--sage-light)" : "rgba(255,255,255,0.45)",
                  cursor: "pointer", fontFamily: "var(--font-body)",
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  width: "100%", textAlign: "left", transition: "all 0.15s",
                }}>
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {"badge" in item && item.badge !== null && (
                  <span style={{ background: "#f59e0b", color: "white", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 10, lineHeight: 1.6 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: 14 }} />

      <button onClick={handleLogout}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "11px 12px", borderRadius: 9,
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          color: "#f87171", cursor: "pointer",
          fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600,
          width: "100%", transition: "all 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.18)"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
      >
        <LogOut size={16} /> Keluar
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--cream-dark)", fontFamily: "var(--font-body)" }}>

      <ConfirmDialog
        open={confirmOpen} title={confirmTitle} message={confirmMessage}
        onConfirm={confirmAction} onCancel={() => setConfirmOpen(false)} isMobile={isMobile}
      />

      {!isMobile && (
        <div style={{ width: 240, flexShrink: 0, background: "#1C1917", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          <SidebarContent />
        </div>
      )}

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, backdropFilter: "blur(2px)" }} />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 280, background: "#1C1917", zIndex: 101, overflowY: "auto" }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {isMobile && (
          <div style={{ background: "white", borderBottom: "1px solid var(--gray-light)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 50 }}>
            <button onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--black)", padding: 2, display: "flex" }}>
              <MenuIcon size={22} />
            </button>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>
              Paratamu
            </span>
            <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 600, color: "var(--sage-dark)", textTransform: "capitalize" }}>{tab}</span>
          </div>
        )}

        <div style={{ flex: 1, padding: isMobile ? "20px 16px" : "36px 40px" }}>
          {tab === "menu" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>Menu</h1>
                  <p style={{ color: "var(--gray)", fontSize: 13, marginTop: 3 }}>{menus.length} item tersedia</p>
                </div>
                <button onClick={() => { setMenuForm({}); setEditingMenu(null); setShowMenuForm(true); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--sage)", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "var(--font-body)", boxShadow: "0 4px 12px rgba(124,154,126,0.3)" }}>
                  <Plus size={15} /> Tambah Menu
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
                {["Semua", ...CATEGORIES].map(cat => (
                  <button key={cat} onClick={() => setActiveCatFilter(cat)} style={pill(activeCatFilter === cat)}>
                    {cat}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {showMenuForm && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    style={{ background: "white", borderRadius: 14, border: "1.5px solid var(--sage)", padding: isMobile ? "20px 16px" : "28px", marginBottom: 24, boxShadow: "0 4px 24px rgba(124,154,126,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{editingMenu ? "Edit Menu" : "Tambah Menu Baru"}</h3>
                      <button onClick={() => { setShowMenuForm(false); setMenuForm({}); setEditingMenu(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray)", padding: 4 }}><X size={18} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Nama *</label>
                        <input value={menuForm.name || ""} onChange={e => setMenuForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Espresso" />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Harga *</label>
                        <input type="number" value={menuForm.price || ""} onChange={e => setMenuForm(f => ({ ...f, price: Number(e.target.value) }))} style={inputStyle} placeholder="25000" />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Kategori *</label>
                        <select value={menuForm.category || ""} onChange={e => setMenuForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                          <option value="">Pilih kategori</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Foto</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input value={menuForm.image_url || ""} onChange={e => setMenuForm(f => ({ ...f, image_url: e.target.value }))} style={{ ...inputStyle, flex: 1 }} placeholder="URL atau upload" />
                          <button onClick={() => fileRef.current?.click()}
                            style={{ padding: "10px 14px", background: "var(--cream-dark)", border: "1.5px solid var(--gray-light)", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
                            <Upload size={14} /> {uploadingImg ? "..." : "Upload"}
                          </button>
                          <input ref={fileRef} type="file" accept="image/*" onChange={handleUploadImage} style={{ display: "none" }} />
                        </div>
                        {menuForm.image_url && (
                          <img src={menuForm.image_url} alt="preview" style={{ marginTop: 8, width: 80, height: 60, objectFit: "cover", borderRadius: 6, border: "1px solid var(--gray-light)" }} />
                        )}
                      </div>
                      <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Deskripsi</label>
                        <textarea value={menuForm.description || ""} onChange={e => setMenuForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, height: 70, resize: "vertical" }} placeholder="Deskripsi menu..." />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                      <button onClick={handleSaveMenu} style={{ background: "var(--sage)", color: "white", border: "none", borderRadius: 8, padding: "11px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "var(--font-body)" }}>
                        {editingMenu ? "Simpan Perubahan" : "Tambah Menu"}
                      </button>
                      <button onClick={() => { setShowMenuForm(false); setMenuForm({}); setEditingMenu(null); }}
                        style={{ background: "var(--cream-dark)", border: "1.5px solid var(--gray-light)", borderRadius: 8, padding: "11px 20px", cursor: "pointer", fontSize: 14, fontFamily: "var(--font-body)" }}>
                        Batal
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {menuLoading ? (
                <div style={{ textAlign: "center", padding: 60, color: "var(--gray)" }}>Memuat menu...</div>
              ) : menus.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: "var(--gray)" }}>
                  <UtensilsCrossed size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <p>Belum ada menu. Tambahkan menu pertama!</p>
                </div>
              ) : (
                <div>
                  {(activeCatFilter === "Semua" ? CATEGORIES : [activeCatFilter]).map(cat => {
                    const items = menusByCategory[cat] || [];
                    if (activeCatFilter === "Semua" && items.length === 0) return null;
                    return (
                      <div key={cat} style={{ marginBottom: 32 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--black)", whiteSpace: "nowrap" }}>{cat}</h2>
                          <span style={{ background: "var(--sage)", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, flexShrink: 0 }}>{items.length}</span>
                          <div style={{ flex: 1, height: 1, background: "var(--gray-light)" }} />
                        </div>
                        {items.length === 0 ? (
                          <p style={{ color: "var(--gray)", fontSize: 13, padding: "12px 0" }}>Belum ada item dalam kategori ini.</p>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: isMobile ? 10 : 14 }}>
                            {items.map(m => (
                              <div key={m.id}
                                style={{ background: "white", borderRadius: 12, border: "1px solid var(--gray-light)", overflow: "hidden", transition: "box-shadow 0.2s" }}
                                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
                                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                              >
                                <div style={{ height: isMobile ? 100 : 130, overflow: "hidden" }}>
                                  <img src={m.image_url || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"} alt={m.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div style={{ padding: isMobile ? "10px" : "14px 16px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                                    <div style={{ minWidth: 0 }}>
                                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 13 : 15, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</h3>
                                      <p style={{ color: "var(--gray)", fontSize: isMobile ? 10 : 12, lineHeight: 1.4, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>{m.description}</p>
                                      <p style={{ color: "var(--sage-dark)", fontWeight: 700, fontSize: isMobile ? 12 : 14 }}>{formatPrice(m.price)}</p>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
                                      <button onClick={() => handleEditMenu(m)}
                                        style={{ padding: "5px 7px", background: "var(--cream-dark)", border: "1px solid var(--gray-light)", borderRadius: 6, cursor: "pointer", color: "var(--sage-dark)", display: "flex" }}>
                                        <Pencil size={11} />
                                      </button>
                                      <button onClick={() => handleDeleteMenu(m.id, m.name)}
                                        style={{ padding: "5px 7px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", color: "#ef4444", display: "flex" }}>
                                        <Trash2 size={11} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "reservasi" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>Reservasi</h1>
                <p style={{ color: "var(--gray)", fontSize: 13, marginTop: 3 }}>{reservations.length} total reservasi</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? 8 : 14, marginBottom: 20 }}>
                {[
                  { label: "Pending", count: reservations.filter(r => r.status === "pending").length, ...STATUS_COLORS.pending },
                  { label: "Confirmed", count: reservations.filter(r => r.status === "confirmed").length, ...STATUS_COLORS.confirmed },
                  { label: "Cancelled", count: reservations.filter(r => r.status === "cancelled").length, ...STATUS_COLORS.cancelled },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12, padding: isMobile ? "12px 10px" : "18px 20px" }}>
                    <p style={{ fontSize: isMobile ? 22 : 30, fontWeight: 700, color: s.text, fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.count}</p>
                    <p style={{ fontSize: isMobile ? 10 : 12, color: s.text, fontWeight: 600, marginTop: 4 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
                {["semua", "pending", "confirmed", "cancelled"].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} style={pill(statusFilter === s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {resLoading ? (
                <div style={{ textAlign: "center", padding: 60, color: "var(--gray)" }}>Memuat reservasi...</div>
              ) : filteredRes.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: "var(--gray)" }}>
                  <CalendarCheck size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <p>Tidak ada reservasi</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredRes.map(r => (
                    <div key={r.id} style={{
                      background: "white", borderRadius: 12, border: "1px solid var(--gray-light)",
                      padding: isMobile ? "14px" : "18px 22px",
                      display: "flex", flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "flex-start" : "center", gap: 12,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <p style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</p>
                          <span style={{
                            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                            background: STATUS_COLORS[r.status]?.bg || "#f3f4f6",
                            color: STATUS_COLORS[r.status]?.text || "#666",
                            border: `1px solid ${STATUS_COLORS[r.status]?.border || "#e5e7eb"}`,
                            textTransform: "capitalize",
                          }}>{r.status}</span>
                        </div>
                        <p style={{ color: "var(--gray)", fontSize: 13 }}>{r.phone} · {r.space} · {r.guests} tamu</p>
                        <p style={{ color: "var(--gray)", fontSize: 12, marginTop: 2 }}>{r.date} pukul {r.time}</p>
                        {r.notes && <p style={{ fontSize: 12, color: "var(--sage-dark)", marginTop: 4, fontStyle: "italic" }}>"{r.notes}"</p>}
                      </div>
                      <select value={r.status} onChange={e => handleStatusChange(r.id, e.target.value)}
                        style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--gray-light)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)", background: "white", color: "var(--black)", flexShrink: 0 }}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "testimoni" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>Testimoni</h1>
                  <p style={{ color: "var(--gray)", fontSize: 13, marginTop: 3 }}>{testimonials.length} testimoni</p>
                </div>
                <button onClick={() => setShowTestiForm(!showTestiForm)}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--sage)", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "var(--font-body)", boxShadow: "0 4px 12px rgba(124,154,126,0.3)" }}>
                  <Plus size={15} /> Tambah Testimoni
                </button>
              </div>

              <AnimatePresence>
                {showTestiForm && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    style={{ background: "white", borderRadius: 14, border: "1.5px solid var(--sage)", padding: isMobile ? "20px 16px" : "28px", marginBottom: 24, boxShadow: "0 4px 24px rgba(124,154,126,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Tambah Testimoni</h3>
                      <button onClick={() => setShowTestiForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray)", padding: 4 }}><X size={18} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Nama *</label>
                        <input value={testiForm.name || ""} onChange={e => setTestiForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Nama pelanggan" />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Role / Pekerjaan</label>
                        <input value={testiForm.role || ""} onChange={e => setTestiForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} placeholder="Mahasiswa, dll" />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Rating</label>
                        <select value={testiForm.rating || 5} onChange={e => setTestiForm(f => ({ ...f, rating: Number(e.target.value) }))} style={inputStyle}>
                          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{"⭐".repeat(r)} ({r})</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Avatar URL (opsional)</label>
                        <input value={testiForm.avatar_url || ""} onChange={e => setTestiForm(f => ({ ...f, avatar_url: e.target.value }))} style={inputStyle} placeholder="https://..." />
                      </div>
                      <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
                        <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Pesan *</label>
                        <textarea value={testiForm.message || ""} onChange={e => setTestiForm(f => ({ ...f, message: e.target.value }))} style={{ ...inputStyle, height: 80, resize: "vertical" }} placeholder="Tuliskan testimoni..." />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                      <button onClick={handleSaveTesti} style={{ background: "var(--sage)", color: "white", border: "none", borderRadius: 8, padding: "11px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "var(--font-body)" }}>
                        Simpan Testimoni
                      </button>
                      <button onClick={() => setShowTestiForm(false)}
                        style={{ background: "var(--cream-dark)", border: "1.5px solid var(--gray-light)", borderRadius: 8, padding: "11px 20px", cursor: "pointer", fontSize: 14, fontFamily: "var(--font-body)" }}>
                        Batal
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {testiLoading ? (
                <div style={{ textAlign: "center", padding: 60, color: "var(--gray)" }}>Memuat testimoni...</div>
              ) : testimonials.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: "var(--gray)" }}>
                  <MessageSquare size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <p>Belum ada testimoni.</p>
                </div>
              ) : (
                <div>
                  {Object.entries(testiByRating).map(([rating, items]) => (
                    <div key={rating} style={{ marginBottom: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                          {Array.from({ length: Number(rating) }).map((_, i) => (
                            <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                        <span style={{ background: "#fef9c3", color: "#a16207", fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, flexShrink: 0 }}>
                          {items.length}
                        </span>
                        <div style={{ flex: 1, height: 1, background: "var(--gray-light)" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
                        {items.map(t => (
                          <div key={t.id}
                            style={{ background: "white", borderRadius: 12, border: "1px solid var(--gray-light)", padding: "16px 18px", transition: "box-shadow 0.2s" }}
                            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"}
                            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <img src={t.avatar_url || `https://i.pravatar.cc/48?u=${t.name}`} alt={t.name}
                                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                                <div>
                                  <p style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</p>
                                  <p style={{ fontSize: 11, color: "var(--sage)", fontWeight: 500 }}>{t.role}</p>
                                </div>
                              </div>
                              <button onClick={() => handleDeleteTesti(t.id, t.name)}
                                style={{ padding: "5px 7px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", color: "#ef4444", display: "flex", flexShrink: 0 }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <p style={{ color: "var(--gray)", fontSize: 13, lineHeight: 1.6, fontStyle: "italic" }}>"{t.message}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
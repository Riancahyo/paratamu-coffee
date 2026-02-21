import { Router, Request, Response } from "express";
import { getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu } from "../controllers/menu.controller";
import { getAllReservations, createReservation, updateReservationStatus, deleteReservation } from "../controllers/reservation.controller";
import { getAllTestimonials, createTestimonial, deleteTestimonial, updateTestimonial } from "../controllers/testimonial.controller";
import jwt from "jsonwebtoken";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const JWT_SECRET = process.env.JWT_SECRET as string;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;

const authMiddleware = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token invalid" });
  }
};

router.post("/admin/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: "Email atau password salah" });
  }
});

router.post("/admin/upload", authMiddleware, upload.single("image"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "No file" });

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const ext = file.originalname.split(".").pop();
    const fileName = `menu/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
    res.json({ success: true, url: publicUrl });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
});

router.get("/menus", getAllMenus);
router.get("/menus/:id", getMenuById);
router.post("/menus", authMiddleware, createMenu);
router.put("/menus/:id", authMiddleware, updateMenu);
router.delete("/menus/:id", authMiddleware, deleteMenu);

router.get("/reservations", authMiddleware, getAllReservations);
router.post("/reservations", createReservation);
router.put("/reservations/:id/status", authMiddleware, updateReservationStatus);
router.delete("/reservations/:id", authMiddleware, deleteReservation);

router.get("/testimonials", getAllTestimonials);
router.post("/testimonials", authMiddleware, createTestimonial);
router.put("/testimonials/:id", authMiddleware, updateTestimonial);
router.delete("/testimonials/:id", authMiddleware, deleteTestimonial);

export default router;
import { Request, Response } from "express";
import pool from "../db/pool";

export const getAllTestimonials = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM testimonials ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: "Gagal mengambil testimoni" });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, role, message, rating, avatar_url } = req.body;
    if (!name || !message || !rating)
      return res.status(400).json({ success: false, message: "name, message, rating wajib diisi" });
    const { rows } = await pool.query(
      `INSERT INTO testimonials (name, role, message, rating, avatar_url) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, role || "", message, rating, avatar_url || ""]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: "Gagal tambah testimoni" });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("DELETE FROM testimonials WHERE id=$1 RETURNING *", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Testimoni tidak ditemukan" });
    res.json({ success: true, message: "Testimoni dihapus" });
  } catch {
    res.status(500).json({ success: false, message: "Gagal hapus testimoni" });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, role, message, rating, avatar_url } = req.body;
    const { rows } = await pool.query(
      `UPDATE testimonials SET name=COALESCE($1,name), role=COALESCE($2,role), message=COALESCE($3,message), rating=COALESCE($4,rating), avatar_url=COALESCE($5,avatar_url) WHERE id=$6 RETURNING *`,
      [name, role, message, rating, avatar_url, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Testimoni tidak ditemukan" });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: "Gagal update testimoni" });
  }
};
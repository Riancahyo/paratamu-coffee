import { Request, Response } from "express";
import pool from "../db/pool";

export const getAllMenus = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM menus ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: "Gagal mengambil data menu" });
  }
};

export const getMenuById = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM menus WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Menu tidak ditemukan" });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: "Gagal mengambil menu" });
  }
};

export const createMenu = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    if (!name || !price || !category)
      return res.status(400).json({ success: false, message: "name, price, category wajib diisi" });
    const { rows } = await pool.query(
      `INSERT INTO menus (name, description, price, category, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, description, price, category, image_url]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: "Gagal membuat menu" });
  }
};

export const updateMenu = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    const { rows } = await pool.query(
      `UPDATE menus SET name=$1,description=$2,price=$3,category=$4,image_url=$5 WHERE id=$6 RETURNING *`,
      [name, description, price, category, image_url, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Menu tidak ditemukan" });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: "Gagal update menu" });
  }
};

export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("DELETE FROM menus WHERE id=$1 RETURNING *", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Menu tidak ditemukan" });
    res.json({ success: true, message: "Menu berhasil dihapus" });
  } catch {
    res.status(500).json({ success: false, message: "Gagal hapus menu" });
  }
};
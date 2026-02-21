import { Request, Response } from "express";
import pool from "../db/pool";

export const getAllReservations = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM reservations ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch {
    res.status(500).json({ success: false, message: "Gagal mengambil data reservasi" });
  }
};

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { name, phone, date, time, space, guests, notes } = req.body;
    if (!name || !phone || !date || !time || !space)
      return res.status(400).json({ success: false, message: "name, phone, date, time, space wajib diisi" });
    const { rows } = await pool.query(
      `INSERT INTO reservations (name, phone, date, time, space, guests, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, phone, date, time, space, guests || 1, notes || ""]
    );
    res.status(201).json({ success: true, data: rows[0], message: "Reservasi berhasil dibuat!" });
  } catch {
    res.status(500).json({ success: false, message: "Gagal membuat reservasi" });
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { rows } = await pool.query(
      "UPDATE reservations SET status=$1 WHERE id=$2 RETURNING *",
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Reservasi tidak ditemukan" });
    res.json({ success: true, data: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: "Gagal update reservasi" });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("DELETE FROM reservations WHERE id=$1 RETURNING *", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Reservasi tidak ditemukan" });
    res.json({ success: true, message: "Reservasi dihapus" });
  } catch {
    res.status(500).json({ success: false, message: "Gagal hapus reservasi" });
  }
};
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api`,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface Menu {
  id: number; name: string; description: string;
  price: number; category: string; image_url: string; created_at: string;
}
export interface Reservation {
  id: number; name: string; phone: string;
  date: string; time: string; space: string; guests: number; notes: string; status: string;
}
export interface Testimonial {
  id: number; name: string; role: string;
  message: string; rating: number; avatar_url: string; approved: boolean;
}

export const menuApi = {
  getAll: () => api.get<{ success: boolean; data: Menu[] }>("/menus"),
  create: (data: Omit<Menu, "id" | "created_at">) => api.post("/menus", data),
  update: (id: number, data: Partial<Menu>) => api.put(`/menus/${id}`, data),
  delete: (id: number) => api.delete(`/menus/${id}`),
};

export const reservationApi = {
  create: (data: Omit<Reservation, "id" | "status">) =>
    api.post<{ success: boolean; data: Reservation; message: string }>("/reservations", data),
  getAll: () => api.get<{ success: boolean; data: Reservation[] }>("/reservations"),
  updateStatus: (id: number, status: string) => api.put(`/reservations/${id}/status`, { status }),
};

export const testimonialApi = {
  getAll: () => api.get<{ success: boolean; data: Testimonial[] }>("/testimonials"),
  create: (data: Omit<Testimonial, "id">) => api.post("/testimonials", data),
  update: (id: number, data: Partial<Testimonial>) => api.put(`/testimonials/${id}`, data),
  delete: (id: number) => api.delete(`/testimonials/${id}`),
};

export const adminApi = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; token: string; message: string }>("/admin/login", { email, password }),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<{ success: boolean; url: string }>("/admin/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
import axios from "axios";

const API_URL = typeof window !== "undefined" ? "/api" : "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: { name?: string; image?: string }) =>
    api.patch("/auth/profile", data),
};

export const tutorsApi = {
  getAll: (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get("/tutors", { params }),

  getById: (id: string) => api.get(`/tutors/${id}`),

  updateProfile: (data: {
    bio?: string;
    headline?: string;
    hourlyRate: number;
    experience?: number;
    languages?: string[];
    categoryId: string;
  }) => api.put("/tutors/me/profile", data),

  updateAvailability: (slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>) => {
    const formattedSlots = slots.map(({ dayOfWeek, startTime, endTime }) => ({
      dayOfWeek,
      startTime,
      endTime,
    }));
    return api.put("/tutors/me/availability", { slots: formattedSlots });
  },

  getMySessions: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get("/tutors/me/sessions", { params }),
};

export const bookingsApi = {
 
  create: (data: {
    tutorId: string;
    subject: string;
    notes?: string;
    scheduledAt: string;
    durationMins?: number;
  }) => api.post("/bookings", data),

  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get("/bookings", { params }),

  getById: (id: string) => api.get(`/bookings/${id}`),

  cancel: (id: string, reason?: string) =>
    api.patch(`/bookings/${id}/cancel`, { reason }),

  complete: (id: string) =>
    api.patch(`/bookings/${id}/complete`),
};

export const reviewsApi = {
  create: (data: { bookingId: string; rating: number; comment?: string }) =>
    api.post("/reviews", data),

  getByTutor: (tutorId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/tutor/${tutorId}`, { params }),
};

export const categoriesApi = {
  getAll: () => api.get("/categories"),
};

export const adminApi = {
  getStats: () => api.get("/admin/stats"),

  getUsers: (params?: { role?: string; isBanned?: boolean; search?: string; page?: number; limit?: number }) =>
    api.get("/admin/users", { params }),

  updateUserStatus: (id: string, data: { isBanned: boolean; banReason?: string }) =>
    api.patch(`/admin/users/${id}`, data),

  getAllBookings: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get("/admin/bookings", { params }),

  verifyTutor: (id: string) => api.patch(`/admin/tutors/${id}/verify`),

  createCategory: (data: { name: string; description?: string; icon?: string }) => {
    const slug = data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return api.post("/admin/categories", { ...data, slug });
  },

  updateCategory: (id: string, data: { name?: string; description?: string; icon?: string; isActive?: boolean }) => {
    const payload: Record<string, unknown> = { ...data };
    if (data.name) {
      payload.slug = data.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    return api.patch(`/admin/categories/${id}`, payload);
  },

  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
};
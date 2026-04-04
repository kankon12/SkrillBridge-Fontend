
export type Role = "STUDENT" | "TUTOR" | "ADMIN";
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

// ==================== USER ====================
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: Role;
  isBanned: boolean;
  banReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== CATEGORY ====================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== AVAILABILITY ====================
export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: number; 
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// ==================== TUTOR PROFILE ====================
export interface TutorProfile {
  id: string;
  userId: string;
  user: User;
  bio?: string | null;
  headline?: string | null;
  hourlyRate: number;
  experience: number;
  languages: string[];
  isVerified: boolean;
  isActive: boolean;
  avgRating: number;
  totalReviews: number;
  totalSessions: number;
  categoryId: string;
  category: Category;
  availability: Availability[];
  reviews?: Review[]; 
  createdAt: string;
  updatedAt: string;
}

// ==================== BOOKING ====================
export interface Booking {
  id: string;
  studentId: string;
  student: User;
  tutorId: string;
  tutor: TutorProfile;
  subject: string;
  notes?: string | null;
  scheduledAt: string;
  durationMins: number;
  totalPrice: number;
  status: BookingStatus;
  meetingLink?: string | null;
  cancelReason?: string | null;
  review?: Review | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== REVIEW ====================
export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  student: User;
  tutorId: string;
  tutor: TutorProfile;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}


export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}


export interface AdminStats {
  users: {
    total: number;
    students: number;
    tutors: number;
  };
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  revenue: {
    total: number;
  };
  topTutors: Array<{
    id: string;
    user: { name: string; image?: string | null; email: string };
    category: { name: string };
    totalSessions: number;
    avgRating: number;
  }>;
}
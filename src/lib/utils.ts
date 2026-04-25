// import { type ClassValue, clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// export function formatCurrency(amount: number | string): string {
//   const value = typeof amount === "string" ? parseFloat(amount) : amount;
//   return new Intl.NumberFormat("en-BD", {
//     style: "currency",
//     currency: "BDT",
//     minimumFractionDigits: 0,
//   }).format(value || 0);
// }

// export function formatDate(date: string | Date): string {
//   return new Intl.DateTimeFormat("en-BD", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   }).format(new Date(date));
// }

// export const DAY_NAMES = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// export function getInitials(name: string): string {
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// }

// export function getBookingStatusColor(status: string) {
//   const colors: Record<string, string> = {
//     CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//     COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//     CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
//   };
//   return colors[status] || "bg-gray-100 text-gray-700";
// }

// export function getRatingStars(rating: number): string {
//   return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
// }

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export function getInitials(name: string): string {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function getBookingStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING:   "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getRatingStars(rating: number): string {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}
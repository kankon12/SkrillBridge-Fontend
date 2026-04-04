import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Better Auth frontend client
// baseURL = backend root (NOT /api) — auth routes: /api/auth/*
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  fetchOptions: {
    credentials: "include", // cookies cross-origin
  },
  plugins: [
    // This makes useSession() return role & isBanned from additionalFields
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          defaultValue: "STUDENT",
        },
        isBanned: {
          type: "boolean",
          defaultValue: false,
        },
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

// Type helper — session user with role
export type SessionUser = typeof authClient.$Infer.Session.user & {
  role: "STUDENT" | "TUTOR" | "ADMIN";
  isBanned: boolean;
};

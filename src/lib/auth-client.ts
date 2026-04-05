import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
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

export type SessionUser = typeof authClient.$Infer.Session.user & {
  role: "STUDENT" | "TUTOR" | "ADMIN";
  isBanned: boolean;
};
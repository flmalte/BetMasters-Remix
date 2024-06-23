import { createCookie } from "@remix-run/node";

export const userCookie = createCookie("user", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // Cookie is valid for 7 days
});

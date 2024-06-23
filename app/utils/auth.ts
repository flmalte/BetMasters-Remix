import { createCookie } from "@remix-run/node";

export const authCookie = createCookie("auth", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // Cookie is valid for 7 days
});

export const userCookie = createCookie("user", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // Cookie is valid for 7 days
});

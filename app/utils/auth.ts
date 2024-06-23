import { createCookie, redirect } from "@remix-run/node";

export const authCookie = createCookie("auth", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  /*secrets:[secret],*/
  maxAge: 60 * 60 * 24 * 7, // Cookie is valid for 7 days
});

export async function requireAuthCookie(request: Request) {
  const jwt = await authCookie.parse(request.headers.get("Cookie"));

  if (!jwt) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await authCookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }
  return jwt;
}

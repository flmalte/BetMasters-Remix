import { createCookie, redirect } from "@remix-run/node";

export const userCookie = createCookie("user", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  /*secrets:[secret],*/
  maxAge: 60 * 60 * 24 * 7, // Cookie is valid for 7 days
});

export async function requireUserCookie(request: Request) {
  const user = await userCookie.parse(request.headers.get("Cookie"));

  if (!user) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await userCookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }
  return user;
}

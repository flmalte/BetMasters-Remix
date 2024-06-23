import { authCookie } from "~/utils/auth";
import { redirect } from "@remix-run/node";
import { userCookie } from "~/utils/user";

// Handles user logout by overriding auth and session cookies with empty cookies with maxAge 0s
export async function action() {
  const authCookieHeader = await authCookie.serialize("", {
    maxAge: 0,
  });

  const sessionCookieHeader = await userCookie.serialize("", {
    maxAge: 0,
  });

  return redirect("/login", {
    headers: {
      "Set-Cookie": `${authCookieHeader}, ${sessionCookieHeader}`,
    },
  });
}

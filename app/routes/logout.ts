import { authCookie } from "~/utils/auth";
import { redirect } from "@remix-run/node";

// Handles user logout by overriding auth and session cookies with empty cookies with maxAge 0s
export async function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
}

import { authCookie } from "~/utils/auth";
import { redirect } from "@remix-run/node";

/**
 * Handles user logout by invalidating the authentication cookie.
 * This function processes logout requests by clearing the authentication cookie and redirecting the user to the login page.
 */
export async function action() {
  return redirect("/login", {
    // Deletes authCookie
    headers: {
      "Set-Cookie": await authCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
}

import { createCookie, redirect } from "@remix-run/node";

/**
 * Authentication Cookie Configuration
 *
 * This cookie is used to store authentication information for the user.
 *
 * @see https://remix.run/docs/en/main/utils/cookies#createcookie
 */
export const authCookie = createCookie("auth", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",

  // The cookie will be available for all routes
  path: "/",

  /*secrets:[secret],*/

  // Sets the cookie expiration to 7 days
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
});

/**
 * This function checks if a valid authentication cookie exists.
 * If not, it redirects the user to the login page.
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<any>} The parsed JWT if authentication is successful
 * @throws {Response} Redirects to /login if authentication fails
 */
export async function requireAuthCookie(request: Request) {
  const jwt = await authCookie.parse(request.headers.get("Cookie"));

  // If no valid JWT is found, redirect to login
  if (!jwt) {
    throw redirect("/login", {
      headers: {
        // Clear the existing auth cookie
        "Set-Cookie": await authCookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }
  return jwt;
}

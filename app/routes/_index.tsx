import { redirect } from "@remix-run/node";

/**
 * Redirects to /bet if trying to resolve landing page
 */
export async function loader() {
  throw redirect("/bet");
}

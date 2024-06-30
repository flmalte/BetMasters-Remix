import axios from "axios";
import { backendUrl } from "~/api/betMasters";
import { authCookie, requireAuthCookie } from "~/utils/auth";
import { ActionFunctionArgs, redirect } from "@remix-run/node";

/**
 * Handles user account deletion.
 */
export async function action({ request }: ActionFunctionArgs) {
  const auth = await requireAuthCookie(request);

  /*Tells the backend to delete the account*/
  await axios.delete(backendUrl + "/user/modify/delete", {
    params: {
      email: auth.email,
      jwtToken: auth.jwt,
      uid: auth.uid,
    },
  });

  /*Redirects to /login and deletes authCookie*/
  return redirect("/login", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
}

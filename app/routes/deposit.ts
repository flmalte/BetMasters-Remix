import axios from "axios";
import { backendUrl } from "~/api/betMasters";
import { requireAuthCookie } from "~/utils/auth";
import { ActionFunctionArgs } from "@remix-run/node";

/**
 * Handles user deposit requests.
 *
 * This function is a Remix action  function. It processes POST requests
 * to withdraw funds from a user's account.
 */
export async function action({ request }: ActionFunctionArgs) {
  // Authenticate the user
  const auth = await requireAuthCookie(request);

  // Extract the withdrawal amount from the form data
  const formData = await request.formData();
  const amount = formData.get("amount");

  // Send deposit request to Backend
  await axios.post(
    backendUrl + "/transaction/deposit",
    {},
    {
      params: {
        jwtToken: auth.jwt,
        email: auth.email,
        userId: auth.uid,
        amount: amount,
      },
    },
  );

  return null;
}

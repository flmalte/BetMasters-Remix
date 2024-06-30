import axios from "axios";
import { backendUrl } from "~/api/betMasters";
import { requireAuthCookie } from "~/utils/auth";
import { ActionFunctionArgs } from "@remix-run/node";

/**
 * Handles user withdrawal requests.
 *
 * This function is a Remix action  function. It processes POST requests
 * to withdraw funds from a user's account.
 *
 * @param {Request} - The request object containing form data and headers.
 *
 * @returns {Promise<null>} Returns null on successful withdrawal.
 */
export async function action({ request }: ActionFunctionArgs) {
  // Authenticate the user
  const auth = await requireAuthCookie(request);

  // Extract the withdrawal amount from the form data
  const formData = await request.formData();
  const amount = formData.get("amount");

  // Send withdrawal request to Backend
  await axios.post(
    backendUrl + "/transaction/withdraw",
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

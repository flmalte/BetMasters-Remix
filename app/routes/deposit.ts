import axios from "axios";
import { backendUrl } from "~/api/betMasters";
import { requireAuthCookie } from "~/utils/auth";
import { ActionFunctionArgs } from "@remix-run/node";

// Handles user deposits
export async function action({ request }: ActionFunctionArgs) {
  const auth = await requireAuthCookie(request);
  const formData = await request.formData();
  const amount = formData.get("amount");

  await axios.post(
    backendUrl + "/deposit",
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

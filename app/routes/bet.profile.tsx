import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json } from "@remix-run/react";
import { requireUserCookie } from "~/utils/user";
import { requireAuthCookie } from "~/utils/auth";
import axios from "axios";
import { backendUrl } from "~/api/betMasters";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Profile" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = await requireAuthCookie(request);

  // Gets user account balance
  /*const balance = await axios.get(backendUrl + "/getBalance", {
    params: {
      jwtToken: jwt,
      email: user.email,
      userId: user.uid,
    },
  });*/

  return json({ auth });
}

export default function Profile() {
  const { auth } = useLoaderData<typeof loader>(); // receives data returned by loader

  return (
    <div className="max-w-3xl">
      <div className="my-4 space-y-4">
        <p>Email: {auth ? auth.email : "No user found"}</p>
        <p>ID: {auth ? auth.uid : "No user found"}</p>

        {/*<p>{jwt ? jwt : "No jwt found"}</p>*/}

        {/*<p>Balance: {balance}</p>*/}
      </div>
    </div>
  );
}

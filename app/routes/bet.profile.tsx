import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json, useFetcher } from "@remix-run/react";
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
  const response = await axios.get(backendUrl + "/getBalance", {
    params: {
      jwtToken: auth.jwt,
      email: auth.email,
      userId: auth.uid,
    },
  });

  // Extracting the balance from the response data
  const balance = response.data.balance;

  return json({ auth, balance });
}

export default function Profile() {
  const { auth, balance } = useLoaderData<typeof loader>(); // receives data returned by loader
  const fetcher = useFetcher();

  return (
    <div className="max-w-3xl overflow-x-hidden">
      <div className="my-4 space-y-4">
        <p>Email: {auth ? auth.email : "No user found"}</p>
        <p>ID: {auth ? auth.uid : "No user found"}</p>

        <p className="text-wrap">{auth ? auth.jwt : "No jwt found"}</p>
        <p>Balance: {balance}</p>

        <fetcher.Form action="/deposit" method="post" className="">
          <div className="join">
            <input
              className="input join-item input-bordered"
              type="number"
              name="amount"
            />
            <button className="btn join-item">Deposit</button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}

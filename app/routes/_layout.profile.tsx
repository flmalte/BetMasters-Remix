import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json } from "@remix-run/react";

import { userCookie } from "~/utils/user";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Profile" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const userJson = await userCookie.parse(cookieHeader);
  let user = null;

  user = JSON.parse(userJson);

  return json({ user });
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>(); // receives data returned by loader

  return (
    <div>
      <div className="my-4 space-y-4">
        {user ? user.email : "No user found"}
      </div>
    </div>
  );
}

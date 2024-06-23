import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json } from "@remix-run/react";
import { requireUserCookie } from "~/utils/user";
import { requireAuthCookie } from "~/utils/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Profile" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const jwt = await requireAuthCookie(request);
  const user = await requireUserCookie(request);

  return json({ user, jwt });
}

export default function Profile() {
  const { user, jwt } = useLoaderData<typeof loader>(); // receives data returned by loader

  return (
    <div className="max-w-3xl">
      <div className="my-4 space-y-4">
        <p>{user ? user.email : "No user found"}</p>
        <p>{jwt ? jwt : "No jwt found"}</p>
      </div>
    </div>
  );
}

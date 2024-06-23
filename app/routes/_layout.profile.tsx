import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

/**
 * loader fetches the data on the server from backend api
 * @param params takes leagueId from url as param
 */
export async function loader({ params }: LoaderFunctionArgs) {
  return json({});
}

export default function _index() {
  const data = useLoaderData<typeof loader>(); // receives data returned by loader

  return (
    <div>
      <div className="my-4 space-y-4"></div>
    </div>
  );
}

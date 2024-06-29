import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json, Link } from "@remix-run/react";
import axios from "axios";
import MatchComponent from "~/components/MatchComponent";
import { backendUrl } from "~/api/betMasters";

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
  const response = await axios.get(
    backendUrl + "/football/v2/fixtures/by-league-and-season",
    {
      params: {
        leagueID: params.leagueId,
        seasonID: 2024,
      },
    },
  );

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter and sort the data based on fixture_date
  const filteredAndSortedData = response.data
    .filter((fixture: { fixture_date: string }) => {
      const fixtureDate = new Date(fixture.fixture_date);
      return fixtureDate >= today;
    })
    .sort(
      (a: { fixture_date: string }, b: { fixture_date: string }) =>
        new Date(a.fixture_date).getTime() - new Date(b.fixture_date).getTime(),
    );

  return json(filteredAndSortedData, {
    headers: {
      "Cache-Control":
        "public, max-age=300, s-max-age=1, stale-while-revalidate=604800",
    }, // Adds Incremental Static Regeneration, needs to be changed later
  });
}

export default function _index() {
  const data = useLoaderData<typeof loader>(); // receives data returned by loader

  return (
    <div className="my-4 space-y-4">
      {data.map((data) => (
        <Link
          to={`/bet/match/${data.fixture_id}`}
          className=""
          key={data.fixture_id}
        >
          <MatchComponent data={data} />
        </Link>
      ))}
    </div>
  );
}

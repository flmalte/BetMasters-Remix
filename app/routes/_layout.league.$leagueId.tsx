import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json } from "@remix-run/react";
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
  const response = await axios.get(backendUrl + "/v1/fixturesWithOdds", {
    params: {
      bookmaker: 27,
      future_games_only: true,
      games_with_bets_only: true,
      league: params.leagueId,
      season: 2024,
    },
  });

  // Sorts the data based on fixture_date
  const sortedData = response.data.sort(
    (a: { fixture_date: string }, b: { fixture_date: string }) =>
      new Date(a.fixture_date).getTime() - new Date(b.fixture_date).getTime(),
  );

  return json(sortedData, {
    headers: {
      "Cache-Control":
        "public, max-age=300, s-max-age=1, stale-while-revalidate=604800",
    }, // Adds Incremental Static Regeneration, needs to be changed later
  });
}

export default function _index() {
  const data = useLoaderData<typeof loader>(); // receives data returned by loader

  return (
    <div>
      {/*<p>League</p>*/}
      <div className="my-4 space-y-4">
        {data.map((data) => (
          <MatchComponent key={data.fixture_id} data={data} />
        ))}
      </div>
    </div>
  );
}

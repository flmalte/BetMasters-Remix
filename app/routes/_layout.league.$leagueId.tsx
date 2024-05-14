import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json } from "@remix-run/react";
import axios from "axios";
import MatchComponent from "~/components/MatchComponent";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const response = await axios.get(
      `https://betmasters.azurewebsites.net/fixturesWithOdds`,

      {
        params: {
          bookmaker: 27,
          future_games_only: true,
          games_with_bets_only: true,
          league: params.leagueId,
          season: 2023,
        },
      },
    );
    /*console.log(response.data);*/
    return json(response.data, {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-max-age=1, stale-while-revalidate=604800",
      }, // Adds Incremental Static Regeneration, needs to be changed later
    });
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default function _index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {/*<p>League</p>*/}
      <div className="mt-4 space-y-4">
        {data.map((data) => (
          <MatchComponent key={data.fixture_id} data={data} />
        ))}
      </div>
    </div>
  );
}

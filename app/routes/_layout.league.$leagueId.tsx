import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios from "axios";

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
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default function _index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>League</p>
      <div className="space-y-2">
        {data.map((data: MatchData) => (
          <MatchComponent key={data.fixture_id} data={data} />
        ))}
      </div>
    </div>
  );
}

interface MatchData {
  fixture_id: number;
  league_id: number;
  fixture_date: string;
  home_team: string;
  away_team: string;
  home_team_icon: string;
  away_team_icon: string;
  home_goals: number;
  away_goals: number;
  home_penalty_goals: number;
  away_penalty_goals: number;
  status_long: string;
  status_short: string;
  status_elapsed: string;
  odds: string; // needs to be changed, can be string or obj
}

interface MatchComponentProps {
  data: MatchData;
}

/**
 * Renders the match, takes the match data as prop
 * @param data takes the match data as input
 * @constructor
 */
function MatchComponent({ data }: MatchComponentProps) {
  return (
    <div className="flex flex-row space-x-12">
      <div>
        <div className="flex flex-row space-x-2">
          <img
            alt={`${data.home_team} icon`}
            className="h-8 self-center"
            src={data.home_team_icon}
          />
          <p>{data.home_team}</p>
        </div>
      </div>

      <div className="flex flex-row">
        <p>
          {data.home_goals} : {data.away_goals}
        </p>
      </div>

      <div>
        <div className="flex flex-row space-x-2">
          <img
            alt={`${data.away_team} icon`}
            className="h-8 self-center"
            src={data.away_team_icon}
          />
          <p>{data.away_team}</p>
        </div>
      </div>
    </div>
  );
}

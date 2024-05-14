interface MatchData {
  fixture_id: string;
  league_id: string;
  fixture_date: string;
  home_team: string;
  away_team: string;
  home_team_icon: string;
  away_team_icon: string;
  home_goals: number;
  away_goals: number;
  home_penalty_goals?: number;
  away_penalty_goals?: number;
  status_long: string;
  status_short: string;
  status_elapsed: string;
  odds: {
    type: string;
    odds: {
      [key: string]: number;
    };
  }[];
}

interface MatchComponentProps {
  data: MatchData;
}

/**
 * Renders the match, takes the match data as prop
 * @param data takes the match data as input
 * @constructor
 */
export default function MatchComponent({ data }: MatchComponentProps) {
  // Extract the "HomeDrawAway" odds
  const homeDrawAwayOdds = data.odds.find(
    (oddsItem) => oddsItem.type === "HomeDrawAway",
  )?.odds;

  return (
    <div className="mx-4 my-2 flex flex-col rounded-lg bg-neutral p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {new Date(data.fixture_date).toLocaleString()}
        </p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            alt={`${data.home_team} icon`}
            className="h-10 w-10"
            src={data.home_team_icon}
          />
          <p className="text-lg font-medium">{data.home_team}</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">
            {data.home_goals} : {data.away_goals}
          </p>
          {data.home_penalty_goals !== undefined &&
            data.away_penalty_goals !== undefined && (
              <p className="text-sm text-gray-400">
                (Pens: {data.home_penalty_goals} - {data.away_penalty_goals})
              </p>
            )}
        </div>

        <div className="flex items-center space-x-2">
          <img
            alt={`${data.away_team} icon`}
            className="h-10 w-10"
            src={data.away_team_icon}
          />
          <p className="text-lg font-medium">{data.away_team}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {data.status_long} ({data.status_short}) - {data.status_elapsed}
        </p>
        {homeDrawAwayOdds && (
          <div className="text-sm text-gray-300">
            <p>Odds:</p>
            <p>Home: {homeDrawAwayOdds.home}</p>
            <p>Draw: {homeDrawAwayOdds.draw}</p>
            <p>Away: {homeDrawAwayOdds.away}</p>
          </div>
        )}
      </div>
    </div>
  );
}

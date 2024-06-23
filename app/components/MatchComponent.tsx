type MatchData = {
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
};

type MatchComponentProps = {
  data: MatchData;
};

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

  const isStarted = data.status_short !== "NS";

  return (
    <div className="mx-4 my-2 flex flex-col rounded-lg bg-neutral p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-center text-sm text-gray-400">
          <b>{formatDate(data.fixture_date)}</b>
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 items-center gap-4">
        <div className="flex items-center space-x-2">
          <img
            alt={`${data.home_team} icon`}
            className="h-10 w-10"
            src={data.home_team_icon}
          />
          <p className="text-lg font-medium">{data.home_team}</p>
        </div>

        <div className="flex flex-col items-center">
          <p
            className={`text-2xl font-bold ${isStarted ? "text-green-500" : ""}`}
          >
            {isStarted ? data.home_goals : "-"} :{" "}
            {isStarted ? data.away_goals : "-"}
          </p>
          {data.home_penalty_goals !== undefined &&
            data.away_penalty_goals !== undefined && (
              <p className="text-sm text-gray-400">
                (Pens: {data.home_penalty_goals} - {data.away_penalty_goals})
              </p>
            )}
        </div>

        <div className="flex items-center justify-end space-x-2">
          <p className="text-lg font-medium">{data.away_team}</p>
          <img
            alt={`${data.away_team} icon`}
            className="h-10 w-10"
            src={data.away_team_icon}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <StatusDisplay data={data} />
        {homeDrawAwayOdds && (
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <b>Odds:</b>
            <p>Home: {homeDrawAwayOdds.home}</p>
            <p>Draw: {homeDrawAwayOdds.draw}</p>
            <p>Away: {homeDrawAwayOdds.away}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface Data {
  status_long: string;
  status_short: string;
  status_elapsed: string;
}

interface Props {
  data: Data;
}

function StatusDisplay({ data }: Props) {
  const isStarted = data.status_short !== "NS";

  return (
    <p className={`text-sm ${isStarted ? "text-green-500" : "text-gray-400"}`}>
      {data.status_long} ({data.status_short})
      {isStarted && ` - ${data.status_elapsed}`}
    </p>
  );
}

/**
 * Function takes match date and returns a formated string
 * @param date
 */
function formatDate(date: string | Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const fixtureDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isToday = fixtureDate.toDateString() === today.toDateString();
  const isTomorrow = fixtureDate.toDateString() === tomorrow.toDateString();

  if (isToday) {
    return `Today at ${fixtureDate.toLocaleTimeString("en-DE", { hour: "numeric", minute: "numeric" })}`;
  } else if (isTomorrow) {
    return `Tomorrow at ${fixtureDate.toLocaleTimeString("en-DE", { hour: "numeric", minute: "numeric" })}`;
  } else {
    return fixtureDate.toLocaleString("en-DE", options);
  }
}

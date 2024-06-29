import { Link } from "@remix-run/react";

type MatchComponentProps = {
  fixture_id: number;
  league: string;
  minutes_elapsed: number;
  away_penalties: number;
  away_goals: number;
  home_penalties: number;
  away_team: string;
  home_team_icon: string;
  fixture_date: string;
  home_goals: number;
  away_team_icon: string;
  betting_allowed: string;
  home_team: string;
  league_id: number;
  status: string;
};

/**
 * Renders the match, takes the match data as prop
 * @param data takes the match data as input
 * @constructor
 */
export default function MatchComponent({
  data,
}: {
  data: MatchComponentProps;
}) {
  const isStarted = data.minutes_elapsed !== -1;

  return (
    <Link
      to={`/bet/match/${data.fixture_id}`}
      className="mx-4 my-2 flex flex-col rounded-lg bg-neutral p-4 text-white"
    >
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
          {data.home_penalties !== -1 && data.away_penalties !== -1 && (
            <p className="text-sm text-gray-400">
              (Pens: {data.home_penalties} - {data.away_penalties})
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
      </div>
    </Link>
  );
}

function StatusDisplay({ data }: { data: MatchComponentProps }) {
  const isStarted = data.minutes_elapsed !== -1;

  return (
    <p className={`text-sm ${isStarted ? "text-green-500" : "text-gray-400"}`}>
      {isStarted && `${data.minutes_elapsed}`}
    </p>
  );
}

/**
 * Function takes match date and returns a formatted string
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

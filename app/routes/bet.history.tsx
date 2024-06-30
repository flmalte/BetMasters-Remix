import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { useLoaderData, json, useFetcher } from "@remix-run/react";
import { requireAuthCookie } from "~/utils/auth";
import axios from "axios";
import { backendUrl } from "~/api/betMasters";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Bet History" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Gets auth data from authCookie
  const auth = await requireAuthCookie(request);

  // Gets user account balance from the backend
  const historyResponse = await axios.get(backendUrl + "/betting/v2/get-bets", {
    params: {
      jwtToken: auth.jwt,
      email: auth.email,
      uid: auth.uid,
    },
  });

  const history = historyResponse.data;

  return json({ history });
}

/**
 * Allows the user to claim their bets.
 *
 * This function is a Remix action function.
 */
export async function action({ request }: ActionFunctionArgs) {
  // Authenticate the user
  const auth = await requireAuthCookie(request);

  // Send deposit request to Backend
  await axios.put(
    backendUrl + "/betting/v2/claim",
    {},
    {
      params: {
        jwtToken: auth.jwt,
        email: auth.email,
        uid: auth.uid,
      },
    },
  );

  return null;
}

export default function BetHistory() {
  // Receives the history returned from the loader
  const { history } = useLoaderData<typeof loader>();

  /**
   * Gets the text color tailwind class based on the status, returns it as string.
   * @param status Receives the status as parameter.
   */
  function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "won":
        return "text-success";
      case "lost":
        return "text-error";
      case "cancelled":
        return "text-warning";
      default:
        return "text-info";
    }
  }

  return (
    <div className="mx-auto max-w-5xl overflow-x-hidden">
      <div className="my-4 space-y-4">
        <h2 className="mb-4 text-2xl font-bold">Bet History</h2>
        <form method="post">
          <button className="btn btn-primary">Claim Bets</button>
        </form>
        <div className="overflow-x-auto">
          {/*Renders a table if a bet history exists*/}
          {Array.isArray(history) && history.length > 0 ? (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  {/*Column titles*/}
                  <th></th>
                  <th>Fixture ID</th>
                  <th>Bet Type</th>
                  <th>Amount</th>
                  <th>Multiplier</th>
                  <th>Selected</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {/*Maps over the history object*/}
                {history.map((bet, index) => (
                  <tr key={bet.bet_id}>
                    <th>{index + 1}</th>
                    <td>{bet.fixture_id}</td>
                    <td>{bet.bet_type}</td>
                    <td>{bet.bet_amount.toFixed(2)}</td>
                    <td>{bet.win_multiplier}</td>
                    <td>{bet.selected_bet}</td>
                    <td className={getStatusColor(bet.status)}>{bet.status}</td>
                    <td>{bet.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /*Renders this text if no bet history exists*/
            <p>No bet history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

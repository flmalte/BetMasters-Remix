import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
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
  const auth = await requireAuthCookie(request);

  // Gets user account balance
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

export default function BetHistory() {
  const { history } = useLoaderData<typeof loader>();

  const getStatusColor = (status: string) => {
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
  };

  return (
    <div className="mx-auto max-w-5xl overflow-x-hidden">
      <div className="my-4 space-y-4">
        <h2 className="mb-4 text-2xl font-bold">Bet History</h2>
        <div className="overflow-x-auto">
          {Array.isArray(history) && history.length > 0 ? (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
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
            <p>No bet history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

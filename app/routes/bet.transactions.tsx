import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json, useFetcher } from "@remix-run/react";
import { requireAuthCookie } from "~/utils/auth";
import axios from "axios";
import { backendUrl } from "~/api/betMasters";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Transactions" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = await requireAuthCookie(request);

  // Gets user account balance
  const balanceResponse = await axios.get(
    backendUrl + "/transaction/get-balance",
    {
      params: {
        jwtToken: auth.jwt,
        email: auth.email,
        userId: auth.uid,
      },
    },
  );

  // Gets user account balance
  const historyResponse = await axios.get(backendUrl + "/transaction/history", {
    params: {
      jwtToken: auth.jwt,
      email: auth.email,
      userId: auth.uid,
    },
  });

  // Extracting the balance from the response data
  const balance = balanceResponse.data.balance;
  const history = historyResponse.data;

  return json({ balance, history });
}

export default function Profile() {
  const { balance, history } = useLoaderData<typeof loader>(); // receives data returned by loader
  const fetcher = useFetcher();

  // Function to determine transaction type text
  const getTransactionTypeText = (type: number) => {
    switch (type) {
      case 1:
        return "Deposit";
      case 2:
        return "Withdrawal";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="max-w-3xl overflow-x-hidden">
      <div className="my-4 space-y-4">
        <p>Balance: {balance}</p>

        <fetcher.Form action="/deposit" method="post" className="">
          <div className="join px-1">
            <input
              className="input join-item input-bordered"
              type="number"
              name="amount"
            />
            <button className="btn join-item">Deposit</button>
          </div>
        </fetcher.Form>

        <fetcher.Form action="/withdraw" method="post" className="">
          <div className="join px-1">
            <input
              className="input join-item input-bordered"
              type="number"
              name="amount"
            />
            <button className="btn join-item">Withdraw</button>
          </div>
        </fetcher.Form>

        {/* Transaction History Section */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">Transaction History</h2>
          <div className="overflow-x-auto">
            {Array.isArray(history) && history.length > 0 ? (
              <table className="table table-zebra">
                {/* head */}
                <thead>
                  <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((transaction: any, index: number) => (
                    <tr key={transaction.transaction_id}>
                      <th>{index + 1}</th>
                      <td>{transaction.transaction_id}</td>
                      <td
                        className={
                          transaction.amount < 0 ? "text-error" : "text-success"
                        }
                      >
                        {transaction.amount.toFixed(2)}
                      </td>
                      <td>
                        {getTransactionTypeText(transaction.transaction_type)}
                      </td>
                      <td>{transaction.transaction_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transaction history available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

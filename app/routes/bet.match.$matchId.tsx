import {
  LoaderFunctionArgs,
  MetaFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import {
  useLoaderData,
  json,
  useNavigate,
  Form,
  useActionData,
} from "@remix-run/react";
import axios from "axios";
import MatchComponent from "~/components/MatchComponent";
import { backendUrl } from "~/api/betMasters";
import { IoIosArrowBack } from "react-icons/io";
import { requireAuthCookie } from "~/utils/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

/**
 * loader fetches the data on the server from backend api
 * @param params takes match from url as param
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const response = await axios.get(backendUrl + "/football/v2/fixtures/by-id", {
    params: {
      fixtureID: params.matchId,
    },
  });

  const oddsResponse = await axios.get(
    backendUrl + "/football/v2/odds/for-fixture",
    {
      params: {
        fixtureID: params.matchId,
        oddID: 1,
      },
    },
  );

  const data = response.data;
  const odds = oddsResponse.data;

  return json({ data, odds });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const auth = await requireAuthCookie(request);

  const formData = await request.formData();
  const amount = formData.get("amount");
  const selectedBet = formData.get("selectedBet");

  try {
    const response = await axios.post(
      backendUrl + "/betting/v2/place",
      {},
      {
        params: {
          uid: auth.uid,
          email: auth.email,
          jwtToken: auth.jwt,
          amount: amount,
          type: "WIN",
          fixtureId: params.matchId,
          prediction: selectedBet,
        },
      },
    );
    return json({
      success: true,
      message: "Bet placed successfully!",
      data: response.data,
    });
  } catch (error) {
    return json({ success: false, message: error.message });
  }
}

export default function _index() {
  const { data, odds } = useLoaderData<typeof loader>(); // receives data returned by loader
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  return (
    <div className="my-4 space-y-4">
      <button
        className="btn btn-circle ml-4"
        onClick={() => {
          navigate(-1);
        }}
      >
        <IoIosArrowBack className="size-6" />
      </button>
      <MatchComponent key={data.fixture_id} data={data} />
      <div className="mx-4 rounded-lg bg-neutral p-4 text-white">
        <h2 className="mb-2 text-lg font-bold">Odds</h2>
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-sm font-semibold">Home</p>
            <p className="text-xl">{odds.Home}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">Draw</p>
            <p className="text-xl">{odds.Draw}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">Away</p>
            <p className="text-xl">{odds.Away}</p>
          </div>
        </div>
      </div>
      <div className="mx-4 rounded-lg bg-neutral p-4 text-white">
        <h2 className="mb-2 text-lg font-bold">Place a Bet</h2>
        <Form method="post">
          <input type="hidden" name="fixtureID" value={data.fixture_id} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm sm:text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Selected Bet
            </label>
            <select
              name="selectedBet"
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm sm:text-sm"
              required
            >
              <option value="Home">Home</option>
              <option value="Draw">Draw</option>
              <option value="Away">Away</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Place Bet
          </button>
        </Form>
        {actionData && (
          <div
            className={`mt-4 p-4 ${actionData.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} rounded-md`}
          >
            {actionData.message}
          </div>
        )}
      </div>
    </div>
  );
}

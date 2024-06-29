import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json, useNavigate } from "@remix-run/react";
import axios from "axios";
import MatchComponent from "~/components/MatchComponent";
import { backendUrl } from "~/api/betMasters";
import { IoIosArrowBack } from "react-icons/io";

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

  // Sorts the data based on fixture_date
  const data = response.data;

  return json(data);
}

export default function _index() {
  const data = useLoaderData<typeof loader>(); // receives data returned by loader
  const navigate = useNavigate();

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
    </div>
  );
}

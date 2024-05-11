import { MetaFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";
import axios from "axios";
import { useLoaderData } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

export async function loader() {
  try {
    const response = await axios.get(
      "https://betmasters.azurewebsites.net/leagues/supported",
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="mx-auto p-5 text-green-600">Leages</h1>
      <ul>
        {data.map((data) => (
          <li key={data.name}>
            <NavLink
              to={`/league/${data.id}`}
              prefetch="intent"
              className={({ isActive, isPending }) =>
                isPending
                  ? "block rounded border-gray-700 px-3 py-2 text-black hover:bg-gray-700 hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-500"
                  : isActive
                    ? "block rounded bg-blue-700 px-3 py-2 text-black md:bg-transparent md:p-0 md:text-blue-500"
                    : "block rounded border-gray-700 px-3 py-2 text-black hover:bg-gray-700 hover:text-white md:p-0 md:hover:bg-transparent md:hover:text-blue-500"
              }
            >
              {data.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

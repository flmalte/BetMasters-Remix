import { MetaFunction } from "@remix-run/node";
import { Link, NavLink, Outlet } from "@remix-run/react";
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
    <div
      className="flex flex-row"
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
    >
      <div className="bg-base-200 h-screen w-64">
        <Link to="/" className="mx-auto my-8 p-5 text-green-600">
          Leagues
        </Link>
        <ul className="menu">
          {data.map((data) => (
            <li key={data.name}>
              <NavLink
                to={`/league/${data.id}`}
                prefetch="intent"
                className={({ isActive, isPending }) =>
                  isPending ? "" : isActive ? "active" : ""
                }
              >
                {data.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}

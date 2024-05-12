import { MetaFunction } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import axios from "axios";

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
      <div className="menu h-screen w-64 bg-base-200">
        <Link to="/" className="p-5 text-xl text-green-600">
          Leagues
        </Link>
        <ul className="">
          {data.map((data) => (
            <li key={data.name}>
              <NavLink
                to={`/league/${data.id}`}
                className={({ isActive, isPending }) =>
                  isPending ? "" : isActive ? "active" : ""
                }
              >
                <img className="h-4" src={data.country_flag} />
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

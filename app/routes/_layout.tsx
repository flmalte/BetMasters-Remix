import { MetaFunction } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData, json } from "@remix-run/react";
import axios from "axios";
import LogoComponent from "~/components/LogoComponent";
import { backendUrl } from "~/api/betMasters";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

/**
 * loader fetches the data on the server from backend api
 */
export async function loader() {
  try {
    const response = await axios.get(backendUrl + "/leagues/supported");
    /*console.log(response.data);*/
    return json(response.data, {
      headers: {
        "Cache-Control":
          "public, max-age=300, s-max-age=1, stale-while-revalidate=604800",
      }, // Adds Incremental Static Regeneration
    });
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default function _layout() {
  const data = useLoaderData<typeof loader>();

  return (
    <div
      className="flex flex-row"
      style={{ fontFamily: "pt-sans, sans-serif", lineHeight: "1.8" }}
    >
      <div className="menu sticky top-0 hidden h-screen w-64 overflow-y-scroll bg-base-100 md:block">
        <Link to="/" className="my-2" prefetch="intent">
          <LogoComponent />
        </Link>

        <ul className="space-y-2">
          {data.map((data) => (
            <li key={data.name}>
              <NavLink
                to={`/league/${data.id}`}
                className={({ isActive, isPending }) =>
                  isPending ? "" : isActive ? "active" : ""
                }
              >
                <img
                  alt={`${data.country} flag`}
                  className="h-4"
                  src={data.country_flag}
                />
                {data.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full">
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <div className="navbar sticky top-0 w-full bg-base-100">
      <div className="flex-1"></div>
      <div className="flex-none gap-2">
        {/*<div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>*/}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="avatar btn btn-circle btn-ghost"
          >
            {/*<div className="w-10 rounded-full">
              <img
                alt="Profile picture"
                src="https://thispersondoesnotexist.com/"
              />
            </div>*/}
            <div className="avatar placeholder">
              <div className="w-10 rounded-full bg-neutral text-neutral-content">
                <span>SY</span>
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 drop-shadow-lg"
          >
            <li>
              <Link to="/">Profile</Link>
            </li>
            <li>
              <Link to="/">Settings</Link>
            </li>
            <li>
              <Link to="/">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

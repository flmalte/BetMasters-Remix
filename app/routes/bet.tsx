import { Link, NavLink, Outlet, useLoaderData, json } from "@remix-run/react";
import axios from "axios";
import LogoComponent from "~/components/LogoComponent";
import { backendUrl } from "~/api/betMasters";
import { requireAuthCookie } from "~/utils/auth";
import { LoaderFunctionArgs } from "@remix-run/node";

/**
 * Loader function to fetch data from the backend API.
 * @returns {Promise<Response>} A JSON response containing leagues and user balance.
 * @throws {Response} Redirects to login page if user is not authenticated.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  /*makes everything inside /bet/ a protected route, if not logged in it redirects to the login page*/
  const auth = await requireAuthCookie(request);

  const leaugueResponse = await axios.get(backendUrl + "/leagues/supported");
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

  const leagues = leaugueResponse.data;
  const balance = balanceResponse.data.balance;

  return json({ leagues, balance });
}

/**
 * Renders a sidebar with league navigation and the main content area.
 */
export default function Bet() {
  const { leagues, balance } = useLoaderData<typeof loader>();

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
          {/*Maps over the leagues object*/}
          {leagues.map((data) => (
            <li key={data.name}>
              <NavLink
                to={`/bet/league/${data.id}`}
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
        <NavBar balance={balance} />
        <Outlet />
      </div>
    </div>
  );
}

type NavBarProps = {
  balance: number;
};

/**
 * Renders the NavBar including menu and balance.
 * @param balance Takes the user account balance as parameter.
 */
function NavBar({ balance }: NavBarProps) {
  return (
    <div className="navbar sticky top-0 w-full bg-base-100">
      <div className="flex-1"></div>
      <div className="flex-none gap-2">
        <span className="font-bold text-success">{balance} €</span>
        {/* User dropdown menu */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="avatar btn btn-circle btn-ghost"
          >
            <div className="avatar placeholder">
              <div className="w-10 rounded-full bg-neutral text-neutral-content">
                <span>U</span>
              </div>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 drop-shadow-lg"
          >
            {/*Dropdown menu items*/}
            <li>
              <Link to="/bet/profile">Account</Link>
            </li>
            <li>
              <Link to="/bet/transactions">Transactions</Link>
            </li>
            <li>
              <Link to="/bet/history">Bet History</Link>
            </li>

            <form method="post" action="/logout">
              <li>
                <button>Logout</button>
              </li>
            </form>
          </ul>
        </div>
      </div>
    </div>
  );
}

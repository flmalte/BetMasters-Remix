import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, Link } from "@remix-run/react";
import axios from "axios";
import { backendUrl } from "~/api/betMasters";
import { authCookie } from "~/utils/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Login" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

/**
 * Action function to handle form submission
 * @param request
 */
export async function action({ request }: ActionFunctionArgs) {
  // Extract data from request
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await axios.post(
    backendUrl + "/user/login",
    {},
    {
      params: {
        email,
        password,
      },
    },
  );

  if (response.status === 200) {
    const auth = {
      uid: response.data.uid,
      email: response.data.email, // Add the email to the user object
      jwt: response.data.jwtToken,
    };

    // Redirects to /bet and saves auth information in authCookie
    return redirect("/bet", {
      headers: {
        "Set-Cookie": await authCookie.serialize(auth),
      },
    });
  } else {
    return json({ errors: { email: "Invalid email or password" } }, 400);
  }
}

export default function Login() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Welcome to BetMasters, the ultimate sports betting experience. Place
            your bets, check live scores, and manage your account all in one
            place. Join us and be part of the excitement!
          </p>
        </div>
        <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
          <Form action="/login" method="post" className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered"
                required
              />
              <label className="label">
                <Link to="/signup" className="link-hover link label-text-alt">
                  Create a new account?
                </Link>
              </label>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">Login</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

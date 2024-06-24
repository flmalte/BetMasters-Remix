import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form, json, Link, useActionData } from "@remix-run/react";
import axios from "axios";
import { backendUrl } from "~/api/betMasters";
import { authCookie } from "~/utils/auth";
import { userCookie } from "~/utils/user";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Login" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

// Action function to handle form submission
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await axios.post(
    backendUrl + "/login",
    {},
    {
      params: {
        email,
        password,
      },
    },
  );

  if (response.status === 200) {
    const jwt = response.data.jwtToken;
    const user = {
      uid: response.data.uid,
      email: response.data.email, // Add the email to the user object
    };

    // Serialize cookies
    const authCookieHeader = await authCookie.serialize(jwt);
    const userCookieHeader = await userCookie.serialize(user);

    return redirect("/bet", {
      headers: {
        "Set-Cookie": [authCookieHeader, userCookieHeader].join(", "),
      },
    });
  } else {
    return json({ errors: { email: "Invalid email or password" } }, 400);
  }
}

export default function Login() {
  let actionData = useActionData<typeof action>();

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

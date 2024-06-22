import { MetaFunction, redirect, ActionFunctionArgs } from "@remix-run/node";
import { json, Form } from "@remix-run/react";
import { backendUrl } from "~/api/betMasters";
import axios from "axios";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Register" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

// Action function to handle form submission
export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const dateOfBirth = formData.get("dateOfBirth");

    // Construct the query parameters for the URL
    const params = new URLSearchParams({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      dob: dateOfBirth,
    }).toString();

    const response = await axios.post(
      `${backendUrl}/register?${params}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200) {
      return redirect("/login");
    }

    return json({ error: "Registration failed" }, { status: response.status });
  } catch (error) {
    return json(
      { error: "Registration failed" },
      { status: error.response ? error.response.status : 500 },
    );
  }
}

export default function Register() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
          <Form action="/register" method="post" className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className="input input-bordered"
                required
              />
            </div>
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
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary">Register</button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
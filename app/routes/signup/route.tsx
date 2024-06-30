import { MetaFunction, redirect, ActionFunctionArgs } from "@remix-run/node";
import { json, Form, Link } from "@remix-run/react";
import { backendUrl } from "~/api/betMasters";
import axios from "axios";
import { useEffect, useState } from "react";
import { calculateAge } from "~/utils/calculateAge";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Register" },
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
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const dateOfBirth = formData.get("dateOfBirth");

  const response = await axios.post(
    backendUrl + "/user/register",
    {},
    {
      params: {
        dob: dateOfBirth,
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      },
    },
  );

  if (response.status === 200) {
    return redirect("/login");
  }
  if (response.status === 500) {
    console.error("Response: " + response.status);
  }

  return json({ error: "Registration failed" }, { status: response.status });
}

export default function Signup() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [dateOfBirthError, setDateOfBirthError] = useState<string>("");

  /**
   * Validates an email address.
   * @param {string} email - The email address to validate.
   * @returns {string} An error message if invalid, or an empty string if valid.
   */
  function validateEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email must be a valid email address.";
    }
    return "";
  }

  /**
   * Validates a password.
   * @param {string} pwd - The password to validate.
   * @returns {string} An error message if invalid, or an empty string if valid.
   */
  function validatePassword(pwd: string): string {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\\da-zA-Z]).{8,50}$/;
    if (!passwordRegex.test(pwd)) {
      return "Password must be 8-50 characters long, contain at least one lowercase letter, one uppercase letter, one symbol, and one digit.";
    }
    return "";
  }

  /**
   * Validates the user's age based on their date of birth.
   * @param {string} dob - The date of birth to validate.
   * @returns {string} An error message if underage, or an empty string if valid.
   */
  function validateAge(dob: string): string {
    const age = calculateAge(dob);

    if (age < 18) {
      return "You must be at least 18 years old.";
    }

    return "";
  }

  // useEffect hooks for validation, reruns if variable changes
  useEffect(() => {
    if (email) setEmailError(validateEmail(email));
  }, [email]);

  useEffect(() => {
    if (password) setPasswordError(validatePassword(password));
  }, [password]);

  useEffect(() => {
    if (dateOfBirth) setDateOfBirthError(validateAge(dateOfBirth));
  }, [dateOfBirth]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">
            Create your account to start enjoying the best sports betting
            experience. Bet on your favorite leagues, follow live scores, and be
            a part of the action. Sign up now and join the BetMasters community!
          </p>
        </div>
        <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
          <Form action="/signup" method="post" className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="input input-bordered"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
              {dateOfBirthError && (
                <span className="text-sm text-red-500">{dateOfBirthError}</span>
              )}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && (
                <span className="text-sm text-red-500">{emailError}</span>
              )}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && (
                <span className="text-sm text-red-500">{passwordError}</span>
              )}
              <label className="label">
                <Link to="/login" className="link-hover link label-text-alt">
                  Already have an account?
                </Link>
              </label>
            </div>

            <div className="form-control mt-6">
              <button
                className="btn btn-primary"
                disabled={!!emailError || !!passwordError || !!dateOfBirthError} // Disables the button if input is incorrect
              >
                Register
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

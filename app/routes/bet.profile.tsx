import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, json, useFetcher } from "@remix-run/react";
import { requireAuthCookie } from "~/utils/auth";
import axios from "axios";
import { backendUrl } from "~/api/betMasters";

export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters Profile" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const auth = await requireAuthCookie(request);

  // Gets user account balance
  const response = await axios.get(backendUrl + "/transaction/get-balance", {
    params: {
      jwtToken: auth.jwt,
      email: auth.email,
      userId: auth.uid,
    },
  });

  // Extracting the balance from the response data
  const balance = response.data.balance;

  return json({ auth, balance });
}

export default function Profile() {
  const { auth, balance } = useLoaderData<typeof loader>(); // receives data returned by loader

  return (
    <div className="max-w-3xl overflow-x-hidden">
      <div className="my-4 space-y-4">
        <p>Email: {auth ? auth.email : "No user found"}</p>
        <p>ID: {auth ? auth.uid : "No user found"}</p>

        <p className="text-wrap">{auth ? auth.jwt : "No jwt found"}</p>
        <p>Balance: {balance}</p>
        <DeleteProfileModal />
      </div>
    </div>
  );
}

function DeleteProfileModal() {
  const fetcher = useFetcher();
  return (
    <>
      <button
        className="btn btn-outline btn-error"
        onClick={() =>
          document.getElementById("delete_profile_modal").showModal()
        }
      >
        Delete Account
      </button>
      <dialog id="delete_profile_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete</h3>
          <p className="py-4">
            Do you really want to delete your account? You can not undo this
            action!
          </p>
          <div className="modal-action">
            {/*Posts to action function /deleteaccount*/}
            <fetcher.Form action="/deleteaccount" method="post">
              <button className="btn btn-error">Delete</button>
            </fetcher.Form>

            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

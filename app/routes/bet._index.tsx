import { MetaFunction } from "@remix-run/node";

/**
 * Defines metadata for the BetMasters landing page.
 *
 * This function is used by Remix to set the title and meta tags for the route
 */
export const meta: MetaFunction = () => {
  return [
    { title: "BetMasters" },
    { name: "description", content: "Welcome to BetMasters!" },
  ];
};

/**
 * Renders the BetMasters landing page.
 *
 * Currently, this is a placeholder component that renders an empty div.
 * It can be expanded in the future to include content for the landing page.
 */
export default function Page() {
  return <div></div>;
}

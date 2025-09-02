// app/nodes/page.tsx
// This is a Server Component by default.
// This file serves as the entry point for the /nodes route.

import NodesClientPage from "./client"; // Client component file

export default function NodesPage() {
  // Read environment variables from the server side.
  const agentApiKey = process.env.AGENT_API_KEY;
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000";

  // Critical validation: Ensure required environment variables are set.
  if (!agentApiKey) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border border-red-500 bg-red-50 p-6 text-center text-red-700">
          <h2 className="text-xl font-bold">Server Configuration Error</h2>
          <p className="mt-2">
            The <code>AGENT_API_KEY</code> environment variable was not found.
            <br />
            Please set it in your <code>.env.local</code> file and restart the server.
          </p>
        </div>
      </div>
    );
  }

  // Pass safe data to the Client Component as props.
  return <NodesClientPage apiKey={agentApiKey} dashboardUrl={dashboardUrl} />;
}

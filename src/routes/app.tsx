import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { OrgProvider, Shell } from "@/components/shell";

export const Route = createFileRoute("/app")({ component: AppLayout });

function AppLayout() {
  const [ready, setReady] = useState(false);
  const { user, isPending } = useCurrentUserState();
  useEffect(() => setReady(true), []);
  if (!ready || isPending) {
    return <div className="grid min-h-screen place-items-center bg-paper text-sm text-muted">DOCUFLOW AI</div>;
  }
  if (!user) return <RedirectToSignIn />;
  return (
    <OrgProvider>
      <Shell>
        <Outlet />
      </Shell>
    </OrgProvider>
  );
}

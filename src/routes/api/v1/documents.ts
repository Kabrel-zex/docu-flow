import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/documents")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { importViaBearer } = await import("@/lib/docuflow/store.server");
        let body: unknown = {};
        try {
          body = await request.json();
        } catch {
          body = {};
        }
        const result = await importViaBearer(request.headers.get("authorization") ?? "", body);
        return Response.json(result.body, { status: result.status });
      },
    },
  },
});

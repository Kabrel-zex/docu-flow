import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleStripeWebhook } = await import("@/lib/docuflow/stripe.server");
        const raw = await request.text();
        const signature = request.headers.get("stripe-signature") ?? "";
        try {
          return Response.json(await handleStripeWebhook(raw, signature));
        } catch (error) {
          const status = error instanceof Error && "status" in error && typeof error.status === "number" ? error.status : 500;
          const message = error instanceof Error ? error.message : "Webhook refusé.";
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});

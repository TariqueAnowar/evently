import stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    if (event.type === "checkout.session.completed") {
      const { id, amount_total, metadata } = event.data.object;

      const order = {
        stripeId: id,
        eventId: metadata?.eventId || "",
        buyerId: metadata?.buyerId || "",
        totalAmount: amount_total ? (amount_total / 100).toString() : "0",
        createdAt: new Date(),
      };

      return new Response(JSON.stringify({ message: "OK", order }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (err) {
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  // For other events or errors, return a generic response
  return new Response("Response Executed", { status: 200 });
}

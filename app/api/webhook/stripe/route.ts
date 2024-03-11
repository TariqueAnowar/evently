import { NextResponse } from "next/server";
import stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

    let newOrder;

    switch (event.type) {
      case "checkout.session.completed":
        const { id, amount_total, metadata } = event.data.object;

        newOrder = {
          stripeId: id,
          eventId: metadata?.eventId,
          buyerId: metadata?.buyerId,
          amount_total: amount_total ? (amount_total / 100).toString() : "0",
          createdAt: new Date(),
        };

        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ message: "OK", order: newOrder });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
  }
  return new Response("okay", { status: 200 });
}

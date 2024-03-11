import { NextApiRequest, NextApiResponse } from "next";
import stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      let newOrder;
      // Handle the event
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
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).json({ message: "OK", order: newOrder });
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

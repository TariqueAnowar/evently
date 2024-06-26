import { IEvent } from "@/lib/database/model/event.model";
import React, { useEffect } from "react";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { checkoutOrder } from "@/lib/actions/order.actions";
import Link from "next/link";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  console.log({ event, userId });

  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };

    await checkoutOrder(order);
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  return (
    <form action={onCheckout}>
      {event.organizer?._id === userId ? (
        ""
      ) : (
        // <Link href={`/orders?eventId=${event._id}`}>
        //   <Button
        //     role="link"
        //     size="lg"
        //     className="button sm:w-fit"
        //     type="button"
        //   >
        //     <p>Buyer Details</p>
        //   </Button>
        // </Link>
        <Button type="submit" role="link" size="lg" className="button sm:w-fit">
          {event.isFree ? "Get Tickets" : "Buy Tickets"}
        </Button>
      )}
    </form>
  );
};

export default Checkout;

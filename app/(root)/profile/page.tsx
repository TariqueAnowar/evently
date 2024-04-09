import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByOrganizer } from "@/lib/actions/event.actions";
import { getOrderByUser } from "@/lib/actions/order.actions";
import { IOrder } from "@/lib/database/model/order.model";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.mongodb_userId as string;

  const ordersPage = Number(searchParams.ordersPage) || 1;
  const eventsPage = Number(searchParams.eventsPage) || 1;

  const organizedEvents = await getEventsByOrganizer({
    userId,
    page: eventsPage,
  });

  const orders = await getOrderByUser({ userId, page: ordersPage });
  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];

  return (
    <>
      {/* My Tickets */}

      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exiciting events to explore!"
          collectionType="MY_TICKETS"
          limit={3}
          page={ordersPage}
          totalPages={orderedEvents?.totalPages}
          urlParamName=""
        />
      </section>

      {/* Events organized */}

      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Events</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Create New Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="EVENTS_ORGANIZED"
          limit={3}
          page={eventsPage}
          totalPages={orderedEvents?.totalPages}
          urlParamName=""
        />
      </section>
    </>
  );
};

export default ProfilePage;

import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { DiscAlbum } from "lucide-react";
import Image from "next/image";
import React from "react";

type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

function capitalizeFirstLetterOfEveryWord(sentence: string): string {
  return sentence.replace(/\b\w/g, (char) => char.toUpperCase());
}

const eventDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const event = await getEventById(id);

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  });

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="hero image"
            height={1000}
            width={1000}
            className="h-full w-full aspect-video  object-contain object-center"
          />
          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">
                {capitalizeFirstLetterOfEveryWord(event.title)}
              </h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className=" min-w-fit rounded-full bg-green-200  px-3 py-1 shadow-sm transition-all cursor-pointer flex items-center">
                    {event.isFree ? "Free" : `$ ${event.price}`}
                  </p>

                  <p className="text-white/90 text-xs min-w-fit rounded-full bg-gray-600  px-3 py-1 shadow-sm transition-all cursor-pointer flex items-center truncate">
                    {capitalizeFirstLetterOfEveryWord(event.category?.name)}
                  </p>
                </div>
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by
                  <span className="text-primary-500 ml-2">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            {/* space for checkout/buy button */}
            <CheckoutButton event={event}/>

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calender"
                  height={32}
                  width={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-col flex-wrap items-center">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>
              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event.place}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="p-bold-20">What you'll learn:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <p className="p-medium-16 lg:p-regular-18 truncate underline text-primary-500">
                {event.url}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>
        <Collection
          data={relatedEvents?.data}
          emptyTitle="No events found"
          emptyStateSubtext="Come back later"
          collectionType="ALL_EVENTS"
          limit={6}
          page={1}
          totalPages={2}
          urlParamName=""
        />
      </section>
    </>
  );
};

export default eventDetails;

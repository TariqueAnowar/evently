import { IEvent } from "@/lib/database/model/event.model";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

function capitalizeFirstLetterOfEveryWord(sentence: string): string {
  return sentence.replace(/\b\w/g, (char) => char.toUpperCase());
}

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.mongodb_userId as string;

  const isEventCreator = userId === event.organizer?._id.toString();

  return (
    <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96">
      <div className="relative h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
        <Link href={`/events/${event._id}`}>
          <Image
            src={event.imageUrl}
            alt="card-image"
            width={1000}
            height={1000}
            className="h-full w-full object-cover items-center"
          />
        </Link>
        {isEventCreator && !hidePrice && (
          <div className="absolute top-2 right-2 rounded-xl bg-white p-3 shadow-sm transition-all flex flex-col gap-5">
            <Link href={`/events/${event._id}/update`}>
              <Image
                src="/assets/icons/edit.svg"
                alt="event"
                height={20}
                width={20}
              />
            </Link>

            <DeleteConfirmation eventId={event._id} />
          </div>
        )}
        <div className="absolute bottom-2 right-2 rounded-full bg-gray-600  px-3 py-1 shadow-sm transition-all cursor-pointer">
          <p className="text-white/90 text-xs">
            {event.category?.name &&
              capitalizeFirstLetterOfEveryWord(event.category.name)}
          </p>
        </div>
      </div>
      <div className="p-6 cursor-default">
        <div className="flex items-center justify-between mb-2 gap-4">
          <h5 className="block  font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 w-4/6">
            <p className="line-clamp-2">
              {capitalizeFirstLetterOfEveryWord(event.title)}
            </p>
          </h5>
          <span className="bg-green-200 w-2/6  rounded-full text-sm px-3 py-1 flex items-center justify-center">
            {event.isFree ? "Free" : `$ ${event.price}`}
          </span>
        </div>
        <div className="text-xs flex items-center">
          by{" "}
          <span className="bg-orange-200 rounded-full px-3 py-0 ml-2">
            {event.organizer?.firstName} {event.organizer?.lastName}
          </span>
        </div>

        <div className="mt-5 block font-sans text-base antialiased font-light leading-relaxed text-inherit">
          <span className="line-clamp-3">{event.description}</span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <span className="bg-gray-200 w-[150px] flex justify-center text-sm rounded-full px-3 py-0 ">
            {formatDateTime(event.startDateTime).dateOnly}
          </span>
          <span className="bg-gray-200  w-[80px] flex justify-center text-sm rounded-full px-3 py-0 ">
            {formatDateTime(event.startDateTime).timeOnly}
          </span>
        </div>
      </div>

      <div className="p-6 pt-0">
        {hasOrderLink ? (
          <Link href={`/orders?eventId=${event._id}`}>
            <button
              className="flex gap-2 items-center  align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
              type="button"
            >
              <p>Buyer Details</p>
              
            </button>
          </Link>
        ) : (
          <Link href={`/events/${event._id}`}>
            <button
              className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
              type="button"
            >
              Read More
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Card;

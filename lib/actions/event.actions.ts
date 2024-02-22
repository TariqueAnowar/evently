"use server";

import { connectToDatabase } from "../database";
import Event from "../database/model/event.model";
import User from "../database/model/user.model";
import { handleError } from "../utils";

type CreateEventParams = {
  event: {
    title: string;
    description: string;
    place: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  userId: string;
  path: string;
};
export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    await connectToDatabase();
    const organizer = await User.findById(userId);

    if (!organizer) throw new Error("Organizer not exist.");

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    console.log(error);

    //handleError(error);
  }
};

"use server";

import { connectToDatabase } from "../database";
import Category from "../database/model/category.model";
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

// Create new event
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
    handleError(error);
  }
};

// Populate/fetch complete details
const populateEvent = async (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({ path: "category", model: Category, select: "_id name" });
};

// Get a single event
export const getEventById = async (eventId: string) => {
  try {
    await connectToDatabase();
    const event = await populateEvent(Event.findById(eventId));
    if (!event) {
      throw new Error("Event not found.");
    }
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
};

// Get all events
type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export const getAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) => {
  try {
    await connectToDatabase();

    const condition = {};
    const eventsQuery = Event.find(condition)
      .sort({ createdAt: "desc" })
      .skip(0)
      .limit(limit);
    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(condition);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

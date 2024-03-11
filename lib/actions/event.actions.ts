"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database";
import Category from "../database/model/category.model";
import Event from "../database/model/event.model";
import User from "../database/model/user.model";
import { handleError } from "../utils";
import { UTApi } from "uploadthing/server";

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

// Get events by userId/organizer

type GetEventsByOrganizerParams = {
  userId: string;
  limit?: number;
  page?: number;
};

export async function getEventsByOrganizer({
  userId,
  limit = 3,
  page = 1,
}: GetEventsByOrganizerParams) {
  try {
    await connectToDatabase();

    const skipAmount = (page - 1) * limit;
    const condition = {
      organizer: userId,
    };
    const eventsQuery = Event.find(condition)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
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
}

// Get related events by catgory

export type GetRelatedEventsByCategoryParams = {
  categoryId: string;
  eventId: string;
  limit?: number;
  page: number | string;
};

export const getRelatedEventsByCategory = async ({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) => {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;
    const condition = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };
    const eventsQuery = Event.find(condition)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
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

// Update events

export type UpdateEventParams = {
  userId: string;
  event: {
    _id: string;
    title: string;
    imageUrl: string;
    description: string;
    place: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  path: string;
};

export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    await connectToDatabase();

    const eventToUpdate = await Event.findById(event._id);

    if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
      throw new Error("Unauthorized or event not found.");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      { ...event, category: event.categoryId },
      { new: true }
    );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

// Delete a single event
export const deleteEvent = async ({
  eventId,
  path,
}: {
  eventId: string;
  path: string;
}) => {
  try {
    await connectToDatabase();

    const event = await getEventById(eventId);

    const utapi = new UTApi();
    const url = event.imageUrl;
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    await utapi.deleteFiles(fileName);

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};

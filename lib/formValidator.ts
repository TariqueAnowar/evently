import { z } from "zod";

// 1. Define your form schema/validation.
export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters.")
    .max(400, "Description must be less than 400 characters."),
  place: z
    .string()
    .min(3, "Location must be at least 3 characters.")
    .max(400, "4ocation must be less than 400 characters."),
  imageUrl: z.string().url(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z
    .string()
    .min(24, "You must choose one category.")
    .max(24, "Invalid category. Try again."),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});

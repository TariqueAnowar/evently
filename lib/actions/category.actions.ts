"use server";

import { connectToDatabase } from "../database";
import Category from "../database/model/category.model";
import { handleError } from "../utils";

type CreateCategoryParams = {
  categoryName: string;
};

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    await connectToDatabase();
    const newCategory = await Category.create({ name: categoryName });
    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategory = async () => {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};

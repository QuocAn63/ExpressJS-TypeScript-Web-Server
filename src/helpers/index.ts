import { Request } from "express";
import { param } from "express-validator";

/**
 * @param limit Define the limit for number of items
 * @param page Define number of current page
 *
 */

export const getPaginationString = (req: Request) => {
  const { limit, page } = req.query;

  const limitNumber =
    limit && typeof limit === "string" && !Number.isNaN(limit)
      ? Number.parseInt(limit)
      : 20;
  const pageNumber =
    page && typeof page === "string" && !Number.isNaN(page)
      ? Number.parseInt(page)
      : 1;

  return { limit: limitNumber, page: pageNumber };
};

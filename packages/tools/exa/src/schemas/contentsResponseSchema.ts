import { z } from "zod";
import { ExaSearchResultSchema } from "./searchResponseSchema.js";

export const ExaContentsStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["success", "error"]),
  error: z
    .object({
      tag: z.enum([
        "CRAWL_NOT_FOUND",
        "CRAWL_TIMEOUT",
        "CRAWL_LIVECRAWL_TIMEOUT",
        "SOURCE_NOT_AVAILABLE",
        "CRAWL_UNKNOWN_ERROR",
      ]),
      httpStatusCode: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const ExaContentsResponseSchema = z.object({
  requestId: z.string().optional(),
  results: z.array(ExaSearchResultSchema),
  context: z.string().optional(),
  statuses: z.array(ExaContentsStatusSchema).optional(),
  costDollars: z
    .object({
      total: z.number().optional(),
      breakDown: z.unknown().optional(),
      perRequestPrices: z.record(z.string(), z.number()).optional(),
      perPagePrices: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
});

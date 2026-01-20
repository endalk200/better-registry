import { z } from "zod";

const ExtrasSchema = z
  .object({
    links: z.array(z.string()).optional(),
    imageLinks: z.array(z.string()).optional(),
  })
  .optional();

export const ExaSearchResultSchema: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    title: z.string(),
    url: z.string(),
    id: z.string().optional(),
    publishedDate: z.string().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    favicon: z.string().optional(),
    text: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    highlightScores: z.array(z.number()).optional(),
    summary: z.string().optional(),
    subpages: z.array(ExaSearchResultSchema).optional(),
    extras: ExtrasSchema,
  }),
);

export const ExaApiResponseSchema = z.object({
  requestId: z.string().optional(),
  results: z.array(ExaSearchResultSchema),
  searchType: z.enum(["neural", "deep"]).optional(),
  context: z.string().optional(),
  costDollars: z
    .object({
      total: z.number().optional(),
      breakDown: z.unknown().optional(),
      perRequestPrices: z.record(z.string(), z.number()).optional(),
      perPagePrices: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
});

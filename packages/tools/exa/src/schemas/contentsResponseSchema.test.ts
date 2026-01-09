import { describe, expect, it } from "vitest";
import { ExaContentsResponseSchema } from "./contentsResponseSchema.js";

describe("ExaContentsResponseSchema", () => {
  it("accepts minimal valid response", () => {
    const raw = {
      results: [
        {
          title: "Example",
          url: "https://example.com",
        },
      ],
    };

    const parsed = ExaContentsResponseSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect((parsed.data.results[0] as any)?.title).toBe("Example");
    }
  });

  it("accepts statuses entries", () => {
    const raw = {
      results: [
        {
          title: "Example",
          url: "https://example.com",
        },
      ],
      statuses: [
        {
          id: "https://example.com",
          status: "error",
          error: {
            tag: "CRAWL_NOT_FOUND",
            httpStatusCode: 404,
          },
        },
      ],
    };

    const parsed = ExaContentsResponseSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });
});

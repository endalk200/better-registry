import { describe, expect, it } from "vitest";
import { ExaApiResponseSchema } from "./searchResponseSchema.js";
import { ExaResponseValidationError } from "../utils/errors.js";

describe("ExaApiResponseSchema", () => {
  it("accepts minimal valid response", () => {
    const raw = {
      results: [
        {
          title: "Example",
          url: "https://example.com",
        },
      ],
    };

    const parsed = ExaApiResponseSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(
        (parsed.data.results[0] as { title: string } | undefined)?.title,
      ).toBe("Example");
    }
  });

  it("rejects responses missing required fields", () => {
    const raw = {
      results: [{ url: "https://example.com" }],
    };

    const parsed = ExaApiResponseSchema.safeParse(raw);
    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      const err = new ExaResponseValidationError(parsed.error.issues);
      expect(err.name).toBe("ExaResponseValidationError");
      expect(err.issues).toBeDefined();
    }
  });
});

import { describe, expect, it } from "vitest";
import {
  PLAYGROUND_MODELS,
  PLAYGROUND_PROVIDER_MODEL_ALLOWLIST,
} from "@/lib/playground/chat-contract";

describe("PLAYGROUND_PROVIDER_MODEL_ALLOWLIST", () => {
  it("groups model ids by provider", () => {
    const expected = PLAYGROUND_MODELS.reduce(
      (acc, model) => {
        acc[model.provider].push(model.id);
        return acc;
      },
      {
        openai: [] as string[],
        openrouter: [] as string[],
      },
    );

    expect(PLAYGROUND_PROVIDER_MODEL_ALLOWLIST).toEqual(expected);
  });

  it("is immutable at runtime", () => {
    expect(Object.isFrozen(PLAYGROUND_PROVIDER_MODEL_ALLOWLIST)).toBe(true);
    expect(
      Object.isFrozen(PLAYGROUND_PROVIDER_MODEL_ALLOWLIST.openai),
    ).toBe(true);
    expect(
      Object.isFrozen(PLAYGROUND_PROVIDER_MODEL_ALLOWLIST.openrouter),
    ).toBe(true);

    expect(() => {
      (PLAYGROUND_PROVIDER_MODEL_ALLOWLIST.openai as unknown as string[]).push(
        "new-model",
      );
    }).toThrow(TypeError);
  });
});

// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/chat/route";

const previousEnv = { ...process.env };

const buildRequest = (body: unknown) =>
  new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
    },
    body: JSON.stringify(body),
  });

const validBody = {
  messages: [
    {
      id: "m-1",
      role: "user",
      parts: [{ type: "text", text: "Hello from test" }],
    },
  ],
  model: "gpt-4o",
  provider: "openai",
};

describe("POST /api/chat contract", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = {
      ...previousEnv,
      OPENAI_API_KEY: "",
      OPENROUTER_API_KEY: "",
    };
  });

  afterEach(() => {
    process.env = { ...previousEnv };
  });

  it("returns 403 for non-local hosts", async () => {
    const response = await POST(
      new Request("https://example.com/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          host: "example.com",
        },
        body: JSON.stringify(validBody),
      }),
    );

    const data = await response.json();
    expect(response.status).toBe(403);
    expect(data.error.code).toBe("forbidden");
  });

  it("returns 400 for missing provider/model", async () => {
    const response = await POST(
      buildRequest({
        messages: validBody.messages,
      }),
    );

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error.code).toBe("invalid_request");
  });

  it("returns 400 for disallowed provider/model combination", async () => {
    const response = await POST(
      buildRequest({
        ...validBody,
        model: "anthropic/claude-sonnet-4",
      }),
    );

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error.code).toBe("invalid_request");
  });

  it("returns 400 for oversized text content", async () => {
    const response = await POST(
      buildRequest({
        ...validBody,
        messages: [
          {
            id: "m-1",
            role: "user",
            parts: [{ type: "text", text: "x".repeat(20_001) }],
          },
        ],
      }),
    );

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error.code).toBe("invalid_request");
  });

  it("returns 413 for oversized request payload", async () => {
    const response = await POST(
      buildRequest({
        ...validBody,
        requestMetadata: {
          debug: "x".repeat(250_000),
        },
      }),
    );

    const data = await response.json();
    expect(response.status).toBe(413);
    expect(data.error.code).toBe("request_too_large");
  });

  it("returns deterministic provider configuration error", async () => {
    const response = await POST(buildRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error.code).toBe("provider_not_configured");
  });

  it("accepts bracketed IPv6 localhost hosts", async () => {
    const response = await POST(
      new Request("http://[::1]:3000/api/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          host: "[::1]:3000",
        },
        body: JSON.stringify(validBody),
      }),
    );

    const data = await response.json();
    expect(response.status).toBe(503);
    expect(data.error.code).toBe("provider_not_configured");
  });
});

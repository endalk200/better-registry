import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePlaygroundChat } from "@/app/playground/hooks/use-playground-chat";

const useChatMock = vi.fn();
let lastTransportOptions: Record<string, unknown> | undefined;

vi.mock("@ai-sdk/react", () => ({
  useChat: (...args: unknown[]) => useChatMock(...args),
}));

vi.mock("ai", () => ({
  DefaultChatTransport: class {
    public options: Record<string, unknown>;

    constructor(options: Record<string, unknown>) {
      this.options = options;
      lastTransportOptions = options;
    }
  },
}));

describe("usePlaygroundChat", () => {
  it("sends messages with files and clears local text state", () => {
    const sendMessage = vi.fn();

    useChatMock.mockReturnValue({
      messages: [],
      status: "ready",
      sendMessage,
      regenerate: vi.fn(),
      stop: vi.fn(),
    });

    const { result } = renderHook(() => usePlaygroundChat());

    act(() => {
      result.current.setText("Hello");
    });

    act(() => {
      result.current.submit({ text: "Hello", files: [] });
    });

    expect(sendMessage).toHaveBeenCalledWith({ files: [], text: "Hello" });
    expect(result.current.text).toBe("");
  });

  it("injects selected model/provider for submit and regenerate requests", () => {
    useChatMock.mockReturnValue({
      messages: [
        {
          id: "assistant-1",
          role: "assistant",
          parts: [{ type: "text", text: "hi" }],
        },
      ],
      status: "ready",
      sendMessage: vi.fn(),
      regenerate: vi.fn(),
      stop: vi.fn(),
    });

    const { result } = renderHook(() => usePlaygroundChat());

    const prepareSendMessagesRequest = lastTransportOptions
      ?.prepareSendMessagesRequest as
      | ((value: {
          api: string;
          body: Record<string, unknown>;
          credentials: RequestCredentials | undefined;
          headers: HeadersInit | undefined;
          id: string;
          messageId: string | undefined;
          messages: unknown[];
          requestMetadata: unknown;
          trigger: "submit-message" | "regenerate-message";
        }) => { body: Record<string, unknown> })
      | undefined;

    expect(prepareSendMessagesRequest).toBeTypeOf("function");

    const initialRequest = prepareSendMessagesRequest?.({
      api: "/api/chat",
      body: {},
      credentials: undefined,
      headers: undefined,
      id: "chat-1",
      messageId: undefined,
      messages: [],
      requestMetadata: undefined,
      trigger: "submit-message",
    });

    expect(initialRequest?.body).toMatchObject({
      id: "chat-1",
      model: "gpt-4o",
      messages: [],
      provider: "openai",
      trigger: "submit-message",
    });

    act(() => {
      result.current.setSelectedModel("google/gemini-2.0-flash");
    });

    const regenerateRequest = prepareSendMessagesRequest?.({
      api: "/api/chat",
      body: { foo: "bar" },
      credentials: undefined,
      headers: undefined,
      id: "chat-1",
      messageId: "m-123",
      messages: [{ id: "m-user", role: "user", parts: [{ type: "text", text: "x" }] }],
      requestMetadata: undefined,
      trigger: "regenerate-message",
    });

    expect(regenerateRequest?.body).toMatchObject({
      foo: "bar",
      id: "chat-1",
      messageId: "m-123",
      model: "google/gemini-2.0-flash",
      messages: [{ id: "m-user", role: "user", parts: [{ type: "text", text: "x" }] }],
      provider: "openrouter",
      trigger: "regenerate-message",
    });
  });
});

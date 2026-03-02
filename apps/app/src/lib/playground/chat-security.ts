import { type ChatErrorCode } from "@/lib/playground/chat-contract";

type GuardFailure = {
  code: ChatErrorCode;
  message: string;
  status: number;
};

type GuardResult =
  | { ok: true }
  | {
      ok: false;
      error: GuardFailure;
    };

const normalizeHost = (value: string | null): string => {
  if (!value) {
    return "";
  }
  return value.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
};

const isLocalHost = (host: string): boolean =>
  host === "localhost" || host === "127.0.0.1" || host === "::1";

const isLocalRequest = (req: Request): boolean => {
  const requestHost = (() => {
    try {
      return new URL(req.url).hostname.toLowerCase();
    } catch {
      return "";
    }
  })();

  if (!isLocalHost(requestHost)) {
    return false;
  }

  const forwardedHost = normalizeHost(req.headers.get("x-forwarded-host"));
  const host = normalizeHost(req.headers.get("host"));

  if (forwardedHost && !isLocalHost(forwardedHost)) {
    return false;
  }

  if (host && !isLocalHost(host)) {
    return false;
  }

  return true;
};

export const enforceChatAccess = (req: Request): GuardResult => {
  if (!isLocalRequest(req)) {
    return {
      ok: false,
      error: {
        code: "forbidden",
        message:
          "Playground chat is only available in local development on this machine.",
        status: 403,
      },
    };
  }

  return { ok: true };
};

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

  const first = value.split(",")[0]?.trim().toLowerCase() ?? "";
  if (!first) {
    return "";
  }

  if (first.startsWith("[")) {
    const bracketEnd = first.indexOf("]");
    if (bracketEnd > 0) {
      return first.slice(1, bracketEnd);
    }

    return first;
  }

  return first.split(":")[0] ?? "";
};

const isLocalHost = (host: string): boolean =>
  host === "localhost" || host === "127.0.0.1" || host === "::1";

const isLocalRequest = (req: Request): boolean => {
  const requestHost = (() => {
    try {
      const url = new URL(req.url);
      return normalizeHost(url.host || url.hostname);
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

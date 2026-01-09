export class MissingApiKeyError extends Error {
  readonly _tag = "MissingApiKeyError";

  constructor(message = "EXA_API_KEY is required") {
    super(message);
    this.name = "MissingApiKeyError";
  }
}

export class ExaHttpError extends Error {
  readonly _tag = "ExaHttpError";
  readonly status: number;
  readonly body?: string;

  constructor(status: number, body?: string) {
    super(`Exa API error: ${status}${body ? ` - ${body}` : ""}`);
    this.name = "ExaHttpError";
    this.status = status;
    this.body = body;
  }
}

export class ExaTimeoutError extends Error {
  readonly _tag = "ExaTimeoutError";
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Exa API request timed out after ${timeoutMs}ms`);
    this.name = "ExaTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

export class ExaResponseValidationError extends Error {
  readonly _tag = "ExaResponseValidationError";
  readonly issues: unknown;

  constructor(issues: unknown) {
    super("Exa API response validation failed");
    this.name = "ExaResponseValidationError";
    this.issues = issues;
  }
}

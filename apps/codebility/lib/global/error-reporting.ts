export type ErrorSource =
  | "boundary"
  | "client"
  | "server"
  | "section"
  | "action";

export interface ErrorReportContext {
  source: ErrorSource;
  boundary: string;
  route?: string;
  path?: string;
  section?: string;
  digest?: string;
}

interface ErrorPayload {
  source: ErrorSource;
  boundary: string;
  route?: string;
  path?: string;
  section?: string;
  digest?: string;
  name: string;
  message: string;
  stack?: string;
}

const recentReports = new Set<string>();
const RECENT_REPORT_LIMIT = 50;

function readDigest(error: unknown) {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return undefined;
  }

  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" ? digest : undefined;
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      digest: readDigest(error),
    };
  }

  return {
    name: "UnknownError",
    message: typeof error === "string" ? error : "Unknown error",
    stack: undefined,
    digest: readDigest(error),
  };
}

export function reportError(
  error: unknown,
  context: ErrorReportContext,
): void {
  const normalized = normalizeError(error);
  const digest = context.digest ?? normalized.digest;
  const payload: ErrorPayload = {
    ...context,
    ...normalized,
    digest,
  };
  const fingerprint = [
    payload.source,
    payload.boundary,
    payload.route ?? "",
    payload.section ?? "",
    payload.digest ?? "",
    payload.name,
    payload.message,
  ].join("|");

  if (recentReports.has(fingerprint)) return;

  recentReports.add(fingerprint);
  if (recentReports.size > RECENT_REPORT_LIMIT) {
    const oldest = recentReports.values().next().value;
    if (oldest) recentReports.delete(oldest);
  }

  console.error("[codebility:error]", payload);
}

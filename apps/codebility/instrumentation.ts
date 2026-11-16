import type { Instrumentation } from "next";

import { reportError } from "./lib/global/error-reporting";

export const onRequestError: Instrumentation.onRequestError = (
  error,
  request,
  context,
) => {
  reportError(error, {
    source: "server",
    boundary: context.routeType,
    route: context.routePath,
    path: request.path,
  });
};

import { reportError } from "./lib/global/error-reporting";

window.addEventListener("error", (event) => {
  reportError(event.error ?? event.message, {
    source: "client",
    boundary: "window.error",
    route: window.location.pathname,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  reportError(event.reason, {
    source: "client",
    boundary: "window.unhandledrejection",
    route: window.location.pathname,
  });
});

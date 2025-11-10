import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@codevs/ui";
function Skeleton({ className, ...props }) {
    return (_jsx("div", { className: cn("animate-pulse rounded-md bg-muted", className), ...props }));
}
export { Skeleton };
//# sourceMappingURL=skeleton.js.map
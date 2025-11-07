import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from 'class-variance-authority';
import { cn } from "@codevs/ui";
const badgeVariants = cva('inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
    variants: {
        variant: {
            default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
            secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
            destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
            outline: 'text-foreground',
            success: 'border-transparent bg-green-50 hover:bg-green-50 text-green-500 dark:bg-green-500/20 dark:hover:bg-green-500/20',
            warning: 'border-transparent bg-orange-50 hover:bg-orange-50 text-orange-500 dark:bg-orange-500/20 dark:hover:bg-orange-500/20',
            info: 'border-transparent bg-customBlue-50 hover:bg-customBlue-50 text-customBlue-500 dark:bg-customBlue-500/20 dark:hover:bg-customBlue-500/20',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});
function Badge({ className, variant, ...props }) {
    return (_jsx("div", { className: cn(badgeVariants({ variant }), className), ...props }));
}
export { Badge, badgeVariants };
//# sourceMappingURL=badge.js.map
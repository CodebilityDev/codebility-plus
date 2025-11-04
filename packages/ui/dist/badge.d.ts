import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
declare const badgeVariants: (props?: {
    variant?: "default" | "destructive" | "outline" | "secondary" | "success" | "warning" | "info";
} & import("class-variance-authority/types").ClassProp) => string;
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
}
declare function Badge({ className, variant, ...props }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export { Badge, badgeVariants };
//# sourceMappingURL=badge.d.ts.map
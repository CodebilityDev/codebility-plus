# UI - @kit/ui

This package is responsible for managing the UI components and styles across the app.

This package define two sets of components:

- `shadn-ui`: A set of UI components that can be used across the app using shadn UI
- `rpkit`: Components specific to RpKit

## Installing a Shadcn UI component

To install a Shadcn UI component, you can use the following command in the root of the repository:

```bash
npx shadcn@latest add <component> -c packages/ui
```

For example, to install the `Button` component, you can use the following command:

```bash
npx shadcn-ui@latest add button -c packages/ui
```
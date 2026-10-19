import baseConfig from "@codevs/eslint-config/base";
import reactConfig from "@codevs/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [...baseConfig, ...reactConfig];

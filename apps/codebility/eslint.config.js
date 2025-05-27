import baseConfig, { restrictEnvAccess } from "@codevs/eslint-config/base";
import nextjsConfig from "@codevs/eslint-config/nextjs";
import reactConfig from "@codevs/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

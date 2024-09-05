module.exports = {
  extends: ["next", "next/core-web-vitals", "plugin:storybook/recommended"],
  rules: {
    "react/no-unescaped-entities": "error",
    "@next/next/no-page-custom-font": 1,
    "no-unused-vars": "error",
    "no-undef": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-key": "error",
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};

import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    ignores: ["build/", ".svelte-kit/", "dist/"],
  },
  // the generated components have the `$$Events` prop that always goes unused,
  // but we wanna keep them, so I'm putting this here to ignore them
  {
    files: ["src/lib/components/**/*.svelte"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["off"],
    },
  },
];

import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";
import globals from "globals";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  ...svelte.configs["flat/prettier"],
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
    rules: {
      // Redirect targets like /gh/www and /linkedin are served by the catchall
      // endpoint, not the route table, so resolve() can't type them.
      "svelte/no-navigation-without-resolve": ["error", { ignoreLinks: true }],
    },
  },
  {
    ignores: ["build/", ".svelte-kit/", ".vercel/", "dist/"],
  },
);

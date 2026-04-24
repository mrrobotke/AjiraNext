// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build artifacts produced by Storybook and coverage runs.
    "storybook-static/**",
    "coverage/**",
  ]),
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.stories.tsx"],
    rules: {
      "storybook/no-renderer-packages": "off",
    },
  },
  {
    // Defense in depth: flag any `dangerouslySetInnerHTML` so intentional uses
    // (e.g. JSON-LD payloads in `src/lib/seo.tsx`) must opt in with an explicit
    // `eslint-disable-next-line react/no-danger` + security justification.
    rules: {
      "react/no-danger": "error",
    },
  },
]);

export default eslintConfig;

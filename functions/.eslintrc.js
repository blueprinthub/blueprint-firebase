module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/coverage/**/*", // Ignore coverage files
  ],
  plugins: ["@typescript-eslint", "import", "eslint-plugin-tsdoc"],
  rules: {
    quotes: ["error", "double"],
    "tsdoc/syntax": "warn",
    "require-jsdoc": 0,
    "valid-jsdoc": 0,
    "import/no-unresolved": 0,
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "enumMember",
        format: ["PascalCase"],
      },
    ],
  },
};

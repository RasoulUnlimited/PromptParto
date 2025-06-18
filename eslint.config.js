export default [
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { window: "readonly", document: "readonly" },
    },
    rules: {
      semi: ["error", "always"],
      quotes: "off",
    },
  },
];

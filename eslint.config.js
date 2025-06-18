export default [
    {
      files: ["script.js"], // یا هر فایل JS دیگه‌ای که داری
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
      },
    },
  ];
  
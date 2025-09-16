export default {
  semi: true,
  singleQuote: true,
  printWidth: 120,
  trailingComma: "es5",
  tabWidth: 2,
  endOfLine: "auto",
  vueIndentScriptAndStyle: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],

  importOrder: [
    "^vue$",
    "^vue-router",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^[./].*\\.(css|scss|sass|less)$",
  ],
};

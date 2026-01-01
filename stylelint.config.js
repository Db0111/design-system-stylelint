export default {
  customSyntax: "postcss-styled-syntax",
  plugins: ["./dist/index.js"],
  rules: {
    "design-system/no-hardcoded-color": true,
  },
};

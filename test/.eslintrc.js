module.exports = {
  root: false,
  parserOptions: {
    project: "../tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  "rules": {
    "max-nested-callbacks": [
      "off",
      6
    ],
    "max-lines-per-function": [
      "off",
      40
    ]
  }
}

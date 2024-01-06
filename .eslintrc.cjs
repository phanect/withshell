"use strict";

const { join } = require("path");

module.exports = {
  root: true,
  extends: "phanective/node",

  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    sourceType: "module",
    project: join(__dirname, "./tsconfig.json"),
  },
};

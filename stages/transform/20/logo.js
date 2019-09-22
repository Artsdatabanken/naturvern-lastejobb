const fs = require("fs");
const { io } = require("lastejobb");

io.mkdir("build/logo");
fs.copyFileSync(
  "data/naturvern-ubehandlet/logo/logo.svg",
  "build/logo/logo.svg"
);

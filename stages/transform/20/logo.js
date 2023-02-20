const fs = require("fs");
const { io } = require("@artsdatabanken/lastejobb");

io.mkdir("build/logo");
fs.copyFileSync(
  "temp/naturvern-ubehandlet/logo/logo.svg",
  "build/logo/logo.svg"
);

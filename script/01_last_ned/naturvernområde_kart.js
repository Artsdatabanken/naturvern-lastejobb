const { http, log } = require("lastejobb");
const path = require("path");

http
  .downloadBinary(
    "https://raw.githubusercontent.com/Artsdatabanken/naturvern-kart/master/naturvernomr%C3%A5de_meta.json",
    "naturvernområde_kart.json"
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });

const { http, log } = require("lastejobb");
const path = require("path");

http
  .downloadBinary(
    "https://raw.githubusercontent.com/Artsdatabanken/naturvern-kart/master/naturvernomr%C3%A5de_i_kommune.json",
    "naturvernområde_i_kommune.json"
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });

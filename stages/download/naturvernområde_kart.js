const { http, log } = require("@artsdatabanken/lastejobb");

http
  .downloadBinary(
    "https://raw.githubusercontent.com/Artsdatabanken/naturvern-kart/master/type.json",
    "naturvernområde_kart.json"
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });

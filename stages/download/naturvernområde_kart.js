const { http, log } = require("lastejobb");

http
  .downloadBinary(
    "https://raw.githubusercontent.com/Artsdatabanken/naturvern-kart/master/type.json",
    "naturvernområde_kart.json"
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });

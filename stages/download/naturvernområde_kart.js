const { http, log } = require("lastejobb");

http
  .downloadBinary(
    "https://raw.githubusercontent.com/Artsdatabanken/naturvern-kart/master/naturvernområde_meta.json",
    "naturvernområde_kart.json"
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });

const { http, log } = require("@artsdatabanken/lastejobb");

http
  .downloadBinary(
    "https://raw.githubusercontent.com/Artsdatabanken/kommune/master/build/fylke.json",
    "fylke.json"
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });

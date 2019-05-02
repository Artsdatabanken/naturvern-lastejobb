const { http, log } = require("lastejobb");

http
  .downloadBinary(
    "https://raw.githubusercontent.com/Artsdatabanken/kommune/master/fylke.json",
    "fylke.json"
  )
  .catch(err => {
    log.fatal(err);
    process.exit(1);
  });

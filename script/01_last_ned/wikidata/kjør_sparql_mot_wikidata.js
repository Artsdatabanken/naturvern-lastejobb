const wikidata = require("../../../wikidata");
const log = require("log-less-fancy")();
const { io } = require("lastejobb");
const path = require("path");

const query = "./script/01_last_ned/wikidata/naturvernområde.sparql";
wikidata
  .queryFromFile(query, path.basename(query))
  .then(r => next())
  .catch(err => {
    log.error(err.message);
    process.exit(1);
  });

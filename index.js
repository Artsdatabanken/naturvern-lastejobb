if (!process.env.DEBUG) process.env.DEBUG = "*";
const { kjørLastejobberUnder } = require("@artsdatabanken/lastejobb");

const scripPath = "stages/" + (process.argv[2] || "");
kjørLastejobberUnder(scripPath);

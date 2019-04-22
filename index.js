const { kjørLastejobberUnder } = require("lastejobb");

process.env.BUILD = "./naturvern-data";

kjørLastejobberUnder("script/");

const { kjørLastejobberUnder } = require("lastejobb");

process.env.BUILD = "./naturvern";

kjørLastejobberUnder("script/");

const { io, url } = require("lastejobb");

const tre = io.lesDatafil("alle");
new url(tre).assignUrls();
io.skrivBuildfil(__filename, tre);

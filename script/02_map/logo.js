const fs = require("fs");

// destination.txt will be created or overwritten by default.
fs.copyFile("logo/logo.svg", "build/logo.svg", err => {
  if (err) throw err;
});

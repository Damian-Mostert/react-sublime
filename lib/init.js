const fse = require("fs-extra");

console.log("Initializing react-sublime...");
fse.copySync(
  __dirname + "/samples/styles",
  process.cwd() + "/" + __config.inputDirectory
);

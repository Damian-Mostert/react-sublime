__dirname = process.cwd();

const screen = require(__dirname +
  "/" +
  __config.inputDirectory +
  "/screens.json");
const color = require(__dirname +
  "/" +
  __config.inputDirectory +
  "/colors.json");
const size = require(__dirname + "/" + __config.inputDirectory + "/sizes.json");
const font = require(__dirname + "/" + __config.inputDirectory + "/fonts.json");
const variables = { screen, color, size, font };
let output = `
  `;
let root = `:root{\n`;
let utilities = "";

Object.keys(variables).forEach((mainKey) => {
  output += "//" + mainKey + "\n";
  root += "\t/*" + mainKey + "*/\n";
  if (mainKey != "screen" && mainKey != "size")
    utilities += "\t//" + mainKey + "\n";

  for (const key in variables[mainKey]) {
    if (typeof variables[mainKey][key] == "string") {
      output += `$${mainKey}-${key}: ${variables[mainKey][key]};\n`;
      root += `\t--${mainKey}-${key} : ${variables[mainKey][key]};\n`;
    }
  }
});
output += "\n";

fs.writeFileSync(
  __dirname + "/" + __config.outputDirectory + "/variables.output.scss",
  output
);
fs.writeFileSync(
  __dirname + "/" + __config.outputDirectory + "/variables.output.css",
  root + "}\n"
);

//do fonts
const files = fs
  .readdirSync(__dirname + "/" + __config.inputDirectory + "/fonts")
  .filter((i) => i != "README.md");
let main = {};
files.map((filename) => {
  if (filename != "fonts.css") {
    const fonts = fs.readdirSync(
      __dirname + "/" + __config.inputDirectory + "/fonts/" + filename
    );
    const Loaded = {};
    fonts.map((fontFilename) => {
      Loaded[fontFilename.substr(0, fontFilename.lastIndexOf("."))] = {
        file: filename + "/" + fontFilename,
      };
    });
    main[filename] = Loaded;
  }
});
let string = "/*this file auto-builds, do not edit, instead just add a font*/";
for (let fontName in main) {
  string += "\n/*" + fontName + "*/";
  for (let typeName in main[fontName]) {
    string += `
@font-face{
font-family: "${fontName + "-" + typeName}";
src: url("/fonts/${main[fontName][typeName].file}");
}`;
  }
  string += "\n";
}
fs.writeFileSync(
  __dirname + "/" + __config.outputDirectory + "/fonts.css",
  string
);

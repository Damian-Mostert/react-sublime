#!/usr/bin/env node

const fs = require("fs");
__dirname = process.cwd();
//get config;
const config = require(__dirname + "/sublime.config.json");
const Main = {

};
if(config.styles)
 Main[config.styles.inputDirectory] =  () => {
  const screen = require(__dirname + "/"+config.styles.inputDirectory+"screens.json");
  const color = require(__dirname + "/"+config.styles.inputDirectory+ "colors.json");
  const size = require(__dirname + "/"+config.styles.inputDirectory+ "sizes.json");
  const font = require(__dirname + "/"+config.styles.inputDirectory+ "fonts.json");
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
    __dirname +"/"+config.styles.outputDirectory+ "variables.output.scss",
    output
  );
  fs.writeFileSync(
    __dirname +"/"+config.styles.outputDirectory+  "variables.output.css",
    root + "}\n"
  );

  //do fonts
  const files = fs
    .readdirSync(__dirname +"/"+config.styles.inputDirectory+ "/fonts")
    .filter((i) => i != "README.md");
  let main = {};
  files.map((filename) => {
    if (filename != "fonts.css") {
      const fonts = fs.readdirSync(
        __dirname +"/"+config.styles.inputDirectory+ "fonts/"+ filename
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
  let string =
    "/*this file auto-builds, do not edit, instead just add a font*/";
  for (let fontName in main) {
    string += "\n/*" + fontName + "*/";
    for (let typeName in main[fontName]) {
      string += `
@font-face{
  font-family: "${fontName + "-" + typeName}";
  src: url("../../../@application/styles/fonts/${
    main[fontName][typeName].file
  }");
}`;
    }
    string += "\n";
  }
  fs.writeFileSync(__dirname +"/"+config.styles.outputDirectory+ "fonts.css", string);
};
if(config.popups)
Main[config.popups.inputDirectory] = () => {
  const files = gatherFiles(config.popups.inputDirectory);

  let script = "";
  let exports = "export default {";
  for (let filename of files) {
    script +=
      "import " +
      filename
        .replace(".jsx", "")
        .replace(".jsx", "")
        .replace("(", "__")
        .replace(")", "__") +
      ' from "'+config.popups.inputDirectory +
      filename +
      '";\n';
    exports += "\t" + filename.replace(".jsx", "").replace(".js", "") + ",\n";
  }
  exports += "}\n";
  fs.writeFileSync(__dirname + "/"+config.popups.outputDirectory+"popups.js", script + exports);
}
if(config.sections)
Main[config.sections.inputDirectory] = () => {
  const files = gatherFiles(config.sections.inputDirectory);

  let script = "";
  let exports = "export default {\n\t";
  for (let filename of files) {
    script +=
      "import " +
      filename
        .replace(".jsx", "")
        .replace(".js", "")
        .replace("(", "__")
        .replace(")", "__") +
      `,{\n\ttitle as ${filename
        .replace("(", "__")
        .replace(")", "__")
        .replace(".jsx", "")
        .replace(".js", "")}_title,\n\tprops as ${filename
        .replace(".jsx", "")
        .replace("(", "__")
        .replace(")", "__")
        .replace(".js", "")}_props\n} from "${config.sections.inputDirectory}` +
      filename +
      '";\n' +
      `${filename
        .replace("(", "__")
        .replace(")", "__")
        .replace(".jsx", "")
        .replace(".js", "")}.title = ${filename
        .replace(".jsx", "")
        .replace(".js", "")}_title
${filename.replace(".jsx", "").replace(".js", "")}.props = ${filename
        .replace(".jsx", "")
        .replace("(", "__")
        .replace(")", "__")
        .replace(".js", "")}_props;\n`;
    exports += "\t" + filename.replace(".jsx", "").replace(".js", "") + ",\n";
  }
  exports += "}\n";
  fs.writeFileSync(__dirname +"/"+config.sections.outputDirectory+ "sections.js", script + exports);
}

const flattenArrays = (mainArray) => {
  return mainArray.flatMap((element) =>
    Array.isArray(element) ? element : [element]
  );
};

const gatherFiles = (path) => {
  var files = fs
    .readdirSync(__dirname + path)
    .filter((n) => n != "README.md")
    .map((filename) =>
      filename.startsWith("(") && filename.endsWith(")")
        ? gatherFiles(path + "/" + filename).map((x) => filename + "/" + x)
        : filename
    );
  console.log(files);
  return flattenArrays(files);
};

Object.keys(Main).map((dir) => {
  fs.watch(process.cwd()+"/" + dir, () => {
    Main[dir]();
  });
});

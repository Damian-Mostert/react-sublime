__dirname = process.cwd();
const fse = require("fs-extra");
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

//do fonts
if (!fse.existsSync(__dirname + "/" + __config.outputDirectory + "/fonts")) {
  fs.mkdirSync(__dirname + "/" + __config.outputDirectory + "/fonts");
}
fse.copySync(
  __dirname + "/" + __config.inputDirectory + "/fonts",
  __dirname + "/" + __config.outputDirectory + "/fonts"
);

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
src: url("./fonts/${main[fontName][typeName].file}");
}`;
  }
  string += "\n";
}

const mainSublimeStyles = `
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

${string}
${output}
${root + "}\n"}

@import "${__config.inputDirectory}/components/button.scss";
@import "${__config.inputDirectory}/components/form.scss";
@import "${__config.inputDirectory}/components/icon.scss";
@import "${__config.inputDirectory}/components/input.scss";
@import "${__config.inputDirectory}/components/layout.scss";
@import "${__config.inputDirectory}/components/list.scss";
@import "${__config.inputDirectory}/components/popup.scss";
@import "${__config.inputDirectory}/components/table.scss";
@import "${__config.inputDirectory}/components/text.scss";
@import "${__config.inputDirectory}/components/title.scss";
//import external
@import "sublime-styles/button.scss";
@import "sublime-styles/form.scss";
@import "sublime-styles/input.scss";
@import "sublime-styles/layout.scss";
@import "sublime-styles/list.scss";
@import "sublime-styles/popup.scss";
@import "sublime-styles/slider.scss";
@import "sublime-styles/table.scss";
@import "sublime-styles/text.scss";
@import "sublime-styles/title.scss";

html {
  * {
    color: var(--color-primary);
    font-family: var(--font-default);
    @apply focus:outline-none active:outline-none;
  }
  body {
    --bg: var(--color-body);
    main {
      position: relative;
      width: 100vw;
      max-width: 100vw;
      min-height: 100vh;
    }
  }
}

//helpers
* {
  --filter-bl: 0px;
  --bg: transparent;
  --bg-blur: 0px;

  filter: blur(var(--filter-bl));
  -webkit-filter: blur(var(--filter-bl));

  backdrop-filter: blur(var(--bg-blur));
  -webkit-backdrop-filter: blur(var(--bg-blur));

  stroke: var(--stroke);
  -webkit-text-stroke: var(--stroke);

  background: var(--bg);
}

picture {
  @apply absolute;
  width: 100%;
  height: 100%;
}

body {
  background-color: var(--color-body);
}

`;

fse.writeFileSync(
  __dirname + "/" + __config.outputDirectory + "/sublime.scss",
  mainSublimeStyles,
  { overwrite: true }
);

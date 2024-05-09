module.exports = () =>{
	__dirname = process.cwd();

const fse = require("fs-extra");
const path = require("path");

const inputDirectory = path.join(__dirname, __config.inputDirectory);
const outputDirectory = path.join(__dirname, __config.outputDirectory);

const screen = require(path.join(inputDirectory, "screens.json"));
const color = require(path.join(inputDirectory, "colors.json"));
const size = require(path.join(inputDirectory, "sizes.json"));
const font = require(path.join(inputDirectory, "fonts.json"));
const variables = { screen, color, size, font };
let output = `
	`;
let css = `:root{\n`;
let utilities = "";

Object.keys(variables).forEach((mainKey) => {
	output += "//" + mainKey + "\n";
	css += "\t/*" + mainKey + "*/\n";
	if (mainKey != "screen" && mainKey != "size")
		utilities += "\t//" + mainKey + "\n";

	for (const key in variables[mainKey]) {
		if (typeof variables[mainKey][key] == "string") {
			output += `$${mainKey}-${key}: ${variables[mainKey][key]};\n`;
			css += `\t--${mainKey}-${key} : ${variables[mainKey][key]};\n`;
		}
	}
});
output += "\n";
css+= "}"

// Ensure output directory exists
fse.ensureDirSync(path.join(outputDirectory, "fonts"));

// Copy fonts
fse.copySync(
	path.join(inputDirectory, "fonts"),
	path.join(outputDirectory, "fonts")
);

const files = fs
	.readdirSync(path.join(inputDirectory, "fonts"))
	.filter((i) => i != "README.md");
let fontsString = "/*this file auto-builds, do not edit, instead just add a font*/";
files.forEach((fontName) => {
	if (fontName != "fonts.css") {
		const fonts = fs.readdirSync(
			path.join(inputDirectory, "fonts", fontName)
		);
		fonts.forEach((fontFilename) => {
			fontsString += `
@font-face{
font-family: "${fontName + "-" + fontFilename.split('.')[0]}";
src: url("./fonts/${fontName}/${fontFilename}");
}`;
	});
	}
});

const mainSublimeStyles = `
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

${fontsString}
${output}
${css}

@import "${path.join(__config.inputDirectory, "components/button.scss")}";
@import "${path.join(__config.inputDirectory, "components/form.scss")}";
@import "${path.join(__config.inputDirectory, "components/icon.scss")}";
@import "${path.join(__config.inputDirectory, "components/input.scss")}";
@import "${path.join(__config.inputDirectory, "components/layout.scss")}";
@import "${path.join(__config.inputDirectory, "components/list.scss")}";
@import "${path.join(__config.inputDirectory, "components/popup.scss")}";
@import "${path.join(__config.inputDirectory, "components/table.scss")}";
@import "${path.join(__config.inputDirectory, "components/text.scss")}";
@import "${path.join(__config.inputDirectory, "components/title.scss")}";
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
	path.join(outputDirectory, "sublime.scss"),
	mainSublimeStyles,
	{ overwrite: true }
);

}

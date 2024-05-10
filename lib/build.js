module.exports = () =>{
	__m_dirname = __dirname
	__dirname = process.cwd();

const fse = require("fs-extra");
const path = require("path");

const inputDirectory = path.join(__dirname, __config.inputDirectory);
const outputDirectory = path.join(__dirname, __config.outputDirectory);

function readJSONFileSync(filePath) {
	try {
		// Read the JSON file synchronously
		const data = fs.readFileSync(filePath, 'utf8');

		// Parse the JSON data
		const jsonData = JSON.parse(data);

		return jsonData;
	} catch (error) {
		throw error;
	}
}


const screen = readJSONFileSync(path.join(inputDirectory, "screens.json"));
const color = readJSONFileSync(path.join(inputDirectory, "colors.json"));
const size = readJSONFileSync(path.join(inputDirectory, "sizes.json"));
const font = readJSONFileSync(path.join(inputDirectory, "fonts.json"));
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

${readDirectoryAndCombineSync(path.join(__config.inputDirectory, "components/"))}

${readDirectoryAndCombineSync("lib/samples/defaults/styles/")}

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
	path.join(inputDirectory, "sublime.scss"),
	mainSublimeStyles,
	{ overwrite: true }
);

fse.writeFileSync(
	path.join(outputDirectory, "package.json"),
	JSON.stringify({
		name:"@sublime",
		}),
	{ overwrite: true }
);

}

function readDirectoryAndCombineSync(directoryPath) {
	const path = require("path");
	let combinedString = '';

	// Read all files synchronously
	const files = fs.readdirSync(directoryPath);

	files.forEach(file => {
		const filePath = path.join(directoryPath, file);

		// Read file content synchronously
		const fileContent = fs.readFileSync(filePath, 'utf8');

		// Combine file contents
		combinedString += fileContent;
	});
	return combinedString;
}

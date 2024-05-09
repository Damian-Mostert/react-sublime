const prompt = async (msg) => {
	console.log(msg);
	return await new Promise((Resolve) => {
		process.stdin.on("data", (message) => {
			Resolve(message.toString());
		});
	});
};
const path = require("path");
//GLOBALS
const main = async () => {
	fs = require("fs");
	__m_dir = __dirname;
	__dirname = process.cwd();

	__config = {};
	try {
		__config = require(__dirname + "/sublime.config.json");
	} catch (e) {
		const inputDirectory = await prompt("Please enter your input directory");
		const outputDirectory = await prompt("Please enter your output directory");
		__config = { inputDirectory:inputDirectory.replace("\n",""), outputDirectory:outputDirectory.replace("\n","") };
		fs.writeFileSync(
			__dirname + "/sublime.config.json",
			JSON.stringify(__config, 4, null)
		);

		console.log("sublime config successfully made.");

		require("./init");
	}

	switch (process.argv[2]) {
		case "init":
			return require("./init");
		case "build":
			return require("./build");
				case "dev":
					return fs.watch(path.join(__dirname,__config.inputDirectory),()=>{
						require("./build")
						})
	}
};
main();

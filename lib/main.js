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
			return require("./build")();
				case "dev":
				dev()

	}
};
main();

function dev(){
  const chokidar = require('chokidar');

  // Directory to watch
  
  // Initialize watcher
  const watcher = chokidar.watch(__config.inputDirectory, {
    persistent: true,
    ignoreInitial: true, // Ignore initial files/folders scan
    ignored: /[\/\\]\./, // Ignore hidden files/folders
  });
  
  // Add event listeners
  watcher
    .on('add', (path) => console.log(`File ${path} has been added`))
    .on('change', (path) => console.log(`File ${path} has been changed`))
    .on('unlink', (path) => console.log(`File ${path} has been removed`))
    .on('addDir', (path) => console.log(`Directory ${path} has been added`))
    .on('unlinkDir', (path) => console.log(`Directory ${path} has been removed`))
    .on('error', (error) => console.error(`Watcher error: ${error}`));
  
  // Additional event for files/folders that don't match ignored patterns
  watcher.on('all', (event, path) => {
    require("./build")()
  });
  }
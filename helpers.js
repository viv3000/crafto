import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const glob = await import("glob")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function randomElem(arr) {
    let elem = Math.floor(Math.random() * arr.length);
    return arr[elem];
}

function getRandomHbsFile(folderPath) {
	try {
	  // Read all files in the folder
	  const files = fs.readdirSync(folderPath);
  
	  // Filter out only .hbs files
	  const hbsFiles = files.filter(file => path.extname(file) === '.hbs');
  
	  // Check if there are any .hbs files
	  if (hbsFiles.length === 0) {
		throw new Error('No .hbs files found in the specified folder.');
	  }
  
	  // Get a random index
	  const randomIndex = Math.floor(Math.random() * hbsFiles.length);
  
	  // Return the random .hbs file name
	  return hbsFiles[randomIndex];
	} catch (error) {
	  console.error('Error:', error.message);
	  return null;
	}
  }

let createPartials = async (namespace) => {
	//register partials
	let registerPartial = async (partialsDir) => {
		const files = await glob.glob(`${partialsDir}/**/*.hbs`, (er, files) => {return files})
		files.forEach(filePath => {
			const partialName = `${namespace}_${path.basename(filePath, '.hbs')}`;
			console.log(partialName)
			const partialContent = fs.readFileSync(filePath, 'utf8');
			handlebars.registerPartial(partialName, partialContent);
		});
	}
	const partialsDir = path.join(__dirname, 'views', 'partials', namespace);
	registerPartial(partialsDir)
}

let createHelpers = async () => {
	handlebars.registerHelper('contains', function (str, substr, options) {
		if (str && str.includes(substr)) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	handlebars.registerHelper('threeEach', function (context, options) {
		var ret = "";
		for (var i = 0, j = context.length; i < j; i+=3) {
			ret = ret + options.fn([context[i], context[i+1], context[i+2]]);
		}
		return ret;
	});
	handlebars.registerHelper('fourEach', function (context, options) {
		var ret = "";
		for (var i = 0, j = context.length; i < j; i+=4) {
			ret = ret + options.fn([context[i], context[i+1], context[i+2], context[i+3]]);
		}
		return ret;
	});
	handlebars.registerHelper('sixEach', function (context, options) {
		var ret = "";
		for (var i = 0, j = context.length; i < j; i+=6) {
			ret = ret + options.fn([context[i], context[i+1], context[i+2], context[i+3], context[i+4], context[i+5] ]);
		}
		return ret;
	});

	handlebars.registerHelper("getRandomAphoism", function(options) {
		return {"text": "He who fights with monsters should look to it that he himself does not become a monster.", "author": "Friedrich Nietzsche, German Philosopher"}
	})

	handlebars.registerHelper("isEqual", function(value1, value2) {
		// для helper if, т.к. он срабатывает если строка не пустая
		if (value1 == value2) {
			return "1"
		}else {
			return ""
		}
	})

	handlebars.registerHelper("include", function(file, options) {
		const folderPath = path.join(__dirname, 'views', file);
		const name = getRandomHbsFile(folderPath);

		if (!name) {
			console.log(options);
			throw new Error("Incorrect block include!");
		}

		const filePath = path.join(folderPath, name);
		const fileContent = fs.readFileSync(filePath, 'utf8');
		const template = handlebars.compile(fileContent, {
			explicitPartialContext: "./views/partials"
		});
  		return new handlebars.SafeString(template(options.data.root));
	});

}

export { createHelpers, createPartials }

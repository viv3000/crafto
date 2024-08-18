import express from 'express';
import exphbs from 'express-handlebars';
import handlebars from 'handlebars';
import fs from 'fs';
import { dirname } from 'path';
import path from "path"
import { fileURLToPath } from 'url';

import createHelpers from './helpers.js';

const app = express();


let port = parseInt(process.argv[2])


if (!port) port = 3003

app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: false }));
app.set('view engine', 'hbs');
app.set('views', './views');

// Register custom Handlebars helper


createHelpers();

let siteDirs = ['/blog1']


let siteMap = {
	'/':            '/index-page',
	'/index':       '/index-page',
	'/home':        '/index-page',
	'/blog':        '/blog-page',
	'/login':       '/account-page',
	'/contacts':    '/contacts-page',
	'/about':       '/about-page',
	'/single-post': '/single-post-page'
}
app.get('/', async(req,res) => {
	let context = {
		"request": req,
		"blog": JSON.parse(fs.readFileSync("blog.json"))
	}
	res.render('sites/index', context);
})

for (let dir of siteDirs ) {
	for (let [path, file] of Object.entries(siteMap)){
		app.get(dir+path, async(req,res) => {
			let context = {
				"request": req,
				"blog": JSON.parse(fs.readFileSync("blog.json"))
			}
			res.render('sites'+dir+file, context);
		})
	}
}

app.use(express.static(`./public`));


app.listen(port, () => {
    console.log(`Server launched on port: ${port}`);
})

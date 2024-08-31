import express from 'express';
import exphbs from 'express-handlebars';
import handlebars from 'handlebars';
import fs from 'fs';
import { dirname } from 'path';
import path from "path"
import { fileURLToPath } from 'url';

import { createHelpers, createPartials } from './helpers.js';

let startSite = async (name, port) => {
	while(true){
		createPartials(name);
		createHelpers()
		createPartials("common");

		const app = express();
	
		app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: false }));
		app.set('view engine', 'hbs');
		app.set('views', './views');
	
		let siteMap = {
			'/':            '/index-page',
			'/index':       '/index-page',
			'/home':        '/index-page',
			'/blog':        '/blog-page',
			'/news':        '/news-page',
			'/login':       '/account-page',
			'/contacts':    '/contacts-page',
			'/about':       '/about-page',
			'/single-post': '/single-post-page'
		}
		
		for (let [path, file] of Object.entries(siteMap)){
			app.get(path, async(req,res) => {
				let context = {
					"request": req,
					"blog": JSON.parse(fs.readFileSync("blog.json"))
				}
				res.render('sites/'+name+file, context);
			})
		}
	
		app.use(express.static(`./public`));
		let server = app.listen(port, () => {
				console.log(`Server launched on port: ${port}`);
		})
		
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		server.close(_=>console.log("Server close"))
	}
}

export { startSite }

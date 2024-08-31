import { startSite } from './common.js';

import { createHelpers, createPartials } from './helpers.js';


let port = parseInt(process.argv[2])
if (!port) port = 3003

let name = process.argv[3]

startSite(name, port)

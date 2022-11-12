/**
 * Project: LCIF Chart
 * Author: Josh Ibad
 *
 * Copyright © 2022 Josh Ibad, creator of ibad.one. All Rights Reserved.
 * 
 * Filename: /index.js
 * Description: Driver file for LCIF Chart.
 */
import path from 'path';

import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import EntryRouter from '#controller/EntryController.js'
import UserRouter from '#controller/UserController.js'
import AuthRouter from '#controller/AuthController.js'

const env = (process.env.NODE_ENV || '').trim()
const PORT_HTTP = 15010;
console.log(`Environment: ${env}`);

const corsConfig = {
	credentials: true,
	origin: true,
};


// Create app and use JSON middleware & CORS policiy
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsConfig));



// [===== Top-level routing =====]
app.use('/api/entry', EntryRouter);
app.use('/api/user', UserRouter);
app.use('/api/auth', AuthRouter);

//	Static files
['static', 'img', 'pdf'].forEach((dir)=>{
	app.use(`/${dir}`, express.static(`dist/${dir}`));
})

const staticRoutes = { };
['favicon.ico', 'logo192.png', 'logo512.png', 'manifest.json', 'robots.txt', 'index.html'].forEach((file)=>{
	staticRoutes[`/${file}`] = path.resolve(`dist/${file}`);
})
const defaultRoute = staticRoutes['/index.html'];

app.get('*', (req, res)=>{
	res.sendFile(staticRoutes[req.url] || defaultRoute);
});

const httpServer = http.createServer(app);
httpServer.listen(PORT_HTTP, '0.0.0.0', ()=>{
	console.log(`LCIF Chart HTTP Server running on port ${PORT_HTTP}`);
});
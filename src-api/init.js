/**
 * Project: ibad.one
 * Author: Josh Ibad
 *
 * Copyright © 2022 Josh Ibad, creator of ibad.one. All Rights Reserved.
 * 
 * Filename: /init.js
 * Description: Initialization script for ibad.one. Runs various clean-up, 
 *	obfuscation, build, and other tasks.
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import JSObfuscator from 'javascript-obfuscator';

const fileFormat = 'utf8';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const obfSourcePath = path.join(__dirname, 'private/obfuscate');
const obfTargetPath = path.join(__dirname, 'public/js');

/**
 * Walks through a directory path recursively
 * @param dir -- Directory to walk
 * @param callback -- Callback function to call on each node in directory
 */
function walkDir(dir, callback) {
	fs.readdirSync(dir).forEach( f => {
		let dirPath = path.join(dir, f);
		let isDirectory = fs.statSync(dirPath).isDirectory();
		isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
	});
}



/**
 * Cleans up files such as build files.
 */
function cleanup(){
	console.log('Cleaning files:');
	process.stdout.write(' + Cleaning obf files...');
	walkDir(obfTargetPath, (jsFile)=>{
		if(jsFile.includes('.obf.')){
			fs.rmSync(jsFile, {force: true});
		}
	});
	process.stdout.write(`[DONE]\n`);
}


/**
 * Obfuscate javascript files accordingly
 */
function obfuscateFiles(){
	console.log('Obfuscating files:');
	walkDir(obfSourcePath, (jsFile)=>{
		let relPath = path.relative(obfSourcePath, jsFile);
		process.stdout.write(` + ${relPath}...`);
		let jsBody = fs.readFileSync(jsFile, fileFormat);
		let jsObf = JSObfuscator.obfuscate(jsBody);
		let targetFile = path.join(obfTargetPath, relPath).toString().replace('.js', '.obf.js');
		fs.writeFileSync(targetFile,jsObf.getObfuscatedCode(),{encoding:fileFormat,flag:'w'});
		process.stdout.write(`[DONE]\n`);
	});
}


/**
 * Driver function
 */
(function (){
	cleanup();
	obfuscateFiles();
})();
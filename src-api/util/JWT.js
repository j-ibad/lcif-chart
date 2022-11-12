import jwt from 'jsonwebtoken';

import { createRequire } from "module";
const require = createRequire(import.meta.url)
const jwtConfig = require('#config/jwt.secret.json');

class JWT {
	constructor(){
		this.tokenName = jwtConfig.tokenName;
		this.maxAge = jwtConfig.maxAge;
	}
	
	generateToken(obj){
		return jwt.sign(obj, jwtConfig.secret, jwtConfig.signOptions);
	}
	
	decodeToken(token){
		try{
			return {token: jwt.verify(token, jwtConfig.secret, jwtConfig.verifyOptions)};
		}catch(e){
			return {error: e};
		}
	}
	
	validateRawCookie(cookie){
		if(cookie){
			let cookies = cookie.split(';');
			for(let i in cookies){
				let pair = cookies[i].split('=');
				if(pair[0].trim() === this.tokenName){
					let res = this.decodeToken(pair[1].trim());
					if(!('error' in res)){
						return res.token;
					}
				}
			}
		}
		return null;
	}
}

export default new JWT();
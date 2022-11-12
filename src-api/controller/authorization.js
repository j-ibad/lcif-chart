import JWT from '#util/JWT.js';

export default function validateJwtToken(req, res, next){
	const token = req.cookies && req.cookies[JWT.tokenName] || null;
	if(!token){ return res.sendStatus(403); }
	const data = JWT.decodeToken(token);
	if('error' in data){ return res.sendStatus(403); }
	req.user = data?.token?.user;
	return next();
}
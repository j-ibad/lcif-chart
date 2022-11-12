import express from 'express';
import User from '#model/User.js';
import JWT from '#util/JWT.js';

const router = express.Router();

router.post('/login', (req, res)=>{
	const results = User.checkPassword(req.body, (err, results, fields)=>{
		if(err) {
			res.json({status: false, msg: `An error has occured: ${err}`});
			return;
		}
		if(!Array.isArray(results) || results.length <= 0){
			res.json({status: false, msg: `User '${req.body.username}' does not exist.`});
			return;
		}
		const user = results[0];
		let token = JWT.generateToken({user});
		res.cookie(JWT.tokenName, token, {
			httpOnly: true,
			secure: (process.env.NODE_ENV || '').trim() !== 'development',
			maxAge: JWT.maxAge
		});
		res.cookie("lcif_session", user, {
			secure: (process.env.NODE_ENV || '').trim() !== 'development',
			maxAge: JWT.maxAge
		});
		res.json({status: true, msg: 'Logged in successfully. Redirecting to app...'});
	});
});


router.post('/register', (req, res)=>{
	const results = User.insert(req.body, (err, results, fields)=>{
		if(err) {
			res.json({status: false, msg: `An error has occured: ${err}`});
			return;
		}
		if(results.affectedRows <= 0){
			res.json({status: false, msg: `The user '${req.body.username}' already exists.`});
			return;
		}else{
			res.json({status: true, msg: 'Your registration was successful! Feel free to log in :)'});
		}
	});
});


router.post('/logout', (req, res)=>{
	res.clearCookie(JWT.tokenName);
	res.clearCookie("lcif_session");
	return res.status(200).json({status: true, msg: "Successfully logged out"});
});

export default router;
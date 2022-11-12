import express from 'express';
import User from '#model/User.js';
import authorization from '#controller/authorization.js';

const router = express.Router();
router.use(authorization);

router.post('/update', (req, res)=>{
	const results = User.update(req.body, (err, results, fields)=>{
		if(err) {
			// TODO: Throw error
		}
		// TODO: Process results
		res.json(results);
	});
});


router.post('/delete', (req, res)=>{
	let uid = 0;
	const results = User.delete(uid, (err, results, fields)=>{
		if(err) {
			// TODO: Throw error
		}
		// TODO: Process results
		res.json(results);
	});
});

export default router;
import express from 'express';
import Entry from '#model/Entry.js';
import authorization from '#controller/authorization.js';

const router = express.Router();
router.use(authorization);

router.post('/getEntries', (req, res)=>{
	const results = Entry.get(Object.assign(req.body, {uid: req?.user?.id}), (err, results, fields)=>{
		if(err) {
			res.json({status: false, msg: `An error has occured: ${err}`});
			return;
		}
		// TODO: Process results
		res.json({entries: results});
	});
});


router.post('/upsert', (req, res)=>{
	let formData = Object.assign(req.body, {uid: req?.user?.id});
	if(formData.orig_date === ''){
		const results = Entry.insert(formData, (err, results, fields)=>{
			if(err) {
				res.json({status: false, msg: `An error has occured: ${err}`});
				return;
			}
			if(results.affectedRows <= 0){
				res.json({status: false, msg: `The data inputted is invalid, please check to see if times are not duplicated and if values inputted are valid.`});
			}else{
				res.json({status: true, msg: 'Entry added successfully'});
			}
		});
	}else{
		const results = Entry.update(formData, (err, results, fields)=>{
			if(err) {
				res.json({status: false, msg: `An error has occured: ${err}`});
				return;
			}
			if(results.affectedRows <= 0){
				res.json({status: false, msg: `The data inputted is invalid, please check to see if times are not duplicated and if values inputted are valid.`});
			}else{
				res.json({status: true, msg: 'Entry updated successfully'});
			}
		});
	}
})


router.post('/delete', (req, res)=>{
	let formData = Object.assign(req.body, {uid: req?.user?.id});
	const results = Entry.delete(formData, (err, results, fields)=>{
		if(err) {
			res.json({status: false, msg: `An error has occured: ${err}`});
			return;
		}
		if(results.affectedRows <= 0){
			res.json({status: false, msg: `The data inputted is invalid, please check to see if times are not duplicated and if values inputted are valid.`});
		}else{
			res.json({status: true, msg: 'Entry deleted successfully'});
		}
	});
});

export default router;
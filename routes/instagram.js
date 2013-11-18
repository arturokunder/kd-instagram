/*
 * GET instagram endpoint.
 */

exports.endpoint = function(req, res){
	console.log(req.query['hub.verify_token']);
	console.log(req.query['hub.verify_token'] === '56231201');
	if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === '56231201') {
		res.send(req.query['hub.challenge']);
	}
	
	res.send('bad token');
};
/*
 * GET instagram endpoint.
 */

exports.endpoint = function(req, res){
	if(req.query['hub.mode'] === 'suscribe'&& req.query['hub.challenge'] && req.query['hub.verify_token'] === '56231201') {
		res.send(req.query['hub.challenge']);
	}
};
/*
 * GET instagram endpoint.
 */

var settings = global.settings;
var db = global.mongodb;

var tags = db.collection('tags');
var posts = db.collection('posts');

var instagram_lib = global.instagram_lib;

exports.endpoint = function(req, res){
	if(req.originalMethod === 'GET') {
		if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === '56231201') {
			res.send(req.query['hub.challenge']);
		}
	}
	else if(req.originalMethod === 'POST') {
		//process message
		console.log(req.body);
		res.send(200);
	}
	
	res.send('bad token');
};
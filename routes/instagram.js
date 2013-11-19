/*
 * GET instagram endpoint.
 */

var settings = global.settings;
var db = global.mongodb;

var tagsDB = db.collection('tags');
var postsDB = db.collection('posts');

var instagram_lib = global.instagram_lib;

exports.endpoint = function(req, res){
	if(req.originalMethod === 'GET') {
		if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === '56231201') {
			res.send(req.query['hub.challenge']);
		}
	}
	else if(req.originalMethod === 'POST') {
		//process message
		console.log('------Post recibido-------');
		res.send(200);
		var result = req.body;
		setTimeout(function() {
			_insertPosts(result);
		}, 1);
	}
	
	res.send('bad token');
};

function _insertPosts(result) {
	if(Array.isArray(result)) {
		
		var updated = [];
		for(var i = 0; i < result.length; i++) {
			if(result[i].object_id && updated.indexOf(result[i].object_id) < 0) {
				updated.push(result[i].object_id);
			}
		}
		
		for(var i = 0; i < updated.length; i++) {
			var posts = instagram_lib.tags.recent({
				name : updated[i]
			});
			
			if(posts.data) {
				for(var j = 0; j < posts.data.length; j++) {
					postsDB.update({ id : posts[j].id }, posts[j], { upsert : true}, _errorOnInserting);
				}
			}
		}
	}
}

function _errorOnInserting(err, res) {
	if(err) {
		console.log('-----error------');
		console.log(error);
	}
}
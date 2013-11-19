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
		res.send(200);
		var result = req.body;
		console.log(result);
		setTimeout(function() {
			_insertPosts(result);
		}, 1);
	}
	
	res.send('bad token');
};

function _insertPosts(result) {
	if(result && result.meta && result.meta.code == 200 && result.data) {
		
		var updated = [];
		for(var i = 0; i < result.data.length; i++) {
			if(updated.indexOf(result.data[i].object_id) < 0) {
				updated.push(result.data[i].object_id);
			}
		}
		
		for(var i = 0; i < updated.length; i++) {
			var posts = instagram_lib.tags.recent({
				name : updated[i]
			});
			
			for(var j = 0; j < posts.data.length; j++) {
				postsDB.update({ id : posts[j].id }, posts[j], { upsert : true}, _errorOnInserting);
			}
		}
	}
}

function _errorOnInserting(error) {
	console.log(error);
}
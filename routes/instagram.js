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
		else {
			/*var result = [{
				object_id : 'nofilter'
			}];
			setTimeout(function() {
				_insertPosts(result);
			}, 1);*/
		}
	}
	else if(req.originalMethod === 'POST') {
		//process message
		res.send(200);
		setTimeout(function() {
			_insertPosts(req.body);
		}, 1);
	}
	
	res.send('bad token');
};

var requests = {};

function _insertPosts(result) {
	console.log('request');
	if(Array.isArray(result)) {
		
		var updated = [];
		for(var i = 0; i < result.length; i++) {
			if(result[i].object_id && updated.indexOf(result[i].object_id) < 0) {
				updated.push(result[i].object_id);
			}
		}
		
		for(var i = 0; i < updated.length; i++) {
			var tag = updated[i] + '';
			var now = new Date();
			//if y timeout para evitar muchos requests por segundo
			if(!requests[tag] || requests[tag].last_request < now) {
				var next = new Date();
				next.setSeconds(now.getSeconds() + 3);
				requests[tag] = {
						tag : tag,
						last_request : next
				};
				
				setTimeout(function() {
					console.log('fetch');
					instagram_lib.tags.recent({
						name : tag,
						complete : function(posts, pagination) {
							console.log('fetch-completed');
							if(posts) {
								for(var j = 0; j < posts.length; j++) {
									postsDB.update({ id : posts[j].id }, posts[j], { upsert : true }, _errorOnInserting);
								}
							}
						},
						error : function(message, object, caller) {
							console.log(message);
						}
					});
				}, 3*1000);
			}
		}
	}
}

function _errorOnInserting(err, res) {
	if(err) {
		console.log(err);
	}
}
/*
 * GET instagram endpoint.
 */

var settings = global.settings;
var db = global.mongodb;

var tagsDB = db.collection('tags');
var postsDB = db.collection('posts');

var instagram_lib = global.instagram_lib;


exports.registerSavedTags = function() {
	instagram_lib.subscriptions.unsubscribe({ object : 'all' });
	
	tagsDB.find(function(err, docs) {
		if(!err && docs) {
			var completed = function() {};
			for(var i = 0; i < docs.length; i++) {
				instagram_lib.tags.subscribe({
					object_id : docs[i].tag,
					callback_url : 'http://glacial-sands-1133.herokuapp.com/instagram/endpoint',
					verify_token : '56231201',
					complete : completed
				});
			}
		}
	});
};

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
		if (req.rawBody === null || req.headers['x-hub-signature'] === void 0 || req.headers['x-hub-signature'] === null) {
			res.send(403);
			return;
			//TODO: verify sender
		}
		
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
			//se hace un delay de 5 segs por request de cada tag o hasta que pase el limite de 15 posts
			if(!requests[tag] || requests[tag].last_request < now || requests[tag].requests > 15 ) {
				console.log('fetch');
				var next = new Date();
				next.setSeconds(now.getSeconds() + 5);
				requests[tag] = {
						tag : tag,
						last_request : next,
						requests : 0
					};
				
				setTimeout(function() {
					
					instagram_lib.tags.recent({
						name : tag,
						complete : function(posts, pagination) {
							console.log('fetch-completed');
							if(posts) {
								for(var j = 0; j < posts.length; j++) {
									posts[j].received_at = new Date();
									postsDB.update({ id : posts[j].id }, posts[j], { upsert : true }, _completedDB);
								}
							}
							else {
								console.log('no posts after fetch');
							}
						},
						error : function(message, object, caller) {
							console.log(message);
						}
					});
				}, 3*1000);
			}
			else if(requests[tag]) {
				requests[tag].requests = requests[tag].requests + 1;
			}
		}
	}
}

function _completedDB(err, res) {
	if(err) {
		console.log(err);
	}
}
var settings = global.settings;
var db = global.mongodb;

var tags = db.collection('tags');
var posts = db.collection('posts');

var instagram = require('./instagram');
var instagram_lib = global.instagram_lib;

exports.addTag = function(req, res) {
	if (!req.xhr || !req.body.tag) { res.send('{ "DEBUG" : "BAD REQUEST"}'); }
	
	tags.update({ tag : req.body.tag },
		{
			tag : req.body.tag,
			inserted : new Date()
		},{ upsert : true },
		function(err, doc) {
			if(err) {
				res.send({ success : false});
			}
			else {
				instagram.registerSavedTags();
				tags.findOne({ tag : req.body.tag }, function(err2, doc2) {
					if(err2) {
						res.send({ success : false});
					}
					else {
						res.send({ success : true, tag : doc2,  });
					}
				});
			}
		});
};

exports.removeTag = function(req, res) {
	if (!req.xhr || !req.body.id) { res.send('{ "DEBUG" : "BAD REQUEST"}'); }
	tags.remove({ _id : global.mongojs.ObjectId(req.body.id) }, { single : true }, function(err, doc) {
		if(err) {
			res.send({ success : false});
		}
		else {
			instagram.registerSavedTags();
			res.send({ success : true });
		}
	});
};

exports.getNewPostsCount = function(req, res) {
	posts.count({ _id : { '$gt' : global.mongojs.ObjectId(req.body.id) }}, function(err, doc) {
		if(err) {
			res.send({ success : false});
		}
		else {
			res.send({ success : true, count : doc });
		}
	});
};

function _completedDB(err, res) {
	if(err) {
		console.log(err);
	}
}
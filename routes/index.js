
/*
 * GET home page.
 */
var settings = global.settings;
var db = global.mongodb;

var tagsDB = db.collection('tags');
var postsDB = db.collection('posts');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.posts = function(req, res) {
	postsDB.find().sort({ created_time : -1 }).limit(30, function(err, docs){
		if(!err) {
			res.render('posts', { posts: docs });
		}
	});
	
}

exports.config = function(req, res) {
	tagsDB.find().sort({ tag : 1 }, function(err, docs){
		if(!err && docs){
			res.render('config', { tags : docs });
		}
	});
};
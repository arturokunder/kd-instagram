
/*
 * GET home page.
 */
var settings = global.settings;
var db = global.mongodb;

var tagsDB = db.collection('tags');
var postsDB = db.collection('posts');

exports.index = function(req, res){
	s = postsDB.aggregate([{ '$project' : { '_id' : 1, 'created_at' : Date('$created_time' * 1000) } },  
                             { '$group': { '_id': { '$dayOfYear': '$created_at' },'posts': { '$sum': 1 } } }]);
	
	console.log(s);
	
	
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
	tagsDB.find().sort({ tag : -1 }, function(err, docs){
		if(!err && docs){
			res.render('config', { tags : docs });
		}
	});
};
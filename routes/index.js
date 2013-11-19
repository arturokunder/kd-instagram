
/*
 * GET home page.
 */
var settings = global.settings;
var db = global.mongodb;

var tags = db.collection('tags');
var posts = db.collection('posts');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.config = function(req, res) {
	
	
	res.render('config');
};
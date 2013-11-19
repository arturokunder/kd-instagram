var settings = global.settings;
var db = global.mongodb;

var tags = db.collection('tags');
var posts = db.collection('posts');

var instagram_lib = global.instagram_lib;

exports.addTag = function(req, res) {
	if (!req.xhr) { res.send('{ "DEBUG" : "BAD REQUEST"}'); }

	instagram_lib.tags.subscribe({
		object_id : req.body.tag,
		callback_url : 'http://glacial-sands-1133.herokuapp.com/instagram/endpoint',
		verify_token : '56231201',
		complete : function() {
			tags.update(
			{
				tag : req.body.tag
			},
			{
				tag : req.body.tag,
				inserted : new Date()
			},
			{
				upsert : true
			}, _completedDB);
			res.send({ success : true});
		}
	});
};

function _completedDB(err, res) {
	if(err) {
		console.log(err);
	}
}
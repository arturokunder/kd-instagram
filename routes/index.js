
/*
 * GET home page.
 */
var settings = global.settings;
var db = global.mongodb;

var tagsDB = db.collection('tags');
var postsDB = db.collection('posts');

exports.index = function(req, res){
	postsDB.aggregate([
	                         { '$project' : { '_id' : 1, 'created_at' : { '$add' : ['$created_time', -10800000] } } },
                             { '$group': { '_id': { 'year' : { '$year' : '$created_at'}, 'day' : {'$dayOfYear': '$created_at' }},'posts': { '$sum': 1 } } },
	                         { '$sort' : { '_id.year' : 1, '_id.day' : 1 } }
	                         ],
        function(err, doc) {
			res.render('index', { postByDay: _dayCorrection(doc) });
		});
};

exports.posts = function(req, res) {
	postsDB.find().sort({ created_time : -1 }).limit(30, function(err, docs){
		if(!err) {
			res.render('posts', { posts: docs });
		}
	});
	
};

exports.config = function(req, res) {
	tagsDB.find().sort({ tag : -1 }, function(err, docs){
		if(!err && docs){
			res.render('config', { tags : docs });
		}
	});
};

function _dayCorrection(data) {
	var results = [];
	
	var last_day = new Date(Date.UTC(1970, 0, 1));
	var first_day = new Date();
	
	var index = {};
	for(var i = 0; i < data.length; i++) {
		var key = new Date(Date.UTC(1970, 0, 1));
		key.setUTCFullYear(data[i]._id.year);
		key.setUTCMonth(0);
		key.setUTCDate(key.getUTCDate() + data[i]._id.day);
		index[key] = data[i].posts;
		
		if(key > last_day) {
			last_day = key;
		}
		if(key < first_day) {
			first_day = key;
		}
	}
	console.log(first_day);
	var daysBetween = Math.round((last_day - first_day) / (24*60*60*1000)) + 2;

	for(var j = 0; j < daysBetween; j++) {
		var day = new Date(Date.UTC(first_day.getUTCFullYear(), first_day.getUTCMonth(), first_day.getUTCDate()));
		day.setUTCDate(day.getUTCDate() + j);
		
		if(index[day]) {
			results.push({
				date : day,
				posts : index[day]
			});
		}
		else {
			results.push({
				date : day,
				posts : 0
			});
		}
	}
    
	return results;
}
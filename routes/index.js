
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
			postsDB.count(function(err2, count) {
				
				postsDB.aggregate([
			                         { '$project' : { '_id' : 1, 'user.id' : 1, 'user.username' : 1, 'user.full_name' : 1, 'user.profile_picture' : 1 } },
		                             { '$group': { '_id': {'id' : '$user.id', 'username' : '$user.username', 'full_name' : '$user.full_name', 'picture' : '$user.profile_picture' }, 'posts': { '$sum': 1 } } },
			                         { '$sort' : { 'posts' : -1 } },
			                         { '$limit' : 10 }
			                         ],
		        function(err3, doc3) {
					res.render('index', { title : 'index', postByDay: _dayCorrection(doc), count : count, most_active : doc3 });
				});
			});
			
		});
};

exports.posts = function(req, res) {
	var query = {};
	if(req.params.last) {
		query._id = {
			'$lt' : global.mongojs.ObjectId(req.params.last)
		};
	}
	
	postsDB.find(query).sort({ created_time : -1 }).limit(30, function(err, docs){
		if(!err) {
			var first_object = 0;
			var last_object = 0;
			
			if(docs.length > 0) {
				first_object = docs[0]._id;
				last_object = docs[0]._id;
				
				console.log(first_object);
				for(var i = 0; i < docs.length; i++) {
					var object = docs[i]._id;

					if(first_object > object) {
						first_object = object;
					}
					if(last_object < object) {
						last_object = object;
					}
				}
			}
			res.render('posts', { title : 'posts', posts: docs, first_object : first_object, last_object : last_object  });
		}
	});
	
};

exports.map = function(req, res) {
	postsDB.find(
			{ location : { '$ne' : null }},
			{ 'location' : 1 })
			.sort({ created_time : -1 })
			.limit(10000, function(err, docs){
		if(!err) {
			res.render('map', { title : 'map', posts: docs  });
		}
	});
};

exports.config = function(req, res) {
    tagsDB.find().sort({ tag : -1 }, function(err, docs){
        if(!err && docs){
                res.render('config', { title : 'config', tags : docs });
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
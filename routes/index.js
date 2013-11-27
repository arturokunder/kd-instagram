
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
				res.render('index', { title : 'index', postByDay: _dayCorrection(doc), count : count });
			});
			
		});
};

exports.posts = function(req, res) {
	postsDB.find().sort({ created_time : -1 }).limit(30, function(err, docs){
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
	var now = new Date();
	var limit = 1;
	postsDB.find(
			{ location : { '$ne' : null }},
			{ 'location' : 1 })
			.sort({ created_time : -1 })
			.limit(limit, function(err, docs){
		if(!err) {
			var end = new Date();
			console.log('1 dato : ' + (end - start) + 'ms');
		}
	});
	
	var now = new Date();
	var limit = 100;
	postsDB.find(
			{ location : { '$ne' : null }},
			{ 'location' : 1 })
			.sort({ created_time : -1 })
			.limit(limit, function(err, docs){
		if(!err) {
			var end = new Date();
			console.log('100 datos : ' + (end - start) + 'ms');
		}
	});
	
	var start = new Date();
	var limit = 1000;
	postsDB.find(
			{ location : { '$ne' : null }},
			{ 'location' : 1 })
			.sort({ created_time : -1 })
			.limit(limit, function(err, docs){
		if(!err) {
			var end = new Date();
			console.log('1.000 datos : ' + (end - start) + 'ms');
		}
	});
	
	var start = new Date();
	var limit = 5000;
	postsDB.find(
			{ location : { '$ne' : null }},
			{ 'location' : 1 })
			.sort({ created_time : -1 })
			.limit(limit, function(err, docs){
		if(!err) {
			var end = new Date();
			console.log('5.000 datos : ' + (end - start) + 'ms');
		}
	});
	
	var start = new Date();
	var limit = 10000;
	postsDB.find(
			{ location : { '$ne' : null }},
			{ 'location' : 1 })
			.sort({ created_time : -1 })
			.limit(limit, function(err, docs){
		if(!err) {
			var end = new Date();
			console.log('10.000 datos : ' + (end - start) + 'ms');
		}
	});
	
	var start = new Date();
	var limit = 28000;
	postsDB.find(
			{ location : { '$ne' : null }},
			{ 'location' : 1 })
			.sort({ created_time : -1 })
			.limit(limit, function(err, docs){
		if(!err) {
			var end = new Date();
			console.log('28.000 datos : ' + (end - start) + 'ms');
		}
	});
	
	
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
	postsDB.find().sort({ created_time : -1 }).limit(30, function(err, docs){
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

/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	path = require('path'),
	mongojs = require('mongojs');

var app = express();

var settings = global.settings = require('config');
var db;
if (process.env.MONGOLAB_URI) {
  db = global.mongodb = mongojs(process.env.MONGOLAB_URI);
} else {
  db = global.mongodb = mongojs('mongodb://' + settings.mongodb.user + ':' + settings.mongodb.password + "@" + settings.mongodb.url);
}

var instagram_lib = global.instagram_lib = require('instagram-node-lib');
if(process.env.instagram && process.env.instagram.client_id && process.env.instagram.client_secret) {
	instagram_lib.set('client_id', process.env.instagram.client_id);
	instagram_lib.set('client_secret', process.env.instagram.client_secret);
}
else {
	instagram_lib.set('client_id', settings.instagram.client_id);
	instagram_lib.set('client_secret', settings.instagram.client_secret);
}

instagram_lib.subscriptions.unsubscribe({ object : 'all' });
instagram_lib.tags.subscribe({
	object_id : 'style',
	callback_url : 'http://glacial-sands-1133.herokuapp.com/instagram/endpoint',
	verify_token : '56231201'
});

var routes = require('./routes'),
	ajax = require('./routes/ajax'),
	instagram = require('./routes/instagram');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//WEB
app.get('/', routes.index);
app.get('/config', routes.config);

//AJAX
app.post('/ajax/config/addTag', ajax.addTag);

//Instagram endpoints
app.get('/instagram/endpoint', instagram.endpoint);
app.post('/instagram/endpoint', instagram.endpoint);




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

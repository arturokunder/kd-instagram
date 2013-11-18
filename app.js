
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	instagram = require('./routes/instagram'),
	http = require('http'),
	path = require('path');

var request = require('request');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/instagram/endpoint', instagram.endpoint);

var options = {
	'client_id' : '2113c38b9e7c4a6b925ab5f9ccd6c58b',
	'client_secret' : '0ab14762ddde44e4914efde236764536',
	'object' : 'tag',
	'aspect' : 'media',
	'object_id' : 'nofilter',
	'verify_token' : '56231201',  //client defined
	'callback_url' : 'http://glacial-sands-1133.herokuapp.com/instagram/endpoint'
};

request({
	url : 'https://api.instagram.com/v1/subscriptions/',
	method : 'POST',
	form : options
}, function(error, response, body) {
	console.log(body);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

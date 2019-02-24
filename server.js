//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
	io = require('socket.io'),
	fs = require('fs');
	
var http = require('http').Server(app);

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
	
var count = 0;
var people_hash = {};
var image_file = JSON.parse(fs.readFileSync("data1.json","utf8"));

var rate = 1000;
var width = 20;
var height = 20;
var x_offset = 0;
var y_offset = 0;

var used = 0;
var used_y = {};
var pixels = [[],[],[]];

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function withinBounds(locat){
		if(locat.x < width && locat.y < height){
				return true;
		}
		console.log("A");
		return false;
	}

function seatInUse(locat){
	return (used[locat.x][locat.y]);
}
function isSeatValid(locat){
	if(isNumeric(locat.x) && isNumeric(locat.y) && withinBounds(locat) && !seatInUse(locat)){
		return true;
	}
	return false;
}

function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function initial(){
	rate = image_file.meta.rate;
	width = image_file.meta.width;
	height = image_file.meta.height;
	x_offset = image_file.meta.topleft.x;
	y_offset = image_file.meta.topleft.y;
	pixels = zeros([height,width]);
	used = zeros([height,width]);
	console.log(width);
	for(var i = 0; i < width*height; i++){
		pixels[i%width][Math.floor(i/width)] = image_file.pixels[i];
		used[i%width][Math.floor(i/width)] = false;
	}
}
initial();


app.get('/', function (req, res) {
    res.render('index.html');
});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});
/*
initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});
*/
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;

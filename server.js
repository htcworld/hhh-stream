// initialize dependencies
var express = require('express');
var bodyParser = require('body-parser');
var http = require("http");
var socket = require("socket.io");
var spawn = require('child_process').spawn;

var app  = express();
var portNumber = process.env.PORT || 9000;
app.set("port", portNumber);

// start server
var server = http.createServer(app).listen(app.get('port'), function(req, res){
    console.log("Express server listening on port " + app.get('port'));	
});

// bind socket to server
var io = socket.listen(server);
//var io = socket.listen(server, {transports:['websocket']});

io.on('connection', function (socket) {
  
    console.log('Socket connected: '+socket);	
	io.sockets.emit('msgFromAdmin', 'Hello client, this message sent from admin');
	// call our main handler 
	streamer(socket);

});	

/*
initializes ffmpeg child process which will listen on udp port:33333 for incoming frames of stream
forward video stream to client.html through socket.io
*/
var streamer = function (socket) {	
	
	var ffmpeg = require('child_process').spawn("ffmpeg-source/ffmpeg", ["-re", "-i", "assets/input.mp4", "-c:v", "libx264", "-preset", "superfast", "-tune", "zerolatency", "-c:a", "aac", "-ar", "44100", "-f", "flv", "rtmp://hhh-rtmp.herokuapp.com:1935/live/test_stream.flv" ]);
	
	ffmpeg.on('error', function (err) {
		console.log(err);
	});

	ffmpeg.on('close', function (code) {
		console.log('ffmpeg exited with code ' + code);
	});

	ffmpeg.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	ffmpeg.stdout.on('data', function (data) {
		
		var frame = new Buffer(data).toString('base64');
		socket.emit('render',frame);
	});

};


// initialize dependencies
var http = require("http");
var spawn = require('child_process').spawn;
// start server
	
	var ffmpeg = require('child_process').spawn("ffmpeg-source/ffmpeg", ["-re", "-i", "assets/input.mp4", "-c:v", "libx264", "-preset", "superfast", "-tune", "zerolatency", "-c:a", "aac", "-ar", "44100", "-f", "flv", "rtmp://streamroom.herokuapp.com:1935/live/test_stream.flv" ]);
	
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



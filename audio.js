var mic = require('mic');
var fs = require('fs');
var request = require('request');
var reload = require('require-reload')(require);


var asr = null;

var micInstance = mic({ 'rate': '16000',
			'channels': 1,
			'device':'hw:0,0',
			'debug': true,
			'exitOnSilence': 10
		      })
    var micInputStream = micInstance.getAudioStream();
    
    micInputStream.on('data', function(data) {
	console.log("Recieved Input Stream: " + data.length);
	asr.strm(new Buffer(data, 'binary'));
    });

    micInputStream.on('error', function(err) {
	console.log("Error in Input Stream: " + err);
    });

    micInputStream.on('startComplete', function() {
	asr = reload("./VOICE_SERVER/app.js")
    });

    micInputStream.on('stopComplete', function() {
	console.log("Got SIGNAL stopComplete");
    });

    micInputStream.on('pauseComplete', function() {
	console.log("Got SIGNAL pauseComplete");
    });

    micInputStream.on('resumeComplete', function() {
	console.log("Got SIGNAL resumeComplete");
    });

    micInputStream.on('silence', function() {
	console.log('SILENCE');
    });

    micInputStream.on('processExitComplete', function() {
	console.log("Got SIGNAL processExitComplete");
    });
    micInstance.start();
// STOP WHEN asr.lastMsg() IS THE SAME TO LOONG



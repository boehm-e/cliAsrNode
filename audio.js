var mic = require('mic');
var fs = require('fs');
var request = require('request');
var reload = require('require-reload')(require);


var asr = null;

exports.init = function() {
    var micInstance = mic({ 'rate': '16000', 'channels': '1', 'debug': true, 'exitOnSilence': 10 })
    var micInputStream = micInstance.getAudioStream();
    
    micInputStream.on('data', function(data) {
	console.log("Recieved Input Stream: " + data.length);
	asr.strm(new Buffer(data, 'binary'));
    });

    micInputStream.on('error', function(err) {
	console.log("Error in Input Stream: " + err);
    });

    micInputStream.on('startComplete', function() {
	console.log("Got SIGNAL startComplete");
	asr = reload("./VOICE_SERVER/app.js")
    });

    micInputStream.on('stopComplete', function() {
	console.log("Got SIGNAL stopComplete");
    });

    micInputStream.on('pauseComplete', function() {
	console.log("Got SIGNAL pauseComplete");
	setTimeout(function() {
	    micInstance.resume();
	}, 5000);
    });

    micInputStream.on('resumeComplete', function() {
	console.log("Got SIGNAL resumeComplete");
	setTimeout(function() {
	    micInstance.stop();
	}, 5000);
    });

    micInputStream.on('silence', function() {
	setTimeout(function() {
	    var req = {
		q: asr.lastMsg()
	    }
	    request.post({
		url:     'http://localhost:3000/answer',
		form:    req
	    });

	    micInstance.stop()
	    console.log("Got SIGNAL silence");
	}, 1500)
    });

    micInputStream.on('processExitComplete', function() {
	console.log("Got SIGNAL processExitComplete");
    });
    exports.micInstance= micInstance;
}
    //micInstance.start();
// STOP WHEN asr.lastMsg() IS THE SAME TO LOONG

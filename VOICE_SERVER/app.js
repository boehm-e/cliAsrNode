'use strict';


//start google fr-FR audio/l16;rate=44100'

console.log("MODULE CLLED");


var asr;
asr = require('./asr/google/');
asr.on('data', function (data) {
//    console.log(JSON.stringify(data));
    try {
	console.log("CLIENT : "+data.message.result[0].alternative[0].transcript);
    } catch(e) {

    }

});
asr.on('error', function (error) {
    console.log(error);
});
asr.setLanguage('fr-FR');
asr.setContentType('audio/l16;rate=16000');
asr.initialize();
asr.authorization();


var strm = function(data) {
//    console.log(data);
    if (typeof data === 'string' && data.indexOf('start') !== -1) {

    } else {
//	console.log(typeof data);
	asr.stream(data);
    }
}

exports.strm = strm;

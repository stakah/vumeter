// const { default: Renderer } = require("./renderer");
import Renderer from "./renderer.js";
import VUmeter from "./modules/vumeter.js";

const renderer = new Renderer()

window.api.receive('from-example-ch', (data) => {
    switch (data) {
        case "example1":
            if (renderer.isExampleVisible("example1")) {
                renderer.hideExample("example1"); 
            }
            else {
                renderer.setupExample1();
                renderer.showExample("example1")
            }
        break;
        case "example2":if (renderer.isExampleVisible("example2")) renderer.hideExample("example2"); else renderer.showExample("example2")
        break;
        case "example3":if (renderer.isExampleVisible("example3")) renderer.hideExample("example3"); else renderer.showExample("example3")
        break;
        case "example4":if (renderer.isExampleVisible("example4")) renderer.hideExample("example4"); else renderer.showExample("example4")
        break;
    }
})

navigator.getUserMedia = navigator.getUserMedia
                       || navigator.webkitGetUserMedia
                       || navigator.mozGetUserMedia;


function callback(stream) {
    var ctx = new AudioContext();
    var mic = ctx.createMediaStreamSource(stream);
    var splitter = ctx.createChannelSplitter();
    var analyserL = ctx.createAnalyser();
    var analyserR = ctx.createAnalyser();

    var audioTrack=stream.getAudioTracks();
    var audioStreamTrackName = audioTrack[0].label;
    var audioStreamTrackType = audioTrack[0].kind;
    console.log('onMediaStream: getAudioTracks:[0] label:'+ audioStreamTrackName +' kind:'+ audioStreamTrackType);
    
    mic.connect(splitter);
    mic.channelInterpretation = 'discrete';
    splitter.connect(analyserL, 0);
    splitter.connect(analyserR, 1);
    console.log('mic.channelInterpretation:' + mic.channelInterpretation);
    console.log('splitter.channelInterpretation:' + splitter.channelInterpretation);
    console.log('analyserL.channelInterpretation:' + analyserL.channelInterpretation +
    ' analyserR.channelInterpretation:' + analyserR.channelInterpretation);

    var dataL = new Uint8Array(analyserL.frequencyBinCount);
    var dataR = new Uint8Array(analyserR.frequencyBinCount);

    var volumeL = 0;
    var volumeR = 0;
    const averaging = 0.95;

    function play() {
        analyserL.getByteFrequencyData(dataL);
        analyserR.getByteFrequencyData(dataR);

        const rmsVolumeL = VUmeter.getRMSVolume(analyserL.frequencyBinCount, dataL);
        const rmsVolumeR = VUmeter.getRMSVolume(analyserR.frequencyBinCount, dataR);

        volumeL = VUmeter.getSmoothRMSVolume(volumeL, averaging, rmsVolumeL);
        volumeR = VUmeter.getSmoothRMSVolume(volumeR, averaging, rmsVolumeR);

        const fullFreqL = VUmeter.getFullestFrequency(analyserL.frequencyBinCount, dataL, ctx.sampleRate, analyserL.fftSize);
        const fullFreqR = VUmeter.getFullestFrequency(analyserR.frequencyBinCount, dataR, ctx.sampleRate, analyserR.fftSize);

        renderer.drawExample1(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, fullFreqL, fullFreqR);
        renderer.drawExample2(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR);
        renderer.drawExample3(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR);
        renderer.drawExample4(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR);

        requestAnimationFrame(play);
    }

    play();
}

function gotStream() {
    console.log('getUserMedia:gotStream');
}
function gotStreamFailed(err) {
    console.log('getUserMedia:gotStreamFailed', err);
}

window.onload = function() {
    const elFreqL = document.getElementById('freqL');
    renderer.setup()

    console.log(elFreqL);
    var constraints = {
        audio: { 
            mandatory: { 
                echoCancellation : false, 
                googAudioMirroring: false 
            } 
        },
        video: false
    };
    // getUserMedia(constraints, gotStream, gotStreamFailed);


    navigator.getUserMedia(constraints, callback, gotStreamFailed);

}

window.onresize = function() {
    renderer.setupExample1()
    renderer.setupExample2()
    renderer.setupExample3()
    renderer.setupExample4()
}
import Renderer from "./renderer.js";
import VUmeter from "./modules/vumeter.js";

var inputVolume = 128;

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

function callback2(stream) {
    var ctx = new AudioContext();
    var mic = ctx.createMediaStreamSource(stream);
    var splitter = ctx.createChannelSplitter();
    var analyserL = ctx.createAnalyser();
    var analyserR = ctx.createAnalyser();

    var audioTrack=stream.getAudioTracks();
    var audioStreamTrackName = audioTrack[0].label;
    var audioStreamTrackType = audioTrack[0].kind;
    console.log('audioTracks:' + audioTrack.length);
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

        const maxVolume = 257 - inputVolume;
        renderer.drawExample1(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, maxVolume, fullFreqL, fullFreqR);
        renderer.drawExample2(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, maxVolume);
        renderer.drawExample3(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, maxVolume);
        renderer.drawExample4(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, maxVolume);

        requestAnimationFrame(play);
    }

    play();
}

function updateInputVolume() {
    inputVolume = this.value;
    var output = document.getElementById("inputVolume")

    output.innerHTML = inputVolume;
    //console.log("inputVolume:" + inputVolume);
}

async function enumerate() {
    let devices = null;

    try {
        devices = await navigator.mediaDevices.enumerateDevices();

        console.log('devices:');
        console.log(devices);
    } catch (err) {
        console.log('error:')
        console.log(err)
    }
}

async function getMedia2(constraints) {

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
            callback2(stream);
        } catch (err) {
            console.log('[getMedia2] error:');
            console.log(err);
        }
}

window.onload = function() {
    const elFreqL = document.getElementById('freqL');
    renderer.setup()

    const gainVolume = document.getElementById('gainSlider')
    gainVolume.oninput = updateInputVolume

    console.log(gainVolume);

    console.log(elFreqL);

    /*
        With just audio: 'true' to capture sound, the getUserMedia just
    returns mic audio streams. To be able to capture the system audio
    and have stereo stream, it must specify the source to be 'desktop'.
        
        But to be able to capture the system audio the video 
    capture must be enabled. Enabling just audio capture with
      chromeMediaSource: 'desktop' gives the error:
      DOMException: Requested device not found
    */
    var constraints2 = {
        audio: {
            mandatory: {
                chromeMediaSource: 'desktop'
            }
        },
        video: {
            mandatory: {
                chromeMediaSource: 'desktop'
            }
        }
    };

    // debug: list media sources
    enumerate();

    getMedia2(constraints2);
}

window.onresize = function() {
    renderer.setupExample1()
    renderer.setupExample2()
    renderer.setupExample3()
    renderer.setupExample4()
}
import Util from "./modules/util.js"
import { VolumeBar, SegmentedVolumeBar, LedVolumeBar, VolumeBarData } from "./modules/volumeBar.js"
import VUmeter from "./modules/vumeter.js"

//----------------------------------------------------------------------------------------------------------------
export default class Renderer {
    examples = {}

    setup(){
        for (let i=1; i<=4; i++){
            this.examples[`example${i}`] = document.getElementById(`example${i}`)
            this.hideExample(`example${i}`)
        }
        this.setupExample1()
        this.setupExample2()
        this.setupExample3()
        this.setupExample4()

        this.showExample("example1");
    }

    showExample(example){
        const el = this.examples[example];
        if (el) el.style.display = "block";
    }

    hideExample(example){
        const el = this.examples[example];
        if (el) el.style.display = "none";
    }

    isExampleVisible(example){
        const el = this.examples[example];
        return el && el.style.display != "none";
    }

    setupExample1(){
        const canvasEx1L = document.getElementById('canvasL');
        const canvasEx1R = document.getElementById('canvasR');
        this.canvasEx1LCtx = canvasEx1L.getContext('2d');
        this.canvasEx1RCtx = canvasEx1R.getContext('2d');
        
        const canvasEx1LedL = document.getElementById('canvasLEDL');
        const canvasEx1LedR = document.getElementById('canvasLEDR');
        this.canvasEx1LedLCtx = canvasEx1LedL.getContext('2d');
        this.canvasEx1LedRCtx = canvasEx1LedR.getContext('2d');
        
        const ccLed1 = {
            maxGroups: 12, ledsPerGroup: 4, gap: 1.0 / (12 * 4) * 0.1, epsilon: 0.001,
                colors: [
                    {color: 'rgb(255, 255, 255)', position: 0.0,},
                    {color: 'rgb(255, 0, 0)'    , position: 8 / 12,},
                ]
            };
        this.ccEx1 = {left: 0, top: 0, 
            width: canvasEx1L.width, height: canvasEx1L.height, 
            direction: 'horizontal', align: 'start',
            led: ccLed1,
        }
        this.ccEx1Led = {left: 0, top: 0, 
            width: canvasEx1LedL.width, height: canvasEx1LedL.height, 
            direction: 'horizontal', align: 'start',
            led: ccLed1,
        }
        
    }

    drawExample1(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, fullFreqL, fullFreqR){

        if (!this.isExampleVisible("example1")) return;

        const LedVolumeBarL = VolumeBar.getLEDVolumeBar(this.ccEx1Led, rmsVolumeL, 128);
        const LedVolumeBarR = VolumeBar.getLEDVolumeBar(this.ccEx1Led, rmsVolumeR, 128);
        
        Util.drawVolumeBar(this.canvasEx1LedLCtx, LedVolumeBarL);
        Util.drawVolumeBar(this.canvasEx1LedRCtx, LedVolumeBarR);
        
        const volumeBarL = VolumeBar.getVolumeBar(this.ccEx1, volumeL, 128);
        const volumeBarR = VolumeBar.getVolumeBar(this.ccEx1, volumeR, 128);

        Util.drawVolumeBar(this.canvasEx1LCtx, volumeBarL);
        Util.drawVolumeBar(this.canvasEx1RCtx, volumeBarR);

        const ledInfoL = LedVolumeBarL.ledInfo;
        const ledInfoR = LedVolumeBarR.ledInfo;

        const fullFreqLStr = fullFreqL.toLocaleString('en-US',{minimumIntegerDigits:5, useGrouping:false});
        const fullFreqRStr = fullFreqR.toLocaleString('en-US',{minimumIntegerDigits:5, useGrouping:false});

        const volumeLStr = volumeL.toFixed(3);
        const volumeRStr = volumeR.toFixed(3);

        const levelLStr = ledInfoL.level.toFixed(3);
        const levelRStr = ledInfoR.level.toFixed(3);
        
        const groupLStr = ledInfoL.groups.toLocaleString('en-US', {minimumIntegerDigits:2});
        const groupRStr = ledInfoR.groups.toLocaleString('en-US', {minimumIntegerDigits:2});
        
        Util.print('freqL', `${fullFreqLStr} level_${levelLStr} group_${groupLStr} vol_${volumeLStr}`);
        Util.print('freqR', `${fullFreqRStr} level_${levelRStr} group_${groupRStr} vol_${volumeRStr}`);
    }
        

    setupExample2(){
        const canvasEx2L = document.getElementById('canvasL2');
        const canvasEx2R = document.getElementById('canvasR2');
        this.canvasEx2LCtx = canvasEx2L.getContext('2d');
        this.canvasEx2RCtx = canvasEx2R.getContext('2d');
        
        const canvasEx2LedL = document.getElementById('canvasLEDL2');
        const canvasEx2LedR = document.getElementById('canvasLEDR2');
        this.canvasEx2LedLCtx = canvasEx2LedL.getContext('2d');
        this.canvasEx2LedRCtx = canvasEx2LedR.getContext('2d');
        
        const ccLed2 = {
            maxGroups: 15, ledsPerGroup: 3, gap: 1.0 / (15 * 3) * 0.2, epsilon: 0.001,
                colors: [
                    {color: 'rgb(0, 255, 0)'  , position: 0.0,},
                    {color: 'rgb(255, 255, 0)', position: 8 / 15,},
                    {color: 'rgb(255, 0, 0)'  , position: 11 / 15,},
        
                ]
            };
        
        this.ccEx2 = {left: 0, top: 0, 
            width: canvasEx2L.width, height: canvasEx2L.height, 
            direction: 'horizontal', align: 'start',
            led: ccLed2,
        }
        
        this.ccEx2Led = {left: 0, top: 0, 
            width: canvasEx2LedL.width, height: canvasEx2LedL.height, 
            direction: 'horizontal', align: 'start',
            led: ccLed2,
        }
        
    }

    drawExample2(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR){
        if (!this.isExampleVisible("example2")) return;

        let cc2L = {};
        let cc2LedL = {};
        
        Object.assign(cc2L, this.ccEx2);
        Object.assign(cc2LedL, this.ccEx2Led);
        
        cc2L.align = 'end';
        cc2LedL.align = 'end';

        const LedVolumeBar2L = VolumeBar.getLEDVolumeBar(cc2LedL, rmsVolumeL, 128);
        const LedVolumeBar2R = VolumeBar.getLEDVolumeBar(this.ccEx2Led, rmsVolumeR, 128);

        Util.drawVolumeBar(this.canvasEx2LedLCtx, LedVolumeBar2L);
        Util.drawVolumeBar(this.canvasEx2LedRCtx, LedVolumeBar2R);

        const volumeBar2L = VolumeBar.getSegmentedVolumeBar(cc2L, volumeR, 128);
        const volumeBar2R = VolumeBar.getSegmentedVolumeBar(this.ccEx2, volumeR, 128);

        Util.drawVolumeBar(this.canvasEx2LCtx, volumeBar2L);
        Util.drawVolumeBar(this.canvasEx2RCtx, volumeBar2R);

    }
        
    setupExample3(){
        const canvasEx3L = document.getElementById('canvasLV');
        const canvasEx3R = document.getElementById('canvasRV');
        this.canvasEx3LCtx = canvasEx3L.getContext('2d');
        this.canvasEx3RCtx = canvasEx3R.getContext('2d');
        
        const canvasEx3LedL = document.getElementById('canvasLEDLV');
        const canvasEx3LedR = document.getElementById('canvasLEDRV');
        this.canvasEx3LedLCtx = canvasEx3LedL.getContext('2d');
        this.canvasEx3LedRCtx = canvasEx3LedR.getContext('2d');
        
        const ccLed3 = {
            maxGroups: 15, ledsPerGroup: 3, gap: 1.0 / (15 * 3) * 0.2, epsilon: 0.001,
                colors: [
                    {color: 'rgb(0, 255, 0)'  , position: 0.0,},
                    {color: 'rgb(255, 255, 0)', position: 8 / 15,},
                    {color: 'rgb(255, 0, 0)'  , position: 11 / 15,},
        
                ]
            };
        
        this.ccEx3 = {left: 0, top: 0, 
            width: canvasEx3L.width, height: canvasEx3L.height, 
            direction: 'vertical', align: 'end',
            led: ccLed3,
        }
        
        this.ccEx3Led = {left: 0, top: 0, 
            width: canvasEx3LedL.width, height: canvasEx3LedL.height, 
            direction: 'vertical', align: 'end',
            led: ccLed3,
        }
        
    }

    drawExample3(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR){
        if (!this.isExampleVisible("example3")) return;

        const LedVolumeBarLV = VolumeBar.getLEDVolumeBar(this.ccEx3Led, rmsVolumeL, 128);
        const LedVolumeBarRV = VolumeBar.getLEDVolumeBar(this.ccEx3Led, rmsVolumeR, 128);
        
        Util.drawVolumeBar(this.canvasEx3LedLCtx, LedVolumeBarLV);
        Util.drawVolumeBar(this.canvasEx3LedRCtx, LedVolumeBarRV);

        const volumeBarLV = VolumeBar.getSegmentedVolumeBar(this.ccEx3, volumeL, 128);
        const volumeBarRV = VolumeBar.getSegmentedVolumeBar(this.ccEx3, volumeR, 128);

        Util.drawVolumeBar(this.canvasEx3LCtx, volumeBarLV);
        Util.drawVolumeBar(this.canvasEx3RCtx, volumeBarRV);

    }
        
    setupExample4(){
        const canvasEx4L = document.getElementById('canvasLV2');
        const canvasEx4R = document.getElementById('canvasRV2');
        this.canvasEx4LCtx = canvasEx4L.getContext('2d');
        this.canvasEx4RCtx = canvasEx4R.getContext('2d');
        
        const canvasEx4LedL = document.getElementById('canvasLEDLV2');
        const canvasEx4LedR = document.getElementById('canvasLEDRV2');
        this.canvasEx4LedLCtx = canvasEx4LedL.getContext('2d');
        this.canvasEx4LedRCtx = canvasEx4LedR.getContext('2d');
        
        const ccLed4 = {
            maxGroups: 15, ledsPerGroup: 1, gap: 0.02, epsilon: 0.001,
                colors: [
                    {color: 'rgb(0, 200, 255)'  , position: 0.0,},
                    {color: 'rgb(255, 0, 255)', position: 8 / 15,},
                    {color: 'rgb(255, 127, 0)'  , position: 11 / 15,},
        
                ]
            };
        
        this.ccEx4 = {left: 0, top: 0, 
            width: canvasEx4L.width, height: canvasEx4L.height, 
            direction: 'vertical', align: 'start',
            led: ccLed4,
        }
        
    }

    drawExample4(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR){
        if (!this.isExampleVisible("example4")) return;

        const volLedEx4L = VolumeBar.getLEDVolumeBar(this.ccEx4, rmsVolumeL, 128);
        const volLedEx4R = VolumeBar.getLEDVolumeBar(this.ccEx4, rmsVolumeR, 128);
        
        Util.drawVolumeBar(this.canvasEx4LedLCtx, volLedEx4L);
        Util.drawVolumeBar(this.canvasEx4LedRCtx, volLedEx4R);

        const volumeBarL = VolumeBar.getSegmentedVolumeBar(this.ccEx4, volumeL, 128);
        const volumeBarR = VolumeBar.getSegmentedVolumeBar(this.ccEx4, volumeR, 128);

        Util.drawVolumeBar(this.canvasEx4LCtx, volumeBarL);
        Util.drawVolumeBar(this.canvasEx4RCtx, volumeBarR);

    }

}
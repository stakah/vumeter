import Util from "./modules/util.js"
import { VolumeBar, SegmentedVolumeBar, LedVolumeBar, VolumeBarData } from "./modules/volumeBar.js"
import VUmeter from "./modules/vumeter.js"

//----------------------------------------------------------------------------------------------------------------
export default class Renderer {
    examples = {}

    setup(){
        this.util = new Util()

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

    ex1 = {}

    setupExample1(){
        const canvasEx1L = document.getElementById('canvasL');
        const canvasEx1R = document.getElementById('canvasR');
        this.canvasEx1LCtx = canvasEx1L.getContext('2d');
        this.canvasEx1RCtx = canvasEx1R.getContext('2d');
        
        const canvasEx1LedL = document.getElementById('canvasLEDL');
        const canvasEx1LedR = document.getElementById('canvasLEDR');
        this.canvasEx1LedLCtx = canvasEx1LedL.getContext('2d');
        this.canvasEx1LedRCtx = canvasEx1LedR.getContext('2d');
        
        const paddingLeft   = parseFloat(window.getComputedStyle(document.body).getPropertyValue('padding-left'))
        const paddingRight  = parseFloat(window.getComputedStyle(document.body).getPropertyValue('padding-right'))
    
        const W = document.body.clientWidth - paddingLeft - paddingRight

        canvasEx1L.width = W;
        canvasEx1R.width = W;

        canvasEx1LedL.width = W;
        canvasEx1LedR.width = W;
        
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

    drawExample1(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, maxVolume, fullFreqL, fullFreqR){

        if (!this.isExampleVisible("example1")) return;

        const LedVolumeBarL = VolumeBar.getLEDVolumeBar(this.ccEx1Led, rmsVolumeL, maxVolume);
        const LedVolumeBarR = VolumeBar.getLEDVolumeBar(this.ccEx1Led, rmsVolumeR, maxVolume);
        
        this.util.drawVolumeBar(this.canvasEx1LedLCtx, LedVolumeBarL);
        this.util.drawVolumeBar(this.canvasEx1LedRCtx, LedVolumeBarR);
        
        const volumeBarL = VolumeBar.getVolumeBar(this.ccEx1, volumeL, maxVolume);
        const volumeBarR = VolumeBar.getVolumeBar(this.ccEx1, volumeR, maxVolume);

        this.util.drawVolumeBar(this.canvasEx1LCtx, volumeBarL);
        this.util.drawVolumeBar(this.canvasEx1RCtx, volumeBarR);

        const ledInfoL = LedVolumeBarL.ledInfo;
        const ledInfoR = LedVolumeBarR.ledInfo;

        const fullFreqLStr = this.util.formatNumber(fullFreqL)
        const fullFreqRStr = this.util.formatNumber(fullFreqR)

        const volumeLStr = volumeL.toFixed(3);
        const volumeRStr = volumeR.toFixed(3);

        const levelLStr = ledInfoL.level.toFixed(3);
        const levelRStr = ledInfoR.level.toFixed(3);
        
        const groupLStr = this.util.formatNumber(ledInfoL.groups, 2);
        const groupRStr = this.util.formatNumber(ledInfoR.groups, 2);
        
        this.util.print('freqL', `${fullFreqLStr} level_${levelLStr} group_${groupLStr} vol_${volumeLStr}`);
        this.util.print('freqR', `${fullFreqRStr} level_${levelRStr} group_${groupRStr} vol_${volumeRStr}`);
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
        
        this.cc2L = {};
        this.cc2LedL = {};
        
        Object.assign(this.cc2L, this.ccEx2);
        Object.assign(this.cc2LedL, this.ccEx2Led);
        
        this.cc2L.align = 'end';
        this.cc2LedL.align = 'end';
    }

    drawExample2(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, maxVolume){
        if (!this.isExampleVisible("example2")) return;

        const LedVolumeBar2L = VolumeBar.getLEDVolumeBar(this.cc2LedL, rmsVolumeL, maxVolume);
        const LedVolumeBar2R = VolumeBar.getLEDVolumeBar(this.ccEx2Led, rmsVolumeR, maxVolume);

        this.util.drawVolumeBar(this.canvasEx2LedLCtx, LedVolumeBar2L);
        this.util.drawVolumeBar(this.canvasEx2LedRCtx, LedVolumeBar2R);

        const volumeBar2L = VolumeBar.getSegmentedVolumeBar(this.cc2L, volumeR, maxVolume);
        const volumeBar2R = VolumeBar.getSegmentedVolumeBar(this.ccEx2, volumeR, maxVolume);

        this.util.drawVolumeBar(this.canvasEx2LCtx, volumeBar2L);
        this.util.drawVolumeBar(this.canvasEx2RCtx, volumeBar2R);

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

    drawExample3(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, maxVolume){
        if (!this.isExampleVisible("example3")) return;

        const LedVolumeBarLV = VolumeBar.getLEDVolumeBar(this.ccEx3Led, rmsVolumeL, maxVolume);
        const LedVolumeBarRV = VolumeBar.getLEDVolumeBar(this.ccEx3Led, rmsVolumeR, maxVolume);
        
        this.util.drawVolumeBar(this.canvasEx3LedLCtx, LedVolumeBarLV);
        this.util.drawVolumeBar(this.canvasEx3LedRCtx, LedVolumeBarRV);

        const volumeBarLV = VolumeBar.getSegmentedVolumeBar(this.ccEx3, volumeL, maxVolume);
        const volumeBarRV = VolumeBar.getSegmentedVolumeBar(this.ccEx3, volumeR, maxVolume);

        this.util.drawVolumeBar(this.canvasEx3LCtx, volumeBarLV);
        this.util.drawVolumeBar(this.canvasEx3RCtx, volumeBarRV);

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

    drawExample4(dataL, dataR, rmsVolumeL, rmsVolumeR, volumeL, volumeR, maxVolume){
        if (!this.isExampleVisible("example4")) return;

        const volLedEx4L = VolumeBar.getLEDVolumeBar(this.ccEx4, rmsVolumeL, maxVolume);
        const volLedEx4R = VolumeBar.getLEDVolumeBar(this.ccEx4, rmsVolumeR, maxVolume);
        
        this.util.drawVolumeBar(this.canvasEx4LedLCtx, volLedEx4L);
        this.util.drawVolumeBar(this.canvasEx4LedRCtx, volLedEx4R);

        const volumeBarL = VolumeBar.getSegmentedVolumeBar(this.ccEx4, volumeL, maxVolume);
        const volumeBarR = VolumeBar.getSegmentedVolumeBar(this.ccEx4, volumeR, maxVolume);

        this.util.drawVolumeBar(this.canvasEx4LCtx, volumeBarL);
        this.util.drawVolumeBar(this.canvasEx4RCtx, volumeBarR);

    }

}
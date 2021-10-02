import VUmeter from "./vumeter.js";

export class VolumeBar {
    constructor(canvasConstraints){
        this.canvasConstraints = canvasConstraints;
        this.data = []; // VolumeBarData
    }

    addData(left, top, width, height, fillStyle){
        const data = new VolumeBarData(left, top, width, height, fillStyle);
        this.data.push(data);
    }

    static getVolumeBar(canvasConstraints, volume, maxVolume){
        const cc = canvasConstraints;
        const epsilon = cc.led.epsilon || 0.0;
        const volRatio = volume / maxVolume;
        const barLength = volRatio;
        const width = barLength;
        const height = 1.0;
        const left = 0.0;
    
        const top = 0.0;
    
        const position = volRatio;
        const segment = VUmeter.segmentColor(position, cc, epsilon);
    
        const volumeBar = new VolumeBar(canvasConstraints);
        volumeBar.addData(left, top, width, height, segment.color);
    
        return volumeBar;
    }

    static getSegmentedVolumeBar(canvasConstraints, volume, maxVolume){
        const cc = canvasConstraints;
        const epsilon = cc.led.epsilon | 0.0;
        const volRatio = volume / maxVolume;
    
        const unitWidth = (1.0) / (cc.led.maxGroups * cc.led.ledsPerGroup)
        const segmentCount = Math.round(cc.led.maxGroups * volRatio);
        const level = 1.0 * segmentCount / cc.led.maxGroups;
    
        const volumeBar = new SegmentedVolumeBar(canvasConstraints, level, segmentCount);
    
        let left = 0.0;
        let top  = 0.0;
        let w = 0;
        let h = 1.0;
        for (var i=0; i<cc.led.colors.length; i++){
            const group = cc.led.colors[i];
            let position = 0.0;
            try {
                position = cc.led.colors[i+1].position;
            } catch (e) {
                position = 1.0;
            }
            w = Math.min(position, volRatio) - left;
            volumeBar.addData(left, top, w, h, group.color);
            left += w;
    
        }
    
        return volumeBar;
    }
    
    static getLEDVolumeBar(canvasConstraints, volume, maxVolume){
        const cc = canvasConstraints;
        const epsilon = cc.led.epsilon | 0.0;
        
        const ledWidth = (1.0 - (cc.led.maxGroups * cc.led.ledsPerGroup - 1) * cc.led.gap) / (cc.led.maxGroups * cc.led.ledsPerGroup)
        const volGroups = Math.round(cc.led.maxGroups * volume / maxVolume);
        const level = 1.0 * volGroups / cc.led.maxGroups;
    
        const volumeBar = new LedVolumeBar(cc, level, volGroups);
    
        let left = 0.0;
        let top  = 0.0;
        let w = ledWidth;
        let h = 1.0;
        for (var i=0; i<volGroups; i++){
            const position = 1.0 * i / cc.led.maxGroups;                    
            const segment = VUmeter.segmentColor(position, cc, epsilon);
            for (var d=0; d<cc.led.ledsPerGroup; d++) {
                volumeBar.addData(left, top, w, h, segment.color);
                left += ledWidth + cc.led.gap;
    
            }
        }
    
        return volumeBar;
    }

}

export class SegmentedVolumeBar extends VolumeBar {
    constructor(canvasConstraints, level, segmentCount){
        super(canvasConstraints);
        this.level = level;
        this.segmentCount = segmentCount;
    }

    get segmentInfo(){
        return { level: this.level, segmentCount: this.segmentCount };
    }
}

export class LedVolumeBar extends VolumeBar {
    constructor(canvasConstraints, level, groups){
        super(canvasConstraints);
        this.level = level;
        this.groups = groups;
    }

    get ledInfo(){
        return { level: this.level, groups: this.groups };
    }
}

export class VolumeBarData {
    constructor (left, top, width, height, fillStyle){
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.fillStyle = fillStyle;
    }
}

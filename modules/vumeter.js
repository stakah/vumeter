export default class VUmeter {
    constructor (){

    }

    static getRMSVolume(binCount, data){
        let sum = 0.0;
    
        for (var i=0; i<binCount; i++) {
            const x = data[i];
            sum += x * x;
        }
    
        const rms = Math.sqrt(sum / binCount)
        
        return rms;
    }
    
    static getSmoothRMSVolume(volume, averaging, rmsVolume){
        const vol = Math.max(rmsVolume, volume * averaging);
        return vol;
    }
    
    static getFullestFrequency(binCount, data, sampleRate, fftSize, elementName) {
        // get fullest bin
        var idx = 0;
        for (var j=0; j <binCount; j++) {
            if (data[j] > data[idx]) {
                idx = j;
            }
        }
    
        var frequency = idx * sampleRate / fftSize;
    
        return Math.round(frequency,1);
    
    }

    static segmentColor(position, constraints, epsilon){
        const colors = constraints.led.colors ;
        let c = 'rgb(255, 255, 255)';
        for (var i=0; i<colors.length; i++){
            // print('position', `${position} colors[${i}].position: ${colors[i].position}`);
            if ((position - colors[i].position) >= epsilon) c = colors[i];
        }
        return c;
    }
    
}
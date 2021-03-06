export default class Util {
    constructor (){
        this.elements = {}
    }

    _putElement(elementName){
        const el = document.getElementById(elementName)
        if (el) this.elements[elementName] = el

        return el
    }

    _getElement(elementName){
        const el = this.elements[elementName]
        if (el) return el

        return this._putElement(elementName)
    }

    print(elementName, str){
        // console.log(str);
        const el = this._getElement(elementName)
        if (el) el.textContent = '' + str;
    }
    
    formatNumber(num, minimumIntegerDigits = 5){
        const str = '' + num
        return str.substring(0,minimumIntegerDigits)        
    }
    
    drawVolumeBar(canvasCtx, volumeBar){
        const ctx = canvasCtx;
        const cc = volumeBar.canvasConstraints;
    
        const direction = cc.direction || 'horizontal';
        const align = cc.align || 'start';
        const epsilon = cc.led.epsilon || 0.0;
    
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, cc.width, cc.height);
    
        for (var i=0; i<volumeBar.data.length; i++){
            const d = volumeBar.data[i];
            ctx.fillStyle = d.fillStyle;
            const width  = (direction == 'horizontal' ? d.width : d.height ) * cc.width;
            const height = (direction == 'horizontal' ? d.height : d.width) * cc.height;
            const left   = direction == 'horizontal'
                         ? (align == 'start' ? d.left * cc.width : cc.width - width  - d.left * cc.width)
                         : (align == 'start' ? cc.width - d.height  * cc.width : cc.width * d.top);
            const top    = direction == 'horizontal'
                         ? d.top  * cc.height
                         : (align == 'start' ? d.left * cc.height : cc.height - height - d.left * cc.height);   
            ctx.fillRect(left, top, width, height);
        }
    }
    
}
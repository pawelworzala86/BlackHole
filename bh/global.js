class Global{
    constructor(){
        this.lines = []
    }
    addCode(code){
        var lines = code.split('\r\n')
        //console.log(lines)
        lines.map(line=>this.addLine(line))
    }
    addLine(line){
        //line = line.trim()
        //if(line.length){
        this.lines.push(line)
        //}
    }
    getCode(){
        return this.lines.join('\r\n')
    }
}

module.exports = Global
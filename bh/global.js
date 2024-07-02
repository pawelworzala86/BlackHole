const { CONNREFUSED } = require("dns")

function ParseFuncs(ROOTSource){

    //this.ROOT.source = ''
    var iteration = 1
    var source = ''

    for(let i=0;i<ROOTSource.length;i++){

        var char = ROOTSource[i]

        if(char=='('){
            source+=':'+iteration+'('
            iteration++
        }else if(char==')'){
            iteration--
            source+=':'+(iteration)+')'
        }else{
            source+=char
        }

    }

    let uniuque = 1024
    let index = 1
    while(1024 > index){
        tmp = ' '+source
        while(tmp != source){
            tmp = source
            source = source
                .replace(':'+index+'(',':'+uniuque+'(')
                .replace(':'+index+')',':'+uniuque+')')
            if((tmp != source)){
                uniuque++
            }
        }
        index++
    }

    return source

}

var BLOCKS = []
var blockIndex = 0

function ParseBlocks(ROOTSource){

    //this.ROOT.source = ''
    var iteration = 1
    var source = ''

    for(let i=0;i<ROOTSource.length;i++){

        var char = ROOTSource[i]

        if(char=='{'){
            source+=':'+iteration+'{'
            iteration++
        }else if(char=='}'){
            iteration--
            source+=':'+(iteration)+'}'
        }else{
            source+=char
        }

    }

    let uniuque = 1024
    let index = 1
    while(1024 > index){
        tmp = ' '+source
        while(tmp != source){
            tmp = source
            source = source
                .replace(':'+index+'{',':'+uniuque+'{')
                .replace(':'+index+'}',':'+uniuque+'}')
            if((tmp != source)){
                uniuque++
            }
        }
        index++
    }

    source = source.replace(/(?<num>\:[0-9]+)\{([\s\S]+?)(\k<num>)\}/gm,match=>{
        var code = match.substring(6,match.length-6).trim()
        BLOCKS[blockIndex]=code
        return 'BLOCK::'+(blockIndex++)
    })

    console.log('BLOCKS',BLOCKS)

    return source

}

var functionIndex = 0
var dataIndex = 0

class Global{
    constructor(){
        this.lines = []
        this.functions = {}
        this.data = []
        this.code = []
    }
    addCode(code){
        code = ParseBlocks(code)

        console.log('CODE',code)
        //code = ParseFuncs(code)

        code = this.scrapFunctions(code)
        code = this.scrapData(code)

        var lines = code.split('\r\n')
        //console.log(lines)
        lines.map(line=>this.addLine(line))
    }
    addLine(line){
        //line = line.trim()
        //if(line.length){
        this.lines.push(line)
        if(line.trim().length>0){
        if(line.indexOf('FUNCTION::')==0){
            var idx = line.split('::')[1].trim()
            this.code.push(this.functions[idx])
        }else if(line.indexOf('DATA::')==0){
            var idx = line.split('::')[1].trim()
            this.code.push(this.data[idx])
        }else{
            console.log('UNEXCEPTED: '+line)
        }
        }
        //}
    }
    getCode(){
        var code = this.lines.join('\r\n')
        return code
    }
    scrapFunctions(source){
        source = source.replace(/function(.*)BLOCK\:\:(.*)/gm,match=>{
            //functionIndex++
            //var lines = match.split('\r\n')
            //var head = lines[0]
            //lines.splice(0,1)
            //lines.splice(lines.length-1,1)
            //lines = ParseFuncs(lines.join('\r\n')).split('\r\n')
            var name = match.split('(')[0].replace('function','').trim()
            var params = match.split('(')[1].split(')')[0].trim()
            var block = match.split('BLOCK::')[1]
            this.functions[name] = {type:'function',name,params,block}
            return 'FUNCTION::'+name
        })
        return source
    }
    scrapData(source){
        source = source.replace(/var (.*)/gm,match=>{
            //functionIndex++
            this.data[dataIndex] = {type:'data',code:match}
            return 'DATA::'+dataIndex++
        })
        return source
    }
}

module.exports = Global
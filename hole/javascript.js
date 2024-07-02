//const fs = require('fs')

//let sourceStr = fs.readFileSync('./test.js').toString()



function createPart(){
    return {parent:null,code:[]}
}

//var GLOBAL = createPart()//{parent:null,code:[]}

//var activeCode = GLOBAL
var FUNCS = []

function parseBlock(source,activeCode){
    var word = ''
    var isText = false
    var isFunction = false
    var funcName = ''
    var lastWord = ''

    for(let index=0;index<source.length;index++){

        var char = source[index]

        if((char=='\'')||(char=='"')){
            isText=!!!isText
        }
        if(char=='('){
            isFunction=true
            funcName=word
        }
        if(char==')'){
            isFunction=false
        }
        if(((char==' ')||(char=='\n')||(char=='\r')
            ||(char=='('))&&!isText){
            if(word.length>0){
                console.log('word: ',word)
            }
            lastWord = word
            word = ''
        }else{
            word += char
        }
        
        function getNewLineIndex(idx){
            var rest=''
            for(var id=idx;id<source.length;id++){
                rest+=source[id]
                if(source[id]=='\n'){
                    return {skipped:id,rest}
                }
            }
            return {skipped:id,rest}
        }
        function getFunction(idx){
            var rest=''
            for(let id=idx;id<source.length;id++){
                rest+=source[id]
                if(source[id]=='}'){
                    return {skipped:id,rest}
                }
            }
        }
        function getEndFunctionName(idx){
            var rest=''
            for(let id=idx;id<source.length;id++){
                rest+=source[id]
                if(source[id]==')'){
                    return {skipped:id,rest}
                }
            }
        }

        let recognize = false

        if(word=='var'){
            var {skipped,rest} = getNewLineIndex(index+1)
            console.log(skipped)
            console.log(rest)
            index = skipped
            var line = word+rest
            console.log(line)
            var params=line.trim().split(' ')
            var obj={
                kind: 'var',
                name: params[1],
                value: params[3],
            }
            activeCode.code.push(obj)
            recognize = true
        }
        if(word=='function'){
            var {skipped,rest} = getFunction(index+1)
            console.log(skipped)
            console.log(rest)
            index = skipped
            var code = word+rest
            console.log(code)
            var name = code.split(' ')[1].split('(')[0]
            var lines = code.split('\n')
            var params = lines[0].split('(')[1].split(')')[0].trim()
            params=params.split(',')
            if((params[0].length==0)&&params.length==1){
                params=[] 
            }
            lines.splice(0,1)
            lines.splice(lines.length-1,1)
            var kod = lines.join('\r\n')
            FUNCS.push(name)
            var obj={
                kind: 'function',
                name: name,
                params,
                code: [],
            }
            //var inline = createPart()
            parseBlock(kod,obj)
            activeCode.code.push(obj)
            recognize = true
        }
        if(isFunction){
            //console.log('FUNCTION')
            var len=word.length
            var {skipped,rest} = getEndFunctionName(index-len)
            console.log(skipped)
            console.log(rest)
            index = skipped
            var line = word+rest
            console.log(line)
            //var params=line.trim().split(' ')
            line=line.substring(1,line.length-1)
            var params=line.split(',')
            if((params[0].length==0)&&params.length==1){
                params=[] 
            }
            var kind = 'call'
            if(FUNCS.includes(funcName)){
                kind = 'macro'
            }
            var obj={
                kind,
                name: funcName,
                params: params,
            }
            activeCode.code.push(obj)
            isFunction=false
            recognize = true
        }
        if(word=='='){
            var len=word.length
            var {skipped,rest} = getNewLineIndex(index-len)
            console.log(skipped)
            console.log(rest)
            index = skipped
            var line = word+rest
            console.log(line)
            var value=rest.trim().split('=')[1]
            var obj={
                kind: 'assign',
                target:lastWord,
                value,
            }
            activeCode.code.push(obj)
            recognize = true
        }

        if(!recognize){
            console.log('UNRECOGNIZED: ',index,' ',word, lastWord)
            process.exit(0)
        }

    }

}
module.exports = function(sourceStr){
    var GLOBAL = createPart()
    parseBlock(sourceStr,GLOBAL)
    return GLOBAL
}
//fs.writeFileSync('./bh.exp.json',JSON.stringify(GLOBAL,null,4))
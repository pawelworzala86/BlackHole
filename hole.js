const fs = require('fs')

let sourceStr = fs.readFileSync('./test.js').toString()

var word = ''
var isText = false

var GLOBAL = {parent:null,code:[]}

//var activeCode = GLOBAL

function parseBlock(source,activeCode){

    for(let index=0;index<source.length;index++){

        var char = source[index]

        if((char=='\'')||(char=='"')){
            isText=!!!isText
        }
        if(((char==' ')||(char=='\n')||(char=='\r'))&&!isText){
            if(word.length>0){
                console.log('word: ',word)
            }
            word = ''
        }else{
            word += char
        }

        function getNewLineIndex(idx){
            var rest=''
            for(let id=idx;id<source.length;id++){
                rest+=source[id]
                if(source[id]=='\n'){
                    return {skipped:id,rest}
                }
            }
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

        if(word=='var'){
            var {skipped,rest} = getNewLineIndex(index+1)
            console.log(skipped)
            console.log(rest)
            index = skipped
            var line = word+rest
            console.log(line)
            activeCode.code.push(line)
        }
        if(word=='function'){
            var {skipped,rest} = getFunction(index+1)
            console.log(skipped)
            console.log(rest)
            index = skipped
            var code = word+rest
            console.log(code)
            activeCode.code.push(code)
        }

    }

}
parseBlock(sourceStr,GLOBAL)
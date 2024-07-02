const fs = require('fs')

const Hole = require('./hole.js')
const ASM = require('./asm.js')


const entry = process.argv[2]



let source = fs.readFileSync('./source/'+entry+'.js').toString()



//var GLOBAL = new Global()

//GLOBAL.addCode(source)

//console.log(GLOBAL.getCode())

//console.log(GLOBAL.functions)
//console.log(GLOBAL.data)

//console.log('CODE')
//console.log('CODE')
//console.log('CODE')

var GLOBAL = Hole(source)

console.log(GLOBAL.code)

fs.writeFileSync('./bh.explain.json',JSON.stringify(GLOBAL.code,null,4))

let asm = ASM(GLOBAL.code)

fs.writeFileSync('./cache/'+entry+'-source.asm',asm)
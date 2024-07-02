const fs = require('fs')

const Global = require('./global.js')
const ASM = require('./asm.js')

let source = fs.readFileSync('./test.js').toString()



var GLOBAL = new Global()

GLOBAL.addCode(source)

console.log(GLOBAL.getCode())

console.log(GLOBAL.functions)
console.log(GLOBAL.data)

console.log('CODE')
console.log('CODE')
console.log('CODE')

console.log(GLOBAL.code)

fs.writeFileSync('./bh.explan.json',JSON.stringify(GLOBAL.code,null,4))

let asm = ASM(GLOBAL.code)

fs.writeFileSync('./cache/test-source.asm',asm)
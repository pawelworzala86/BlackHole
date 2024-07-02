const fs = require('fs')

const Global = require('./global.js')


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
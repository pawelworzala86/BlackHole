const fs = require('fs')



let frame = fs.readFileSync('./frame/cmd.asm').toString()
let source = fs.readFileSync('./source/test.js').toString()

frame=frame.replace('{{INIT}}',"include test-source.asm")

fs.writeFileSync('./cache/test.asm',frame)
fs.writeFileSync('./cache/test-source.asm',source)
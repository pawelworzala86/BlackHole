function ASM(code){
    var source = []
    code.map(obj=>{
        if(obj.type=='data'){
            source.push('.data\n'+obj.name+' dq '+obj.value+'\n')
        }
        if(obj.type=='function'){
            source.push('.code\n'+
                obj.name+' macro '+obj.params+'\n'+
                ASM(obj.code)+
            '\nendm\n\n')
        }
        if(obj.type=='calle'){
            source.push('invoke '+obj.name+', '+obj.params.join(', '))
        }
        if(obj.type=='macro'){
            source.push(''+obj.name+''+
                (obj.params.join(', ').length>0?',':'')
                +' '+obj.params.join(', '))
        }
    })
    return source.join('\r\n')
}

module.exports=ASM
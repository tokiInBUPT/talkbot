StartRule = Block*
Block "block"
  = WS* name:(VALUE) WS* LB* '{' LB* WS* property:Rules WS* LB* '}' LB* {
    return {
        name:name,
        commands:property
    }
  }
Rules = Rule*
Rule = value:(CMD0/CMD1/CMDBLK/CMD1BLK) WS* LB WS* LB* WS*{
    return value
}

WS "whitespace"
    = [ \t]

LB "Linebreak"
    = [\r\n]
    
CMD0 = keyword:("pass"){
    return {
        "keyword": keyword,
    }
}
KW1 = "goto" / "output"
KWBLK = "silence" / "default"
KW1BLK = "for" / "input"
    
CMD1 
    = keyword:KW1 WS* k1:VALUE {
    return {
        "keyword": keyword,
        "value": k1
    }
}
CMDBLK
    = keyword:KWBLK WS* children:(CMD0/CMD1)  {
    return {
        "keyword": keyword,
        "children": children
    }
}
CMD1BLK
    = keyword:KW1BLK WS* k1:VALUE WS* children:(CMD0/CMD1) {
    return {
        "keyword": keyword,
        "value": k1,
        "children":children
    }
}
VALUE = $([\u4e00-\u9fa5_a-zA-Z0-9\\//$.\[\](){}\*?，。！"]i*)
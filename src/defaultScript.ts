export const defaultScript = `main {
    output "您好，您可以对我描述您的问题。"
    goto menu
}
menu {
    input 10000 goto silence
    goto processInput
}
processInput {
    for /您好|你好/ goto hello
    for /余额/ goto balance
    for /充值/ goto pay
    for /成绩/ goto grade
    for /学费/ goto billing
    for /退学/ goto unroll
    for /人工/ goto service
    default goto default
}
hello {
    output "您好，很高兴见到你。"
    goto menu
}
balance {
    output "您的校园卡余额是：\${balance}，请问还有什么可以帮到您？"
    goto menu
}
pay {
    output "请输入您的充值金额"
    input 0 goto pay
    save charge
    eval balance=Number(balance)+Number(charge)
    output "您已充值%20\${charge}%20元，当前余额为%20\${balance}%20元，请问还有什么可以帮到您？"
    goto menu
}
grade {
    output "您的成绩是：\${grade}，请问还有什么可以帮到您？"
    goto menu
}
billing {
    output "您本学期的当前学费\${billed>0?'已':'未'}缴交，请问还有什么可以帮到您？"
    goto menu
}
unroll {
    output "已为您申请一键退学，再见。"
    exit
}
service {
    output "人工服务当前不在线，您可以在此处留言。"
    input 10000 goto silence
    output "您的留言已收到，感谢您的支持。请问还有什么可以帮到您？"
    goto menu
}
silence {
    output "您已经一段时间没有说话了，您可以随时继续向我提问。"
    input 0 goto silence
    goto processInput
}
default {
    output "这个知识点我还没有明白，您可以问问其他的，或者转人工服务。"
    goto menu
}`

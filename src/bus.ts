import { ref } from 'vue'
import { TextMessage } from './lib/chatbox/typing'
import { EventEmitter } from 'events'

export const chatData = ref<TextMessage[]>([])

export const ev = new EventEmitter()

export const code = ref(`main {
    output "您好，您可以对我描述您的问题"
    goto menu
}
 menu {
    input 5000 goto silence
    for /成绩/ goto grade
    for /学费/ goto billing
    for /退学/ goto unroll
    for /人工/ goto unroll
    default goto default
}
silence {
    output "我好像没听清楚，您可以尝试再说一次"
    goto menu
}
default {
    output "这个知识点我还没有明白，您可以问问其他的，或者转人工服务"
    goto menu
}`)

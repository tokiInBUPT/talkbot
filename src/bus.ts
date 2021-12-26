import { ref, watch } from 'vue'
import { EventEmitter } from 'events'
import { TextMessage } from './lib/chatbox/typing'
import { defaultScript } from './defaultScript'
import { Runner, IVarItem } from '@/lib/runner/index'

export enum ESTATUS {
    READY = 'ready',
    SUCCESS = 'success',
    FAIL = 'fail',
}
export const globalStatus = ref<ESTATUS>(ESTATUS.READY)
export const varList = ref<IVarItem[]>([])
export const globalRunner = new Runner()
export const globalEV = new EventEmitter()
export const chatData = ref<TextMessage[]>([])

export const code = ref(defaultScript)

globalEV.on('compile', async () => {
    await globalRunner.stop()
    try {
        globalRunner.compile(code.value)
        globalStatus.value = ESTATUS.SUCCESS
    } catch (e) {
        globalStatus.value = ESTATUS.FAIL
    }
    globalRunner.variables = varList.value
    globalRunner.run()
})

globalEV.on('stop', async () => {
    await globalRunner.stop()
    globalStatus.value = ESTATUS.READY
})

globalEV.on('input', (value: string) => {
    globalRunner.emit('input', value)
})

globalRunner.on('output', (value: string) => {
    chatData.value.push({
        author: 'bot',
        type: 'text',
        data: {
            text: value,
        },
    } as TextMessage)
})

globalRunner.on('stop', () => {
    globalStatus.value = ESTATUS.READY
})

watch(
    varList,
    () => {
        globalRunner.syncVariables()
    },
    {
        deep: true,
    },
)

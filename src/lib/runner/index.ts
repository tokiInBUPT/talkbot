import { EventEmitter } from 'events'
import { IInterface, IRuntime } from '../interpreter/typing'
import { parse, IBlock } from '../parser/index'
import { run } from '../interpreter'
export interface IVarItem {
    key: string
    value: string
}
export class Runner extends EventEmitter {
    template = ''

    blocks: IBlock[] = []
    variables: IVarItem[] = []

    io: IInterface

    runtime: IRuntime = {
        block: '',
        index: 0,
        input: '',
        storage: {},
    }

    stopped = true

    constructor() {
        super()
        this.io = {
            input: async () => {
                return new Promise((resolve) => {
                    if (this.stopped) return
                    this.once('input', resolve)
                })
            },
            output: (value: string) => {
                if (this.stopped) return
                this.emit('output', value)
            },
        }
    }

    syncVariables() {
        this.runtime.storage = this.variables.reduce((acc, item) => {
            acc[item.key] = item.value
            return acc
        }, {} as IRuntime['storage'])
    }

    revSyncVariables() {
        for (const key in this.runtime.storage) {
            if (this.runtime.storage.hasOwnProperty(key)) {
                const item = this.variables.find((item) => item.key === key)
                if (item) {
                    item.value = this.runtime.storage[key]
                } else {
                    this.variables.push({
                        key,
                        value: this.runtime.storage[key],
                    })
                }
            }
        }
    }

    compile(template: string) {
        this.blocks = parse(template)
        this.template = template
        this.runtime = {
            block: '',
            index: 0,
            input: '',
            storage: {} as IRuntime['storage'],
        }
        this.stopped = false
    }

    async runOnce() {
        this.syncVariables()
        try {
            this.runtime = await run(this.blocks, this.io, this.runtime)
        } catch (e) {
            console.log('RUNNER', 'ERROR', e)
            this.emit(
                'output',
                '检测到JavaScript逻辑错误，脚本已停止运行。这通常意味着eval指令或output中的模板编写有误，详细信息参见调试控制台。',
            )
            throw e
        }
        this.emit('update', {
            block: this.runtime.block,
            index: this.runtime.index,
        })
        this.revSyncVariables()
    }

    async run() {
        while (!this.stopped && this.runtime.index >= 0) {
            await this.runOnce()
        }
        this.stopped = true
        this.emit('stop')
    }

    async stop() {
        if (!this.stopped) {
            this.stopped = true
            this.emit('input', '')
            await new Promise((resolve) => {
                this.once('stop', resolve)
            })
            console.log('[RUNNER]', 'stopped')
        }
    }
}

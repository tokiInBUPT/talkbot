import { IBlock, ICommand, ICommand1, ICommandWithChildren, ICommand1WithChildren } from '../parser/index'
import { IRuntime, IInterface } from './typing'
import delay from 'delay'

/**
 * @function renderText
 * @description 简易而危险的模板引擎
 * @param {string} template 模板
 * @param {Record<string, string>} data 变量
 * @returns {string} 渲染后的文本
 */
export function renderText(template: string, data: Record<string, string>): string {
    const ks = Object.keys(data)
    const vs = ks.map((k) => data[k])
    const t = `return \`${template}\``
    // 模板引擎使用new Function实现，因此关闭规则
    // eslint-disable-next-line no-new-func
    const f = new Function(...ks, t)
    return f(...vs)
}
/**
 * @function runCommand
 * @description 进行一个指令的解析并执行操作
 * @param {ICommand} command 指令
 * @param {IInterface} interface 实现了 input() 和 output() 方法的对象
 * @param {IRuntime} runtime 暂存环境，包含当前执行的 block 和 index，以及 input值，不被修改
 * @returns {Promise<IRuntime>}
 */
export async function runCommand(command: ICommand, io: IInterface, _runtime: IRuntime) {
    let runtime = _runtime
    runtime.index++
    switch (command.keyword) {
        case 'exit':
            runtime.index = -1
            break
        case 'pass':
            break
        case 'output': {
            let str = (command as ICommand1).value
            try {
                str = decodeURIComponent(str) // 若含空格，可以用%20等urlencoded转义
                str = JSON.parse(str) // 若含特殊符号，可用json支持的各类unicode转义
            } catch (e) {}
            str = renderText(str, runtime.storage)
            console.log('RUNNER', 'OUTPUT', str)
            await io.output(str)
            break
        }
        case 'goto':
            runtime.index = 0
            runtime.block = (command as ICommand1).value
            console.log('RUNNER', 'GOTO', runtime)
            break
        case 'save':
            runtime.storage[(command as ICommand1).value] = runtime.input
            break
        case 'eval':
            {
                const { value } = command as ICommand1
                // eslint-disable-next-line no-new-func
                const fun = new Function(
                    'storage',
                    `with (storage) {
                        ${value}
                    }`,
                )
                try {
                    fun(runtime.storage)
                } catch (e) {
                    console.log('RUNNER', 'EVAL ERROR', e)
                    throw e
                }
            }
            break
        case 'input': {
            const timeout = (command as ICommand1WithChildren).value
            const children = (command as ICommand1WithChildren).children
            console.log('RUNNER', 'WAITFORINPUT')
            const promises = [io.input()] as Promise<string | void>[]
            if (parseInt(timeout, 10) > 0) {
                promises.push(delay(parseInt(timeout, 10)))
            }
            const inputOrTimeout = await Promise.race(promises)
            if (typeof inputOrTimeout === 'string') {
                // 未超时则得到输入
                runtime.input = inputOrTimeout
                console.log('RUNNER', 'INPUT', runtime.input)
            } else {
                // 超时后递归执行子命令
                console.log('RUNNER', 'TIMEOUT')
                runtime = await runCommand(children, io, runtime)
            }
            break
        }
        case 'for':
            {
                let value = (command as ICommand1).value
                let children = (command as ICommand1WithChildren).children
                let matched = false
                if (value.indexOf('/') === 0) {
                    // 这里简单的认为/xxx/x是个正则
                    const regex = new RegExp(value.slice(1, -1))
                    matched = regex.test(runtime.input)
                    console.log('RUNNER', 'FOR REGEX', value, runtime.input, matched)
                } else {
                    // 否则直接进行全比较
                    matched = runtime.input === value
                    console.log('RUNNER', 'FOR', value, runtime.input, matched)
                }
                if (matched) {
                    // 一但匹配上，就清除input字段
                    runtime.input = ''
                    // 匹配成功，递归执行子命令
                    runtime = await runCommand(children, io, runtime)
                } else {
                    // 往下走
                }
            }
            break
        case 'default': {
            if (runtime.input) {
                const children = (command as ICommandWithChildren).children
                runtime = await runCommand(children, io, runtime)
            }
        }
    }
    return runtime
}
/**
 * @function run
 * @description 进行一次解析并执行操作
 * @param {IBlock[]} block 解析生成的程序片段
 * @param {IInterface} interface 实现了 input() 和 output() 方法的对象
 * @param {IRuntime} runtime 暂存环境，包含当前执行的 block 和 index，以及 input值
 * @returns {Promise<IRuntime>}
 */
export function run(blocks: IBlock[], io: IInterface, runtime: IRuntime) {
    runtime.block = runtime.block || blocks[0].name
    runtime.index = runtime.index || 0
    runtime.input = runtime.input || ''
    runtime.storage = runtime.storage || {}
    if (runtime.index === -1) {
        // 已经停机，什么都不做
        return runtime
    }
    let block = blocks.find((e) => e.name === runtime.block)
    if (block === undefined) {
        throw new Error('block not found')
    }
    let command = block.commands[runtime.index]
    if (command === undefined) {
        throw new Error('command not found')
    }
    return runCommand(command, io, runtime)
}

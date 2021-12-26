import { ICommand } from '@/lib/parser'
import { runCommand } from '@/lib/interpreter/index'
import { IRuntime } from '@/lib/interpreter/typing'
beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
        // ignore console output
    })
})
describe('interceptor', () => {
    it('intercepts normal input', async () => {
        expect.assertions(1)
        const runtime = {
            block: '',
            index: 0,
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'input',
            value: '100',
            children: {
                keyword: 'goto',
                value: 'test',
            },
        } as ICommand
        const rand = Math.random().toString()
        const io = {
            input: () => Promise.resolve(rand),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.input).toBe(rand)
    })

    it('intercepts timeout input', async () => {
        expect.assertions(1)
        const runtime = {
            block: '',
            index: 0,
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'input',
            value: '1',
            children: {
                keyword: 'goto',
                value: 'test',
            },
        } as ICommand
        const io = {
            input: () =>
                new Promise(() => {
                    // a promise that never resolve
                }) as Promise<string>,
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.block).toBe('test')
    })

    it('intercepts output', async () => {
        expect.assertions(1)
        const rand = Math.random().toString()
        const randword = `hello ${rand}`
        const runtime = {
            block: '',
            index: 0,
            input: '',
            storage: {
                rand: rand,
            },
        } as IRuntime
        const command = {
            keyword: 'output',
            value: encodeURIComponent(JSON.stringify(`hello \${rand}`)),
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: (value: string) => {
                expect(value).toBe(randword)
            },
        }
        await runCommand(command, io, runtime)
    })

    it('intercepts exit', async () => {
        expect.assertions(1)
        const runtime = {
            block: '',
            index: 0,
            input: '',
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'exit',
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.index).toBe(-1)
    })

    it('intercepts pass', async () => {
        expect.assertions(1)
        const runtime = {
            block: '',
            index: 0,
            input: '',
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'pass',
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.index).toBe(1)
    })

    it('intercepts goto', async () => {
        expect.assertions(1)
        const runtime = {
            block: '',
            index: 0,
            input: '',
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'goto',
            value: 'test',
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.block).toBe('test')
    })

    it('intercepts default', async () => {
        expect.assertions(1)
        const runtime = {
            block: '',
            index: 0,
            input: '',
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'default',
            children: {
                keyword: 'goto',
                value: 'test',
            },
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        // default command should not change the block without input
        expect(result.block).toBe('')
    })

    it('intercepts save', async () => {
        expect.assertions(1)
        const rand = Math.random().toString()
        const runtime = {
            block: '',
            index: 0,
            input: rand,
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'save',
            value: 'test',
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.storage.test).toBe(rand)
    })

    it('intercepts eval', async () => {
        expect.assertions(1)
        const rand1 = Math.round(Math.random() * 100)
        const rand2 = Math.round(Math.random() * 100)
        const runtime = {
            block: '',
            index: 0,
            input: '',
            storage: {
                result: '0',
            },
        } as IRuntime
        const command = {
            keyword: 'eval',
            value: `result=${rand1}+${rand2}`,
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.storage.result).toBe(rand1 + rand2)
    })

    it('intercepts matched for', async () => {
        expect.assertions(1)
        const runtime = {
            block: '',
            index: 0,
            input: 'wordtestword',
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'for',
            value: '/test/',
            children: {
                keyword: 'goto',
                value: 'test',
            },
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.block).toBe('test')
    })

    it('intercepts unmatched for', async () => {
        expect.assertions(2)
        const runtime = {
            block: '',
            index: 0,
            input: 'wordword',
            storage: {},
        } as IRuntime
        const command = {
            keyword: 'for',
            value: '/test/',
            children: {
                keyword: 'goto',
                value: 'test',
            },
        } as ICommand
        const io = {
            input: () => Promise.resolve(''),
            output: () => {
                // do nothing
            },
        }
        const result = await runCommand(command, io, runtime)
        expect(result.block).toBe('')
        expect(result.index).toBe(1)
    })
})

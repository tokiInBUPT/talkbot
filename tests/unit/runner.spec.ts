import { Runner } from '@/lib/runner/index'
import { parse } from '@/lib/parser/index'
import { run } from '@/lib/interpreter/index'
import delay from 'delay'
jest.mock('@/lib/parser/index')
jest.mock('@/lib/interpreter/index')
const mockedParse = <jest.MockedFunction<typeof parse>>(<unknown>parse)
const mockedRun = <jest.MockedFunction<typeof run>>(<unknown>run)
beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
        // ignore console output
    })
})
describe('runner', () => {
    it('calls compiler', async () => {
        expect.assertions(2)
        const rand = Math.random().toString()
        const runner = new Runner()
        mockedParse.mockReturnValue([{ name: rand, commands: [] }])
        const code = `${rand} {}`
        runner.compile(code)
        expect(mockedParse).toHaveBeenCalledWith(code)
        expect(runner.blocks[0].name).toBe(rand)
    })

    it('calls interpreter in runOnce', async () => {
        expect.assertions(2)
        const rand = Math.random().toString()
        const runner = new Runner()
        runner.blocks = [
            {
                name: 'main',
                commands: [
                    {
                        keyword: 'input',
                        value: rand,
                        children: {
                            keyword: 'goto',
                            value: 'test',
                        },
                    },
                ],
            },
        ]
        mockedRun.mockResolvedValue({
            block: 'main',
            index: 1,
            input: rand,
            storage: {},
        })
        let emptyRuntime = runner.runtime
        await runner.runOnce()
        expect(mockedRun).toHaveBeenCalledWith(runner.blocks, runner.io, emptyRuntime)
        expect(runner.runtime.input).toBe(rand)
    })

    it('stops after exit', async () => {
        expect.assertions(1)
        const runner = new Runner()
        runner.blocks = [
            {
                name: 'main',
                commands: [
                    {
                        keyword: 'exit',
                    },
                ],
            },
        ]
        mockedRun.mockResolvedValue({
            block: 'main',
            index: -1,
            input: '',
            storage: {},
        })
        runner.stopped = false
        await runner.run()
        expect(runner.stopped).toBe(true)
    })

    it('stops when forced', async () => {
        expect.assertions(1)
        const runner = new Runner()
        runner.blocks = [
            {
                name: 'main',
                commands: [
                    {
                        keyword: 'input',
                        value: '0', // never timeout
                        children: {
                            keyword: 'goto',
                            value: 'test',
                        },
                    },
                ],
            },
        ]
        mockedRun.mockImplementation(async (blocks, io, runtime) => {
            // 模拟interpreter的行为：run会等到输入来之后才结束
            await io.input()
            return runtime
        })
        runner.stopped = false
        runner.run()
        await delay(500)
        await runner.stop()
        expect(runner.stopped).toBe(true)
    })
})

import { ICommand1, ICommand1WithChildren, parse } from '@/lib/parser'
import { readFileSync } from 'fs'
import { resolve } from 'path'
describe('grammar.pegjs', () => {
    const content = readFileSync(resolve(__dirname, './test.rsl'), 'utf8')
    const result = parse(content)
    it('parses multiple sections', () => {
        expect(result.length).toBe(4)
    })
    it('parses multiple commands', () => {
        expect(result[1].commands.length).toBe(6)
    })
    it('parses values and subcommands', () => {
        let c = result[1].commands.find((e) => e?.value === '/成绩/') as ICommand1WithChildren
        c.children as ICommand1
        expect(c.children.value).toBe('grade')
    })
})

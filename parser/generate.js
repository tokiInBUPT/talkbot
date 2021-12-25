/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const peggy = require('peggy')
const tspegjs = require('ts-pegjs')
const input = resolve(__dirname, './grammar.pegjs')
let parser = peggy.generate(readFileSync(input).toString(), {
    output: 'source',
    format: 'commonjs',
    plugins: [tspegjs],
    tspegjs: {
        customHeader: `/* eslint-disable */\n` + readFileSync(resolve(__dirname, './typing.ts')).toString(),
    },
})
parser = parser.replace(
    'export type ParseFunction = (input: string, options?: IParseOptions) => any;',
    'export type ParseFunction = (input: string, options?: IParseOptions) => IBlock[];',
)
writeFileSync(resolve(__dirname, '../src/lib/parser/index.ts'), parser)

export interface IRuntime {
    block: string
    index: number
    input: string
    storage: Record<string, string>
}
export interface IInterface {
    input: () => Promise<string>
    output: (value: string) => unknown
}

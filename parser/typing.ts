export interface ICommand {
    keyword: string
    value?: string
    // 递归嵌套，故关闭规则
    // eslint-disable-next-line no-use-before-define
    children?: ICommand0 | ICommand1
}
export interface ICommand0 extends ICommand {
    keyword: 'pass' | 'exit'
}
export interface ICommand1 extends ICommand {
    keyword: 'output' | 'goto' | 'save' | 'eval'
    value: string
}
export interface ICommandWithChildren extends ICommand {
    keyword: 'default' | 'silence'
    children: ICommand0 | ICommand1
}
export interface ICommand1WithChildren extends ICommand {
    keyword: 'input' | 'for'
    value: string
    children: ICommand0 | ICommand1
}
export interface IBlock {
    name: string
    commands: ICommand[]
}

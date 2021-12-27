# talkbot

## 程序设计实践大作业：基于DSL解析器实现的可编程聊天机器人

### 安装依赖项
```
yarn install
```

### 启动开发环境
```
yarn serve
```

### 打包编译
```
yarn build
```
本工程已配置为单文件编译，打包后的产物中`index.html`可直接独立运行。

### 运行测试集
```
yarn test
```

### 运行语法检查和修复
```
yarn lint --fix
```

## 简要说明（详细参见[文档](docs.md)）

### 使用说明
 1. 打开编译生成的HTML文件（或打开开发环境）
 2. 左侧的编辑器中会自动载入默认代码。此时可以任意修改代码。
 3. 点击运行，即可在聊天窗口中和机器人对话。
 4. 使用变量管理器可以创建、修改、删除机器人运行环境中的变量。  
    **注意：**在代码中调用未定义的变量会抛出运行时错误。
 5. 你可以在任何时候停止代码的运行。

### 设计说明
 1. 设计语法模式，使用库实现DSL解析器
 2. 设计对解析后语法树的执行器
 3. 设计交互界面

### 测试脚本
```javascript
main {
    output "您好，您可以对我描述您的问题。"
    goto menu
}
menu {
    input 10000 goto silence
    goto processInput
}
processInput {
    for /您好|你好/ goto hello
    for /余额/ goto balance
    for /充值/ goto pay
    for /成绩/ goto grade
    for /学费/ goto billing
    for /退学/ goto unroll
    for /人工/ goto service
    default goto default
}
hello {
    output "您好，很高兴见到你。"
    goto menu
}
balance {
    output "您的校园卡余额是：${balance}，请问还有什么可以帮到您？"
    goto menu
}
pay {
    output "请输入您的充值金额"
    input 0 goto pay
    save charge
    eval balance=Number(balance)+Number(charge)
    output "您已充值%20${charge}%20元，当前余额为%20${balance}%20元，请问还有什么可以帮到您？"
    goto menu
}
grade {
    output "您的成绩是：${grade}，请问还有什么可以帮到您？"
    goto menu
}
billing {
    output "您本学期的当前学费${billed>0?'已':'未'}缴交，请问还有什么可以帮到您？"
    goto menu
}
unroll {
    output "已为您申请一键退学，再见。"
    exit
}
service {
    output "人工服务当前不在线，您可以在此处留言。"
    input 10000 goto silence
    output "您的留言已收到，感谢您的支持。请问还有什么可以帮到您？"
    goto menu
}
silence {
    output "您已经一段时间没有说话了，您可以随时继续向我提问。"
    input 0 goto silence
    goto processInput
}
default {
    output "这个知识点我还没有明白，您可以问问其他的，或者转人工服务。"
    goto menu
}
```
# talkbot

## 程序设计实践大作业
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

# 简要说明（详细参见文档）

## 设计说明
 1. 设计语法模式，使用库实现DSL解析器
 2. 设计对解析后语法树的执行器
 3. 设计交互界面
 4. 如果能力能实现，自行实现DSL解析器，将原有解析模块更改为测试桩
 5. 对交互界面也尽可能的实现测试

## 语法格式
main {
    output "您好，您可以对我描述您的问题"
    goto menu
}
menu {
    input
    for /成绩/ goto grade
    for /学费/ goto billing
    for /退学/ goto unroll
    for /人工/ goto unroll
    silence goto silence
    default goto default
}
silence {
    output "我好像没听清楚，您可以尝试再说一次"
    goto menu
}
default {
    output "这个知识点我还没有明白，您可以问问其他的，或者转人工服务"
    goto menu
}
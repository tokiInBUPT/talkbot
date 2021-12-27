# 文档

## 语法说明

1.  Script  
    `Script`是控制程序运行流程的代码，由多个`Block`组成。其中必需包含一个名为 main 的`Block`。解释器将从该命令开始运行程序流程。代码中暂时不支持注释，也不支持在第一个`Block`之前有空行。

2.  Block  
    一个`Block`的结构如下：

    ```javascript
    main {
        command1
        command2
    }
    ```

    其中，大括号前如`main`的字符串是该`Block`的名称(`name`)；大括号中的是该`Block`的指令列表(`Commands`)。尤其需要注意的是，由于字符串匹配上的实现限制，在名称和左大括号之间，需要有一个空格，否则将无法解析。

3.  Command  
    每个 Block 中都有一个或多个`Command`。`Command`的关键词和参数应使用空格隔开，所以参数中应当不含有空格。当有存在空格的可能性时，部分指令提供了转义方法。
    `Command`包含以下几种：

    *   无参数指令

        *   exit  
            结束程序的执行。

        *   pass
            空指令，什么都不做。

    *   单参数指令

        *   `goto [blockName]`  
            跳转到`[blockName]`的第一条指令。

        *   `save [varname]`  
            将输入缓冲区的内容保存到变量中。

        *   `outout [string]`  
            输出`[string]`中的内容。此处的`[string]`可以是符合标准的`javascript字符串模板`，这样就能在输出中使用变量。  
            需要注意的是，若字符串模板中的`javascript`代码出现了问题，程序将抛出运行时错误。  
            如需包含空格或特殊字符，可以用双引号包裹字符并使用`urlencode`编码。在`javascript`中例：`encodeURIComponent(string)`。

        *   `eval [code]`  
            直接执行`[code]`中的`javascript`代码，可直接调用存在的变量，但不能新建变量——新建变量必须通过`save`指令进行。  
            需要注意的是，若代码出现了问题，程序将抛出运行时错误。

    *   含子指令的指令

        *   `default [subcommand]`  
            在输入缓冲区不为空的时候，执行`[subcommand]`。否则，继续向下执行。  
            通常置于多条用户输入匹配指令之后。  
            **子指令只能为无参数指令或单参数指令。**

    *   含子指令的单参数指令

        *   `input [timeout] [subcommand]`  
            接受一次用户输入，并存入至缓冲区中。  
            若`[timeout]`毫秒后还未能得到用户输入，则执行`[subcommand]`。否则，继续向下执行。  
            特别地，当`[timeout]`为 0 时，将一直等待用户输入，永不超时。  
            **子指令只能为无参数指令或单参数指令。**

        *   `for [pattern] [subcommand]`  
            判断缓冲区中的用户输入是否满足`[pattern]`。

            *   若`[pattern]`的第一位字符是`/`，这里将简单地认为它满足`/xxx/`这样的形式，并把它处理为一个正则表达式用于对输入缓冲区进行匹配

            *   否则，将对输入缓冲区和`[pattern]`进行字符串比较。

            若匹配成功，则执行`[subcommand]`。否则，继续向下执行。  
            **子指令只能为无参数指令或单参数指令。**

    需要要注意的是，每个`Block`中的最后一条`Command`必须是 goto 或 exit，否则当运行完最后一条指令后，将会因为无法明确接下来该运行的指令而抛出运行时错误。

## 模块划分与关联
程序由四个部分组成：`Parser`、`Interpreter`、`Runner`和GUI部分。  

### Parser
暴露`parse`函数，用于将文本形式的代码通过词法分析、语法分析解析为语法树。  
该部分代码为使用`PEGjs`从一个PEG语法自动生成，实际语法位于`grammer.pegjs`。

### Interpreter
暴露`run`和`runCommand`函数，用于解析运行单句指令。

### Runner
暴露`Runner`类，实现对`Parser`和`Interpreter`的整合，并实现代码的连续运行和终止运行、简易的错误处理。

### GUI部分
GUI部分由`monaco-editor`实现的代码编辑器、变量管理器、聊天窗口、操作栏组成，所有数据在`bus.js`内统一管理，并通过`globalEV`以事件驱动的方式实现跨组件通信。
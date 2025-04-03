---
title: "介绍"
draft: false
weight: 1
---
Gin 是一个用 Go (Golang) 编写的 Web 框架。 它具有类似 martini 的 API，性能要好得多，多亏了 [httprouter](https://github.com/julienschmidt/httprouter)，速度提高了 40 倍。 如果您需要性能和良好的生产力，您一定会喜欢 Gin。

在本节中，我们将介绍 Gin 是什么，它解决了哪些问题，以及它如何帮助你的项目。

或者, 如果你已经准备在项目中使用 Gin，请访问[快速入门](https://gin-gonic.com/zh-cn/docs/quickstart/).

## 特性

### 快速

基于 Radix 树的路由，小内存占用。没有反射。可预测的 API 性能。

### 支持中间件

传入的 HTTP 请求可以由一系列中间件和最终操作来处理。
例如：Logger，Authorization，GZIP，最终操作 DB。

### Crash 处理

Gin 可以 catch 一个发生在 HTTP 请求中的 panic 并 recover 它。这样，你的服务器将始终可用。例如，你可以向 Sentry 报告这个 panic！

### JSON 验证 

Gin 可以解析并验证请求的 JSON，例如检查所需值的存在。

### 路由组

更好地组织路由。是否需要授权，不同的 API 版本...... 此外，这些组可以无限制地嵌套而不会降低性能。

### 错误管理

Gin 提供了一种方便的方法来收集 HTTP 请求期间发生的所有错误。最终，中间件可以将它们写入日志文件，数据库并通过网络发送。

### 内置渲染

Gin 为 JSON，XML 和 HTML 渲染提供了易于使用的 API。

### 可扩展性

新建一个中间件非常简单，去查看[示例代码](https://gin-gonic.com/zh-cn/docs/examples/using-middleware/)吧。

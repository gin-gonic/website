---
title: Gin Web Framework
linkTitle: Gin Web Framework
---

{{< blocks/cover title="Gin Web Framework" image_anchor="top" height="full" >}}
<a class="btn btn-lg btn-primary me-3 mb-4" href="/docs/"> 了解更多
<i class="fas fa-arrow-alt-circle-right ms-2"></i> </a>
<a class="btn btn-lg btn-secondary text-dark me-3 mb-4" href="https://github.com/gin-gonic/gin/releases">
下载 <i class="fab fa-github ms-2 "></i> </a>

<p class="lead mt-5">Go语言最快的全功能Web框架。晶莹剔透。 </p>

{{< blocks/link-down color="info" >}} {{< /blocks/cover >}}

{{% blocks/lead color="white" %}}

**什么是 Gin?**

Gin 是一个使用 Go 语言开发的 Web 框架。

它提供类似 Martini 的 API，但性能更佳，速度提升高达 40 倍。

如果你是性能和高效的追求者, 你会爱上 Gin。

{{% /blocks/lead %}}

{{% blocks/section color="light" type="row" %}}

{{% blocks/feature icon="fa-tachometer-alt" title="快速" %}}

基于 Radix 树的路由，小内存占用。没有反射。可预测的 API 性能。

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-bars" title="支持中间件" %}}

传入的 HTTP 请求可以由一系列中间件和最终操作来处理。例如
：Logger，Authorization，GZIP，最终操作 DB。

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-life-ring" title="Crash 处理" %}}

Gin 可以 catch 一个发生在 HTTP 请求中的 panic 并 recover 它。这样，你的服务器将
始终可用。例如，你可以向 Sentry 报告这个 panic！

{{% /blocks/feature %}}

{{< /blocks/section >}}

{{% blocks/section color="white" type="row" %}}

{{% blocks/feature icon="fa-check-circle" title="JSON 验证" %}}

Gin 可以解析并验证请求的 JSON，例如检查所需值的存在。

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-users-cog" title="路由组" %}}

Gin 帮助您更好地组织您的路由，例如，按照需要授权和不需要授权和不同 API 版本进行
分组。此外，路由分组可以无限嵌套而不降低性能。

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-briefcase" title="错误管理" %}}

Gin 提供了一种方便的方法来收集 HTTP 请求期间发生的所有错误。最终，中间件可以将它
们写入日志文件，数据库并通过网络发送。

{{% /blocks/feature %}}

{{< /blocks/section >}}

{{% blocks/section color="info" type="row" %}}

{{% blocks/feature icon="fa fa-images" title="内置渲染" %}}

Gin 为 JSON，XML 和 HTML 渲染提供了易于使用的 API。

{{% /blocks/feature %}}

{{% blocks/feature icon="fa fa-code" title="可扩展性" %}}

新建一个中间件非常简单，去查
看[示例代码](https://gin-gonic.com/zh-cn/docs/examples/using-middleware/)吧。

{{% /blocks/feature %}}

{{< /blocks/section >}}

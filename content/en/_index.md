---
title: Gin Web Framework
linkTitle: Gin Web Framework
---

{{< blocks/cover title="Gin Web Framework" image_anchor="top" height="full" >}}
<a class="btn btn-lg btn-primary me-3 mb-4" href="/docs/"> Learn More
<i class="fas fa-arrow-alt-circle-right ms-2"></i> </a>
<a class="btn btn-lg btn-secondary text-dark me-3 mb-4" href="https://github.com/gin-gonic/gin/releases">
Download <i class="fab fa-github ms-2 "></i> </a>

<p class="lead mt-5">The fastest full-featured web framework for Go. Crystal clear.</p>

{{< blocks/link-down color="info" >}} {{< /blocks/cover >}}

{{% blocks/lead color="white" %}}

**What is Gin?**

Gin is a web framework written in Golang. It features a Martini-like API, but
with performance up to 40 times faster than Martini. If you need performance and
productivity, you will love Gin.

{{% /blocks/lead %}}

{{% blocks/section color="light" type="row" %}}
{{% blocks/feature icon="fa-tachometer-alt" title="Fast" %}}

Radix tree based routing, small memory foot print. No reflection. Predictable
API performance.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-bars" title="Middleware support"%}}

An incoming HTTP request can be handled by a chain of middleware and the final
action. For example: Logger, Authorization, GZIP and finally post a message in
the DB.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-life-ring" title="Crash-free"  %}}

Gin can catch a panic occurred during a HTTP request and recover it. This way,
your server will be always available. It’s also possible to report this panic to
Sentry for example! {{% /blocks/feature %}}

{{% /blocks/section %}}

{{% blocks/section color="white" type="row" %}}

{{% blocks/feature icon="fa-check-circle" title="JSON validation" %}}

Gin can parse and validate the JSON of a request, checking, for example, the
existence of required values.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-users-cog" title="Routes grouping"%}}

Organize your routes better. Authorization required vs non required, different
API versions. In addition, groups can be nested infinitely without degrading
performance.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-briefcase" title="Error management"  %}}

Gin provides a convenient way to collect all the errors occurred during a HTTP
request. Eventually, middleware can write them to a log file, to a database and
send them through the network.

{{% /blocks/feature %}}

{{% /blocks/section %}}

{{% blocks/section color="info" type="row" %}}

{{% blocks/feature icon="fa-images" title="Rendering built-in" %}}

Gin provides an easy to use API for JSON, XML and HTML rendering.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-code" title="Extendable"%}}

Creating new middleware is so easy, just check out the sample code.

{{% /blocks/feature %}}

{{% /blocks/section %}}

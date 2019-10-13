---
title: "Introduction"
draft: false
weight: 1
---

Gin is a web framework written in Go (Golang). It features a martini-like API with much better performance, up to 40 times faster thanks to [httprouter](https://github.com/julienschmidt/httprouter). If you need performance and good productivity, you will love Gin.

In this section we will walk through what Gin is, what problems it solves, and how it can help your project.

Or, if you are ready to use Gin in to your project, visit the [Quickstart](https://gin-gonic.com/docs/quickstart/).

## Features

### Fast

Radix tree based routing, small memory foot print. No reflection. Predictable API performance. 

### Middleware support

An incoming HTTP request can be handled by a chain of middlewares and the final action. 
For example: Logger, Authorization, GZIP and finally post a message in the DB.

### Crash-free

Gin can catch a panic occurred during a HTTP request and recover it. This way, your server will be always available. As an example - it’s also possible to report this panic to Sentry!

### JSON validation 

Gin can parse and validate the JSON of a request - for example,checking the existence of required values.

### Routes grouping

Organize your routes better. Authorization required vs non required, different API versions... In addition, the groups can be nested unlimitedly without degrading performance.

### Error management

Gin provides a convenient way to collect all the errors occurred during a HTTP request. Eventually, a middleware can write them to a log file, to a database and send them through the network.

### Rendering built-in

Gin provides a easy to use API for JSON, XML and HTML rendering.

### Extendable

Creating a new middleware is so easy, just check out the sample codes.


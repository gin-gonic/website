---
title: "不使用默认的中间件"
draft: false
---

使用

```go
r := gin.New()
```

代替

```go
// Default 使用 Logger 和 Recovery 中间件
r := gin.Default()
```

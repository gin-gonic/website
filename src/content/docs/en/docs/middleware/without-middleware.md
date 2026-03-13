---
title: "Without middleware by default"
sidebar:
  order: 1
---

Use

```go
r := gin.New()
```

instead of

```go
// Default With the Logger and Recovery middleware already attached
r := gin.Default()
```

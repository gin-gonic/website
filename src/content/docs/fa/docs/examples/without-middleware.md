---
title: "Without middleware by default"

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

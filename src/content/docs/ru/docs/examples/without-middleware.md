---
title: "Без промежуточного ПО по умолчанию"
draft: false
---

Используйте

```go
r := gin.New()
```

место

```go
// Default With the Logger and Recovery middleware already attached
r := gin.Default()
```

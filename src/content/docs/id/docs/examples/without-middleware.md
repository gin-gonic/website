---
title: "Tanpa middleware bawaan"
---

Gunakan

```go
r := gin.New()
```

alih-alih

```go
// Bawaan dengan middleware Logger dan Recovery sudah terpasang
r := gin.Default()
```

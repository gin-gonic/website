---
title: "Usar Gin sin los middleware por defecto"
---

Utilice

```go
r := gin.New()
```

En vez de

```go
// De esta forma
// Los middleware Logger y Recovery ya vienen activos
r := gin.Default()
```

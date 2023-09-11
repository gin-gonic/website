---
title: "Sem Intermediário por Padrão"
draft: false
---

Use:

```go
r := gin.New()
```

Ao invés de:

```go
// predefine com o intermediário registador e de recuperação já em anexo.
r := gin.Default()
```

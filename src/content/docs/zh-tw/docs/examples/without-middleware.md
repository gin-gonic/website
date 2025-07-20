---
title: "預設不使用中介軟體"
---

使用

```go
r := gin.New()
```

來取代

```go
// 預設已附加 Logger 和 Recovery 中介軟體
r := gin.Default()
```

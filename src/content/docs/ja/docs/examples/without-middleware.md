---
title: "デフォルトで設定されるミドルウェアがない空の Gin を作成する"
draft: false
---

```go
r := gin.New()
```

下記のコードではなく、上記のコードを利用する

```go
// Default は Logger と Recovery ミドルウェアが既にアタッチされている
r := gin.Default()
```



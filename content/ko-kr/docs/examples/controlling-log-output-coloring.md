---
title: "로그 출력 색상 설정"
draft: false
---

기본적으로, 출력되는 로그의 색상은 감지된 TTY에 따라 지정 됩니다.

로그에 색상이 적용되지 않습니다:

```go
func main() {
    // 로그 색상을 비활성화 합니다
    gin.DisableConsoleColor()

    // 기본 미들웨어를 포함한 gin 라우터를 생성합니다:
    // logger와 recovery (crash-free) 미들웨어가 포함됩니다.
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

항상 로그의 색상이 적용됩니다:

```go
func main() {
    // 강제적으로 로그의 색상을 지정합니다
    gin.ForceConsoleColor()

    // 기본 미들웨어를 포함한 gin 라우터를 생성합니다:
    // logger와 recovery (crash-free) 미들웨어가 포함됩니다.
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

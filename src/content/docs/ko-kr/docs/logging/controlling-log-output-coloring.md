---
title: "로그 출력 색상 제어"
sidebar:
  order: 4
---

기본적으로 콘솔의 로그 출력은 감지된 TTY에 따라 색상이 적용됩니다.

로그 색상 비활성화:

```go
func main() {
    // 로그 색상 비활성화
    gin.DisableConsoleColor()

    // 기본 미들웨어로 gin 라우터를 생성합니다:
    // 로거 및 복구(크래시 방지) 미들웨어
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

로그 색상 항상 활성화:

```go
func main() {
    // 로그 색상 강제 적용
    gin.ForceConsoleColor()

    // 기본 미들웨어로 gin 라우터를 생성합니다:
    // 로거 및 복구(크래시 방지) 미들웨어
    router := gin.Default()

    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

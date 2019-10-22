---
title: "로그 파일을 작성하는 방법"
draft: false
---

```go
func main() {
    // 로그 파일 작성에는 색상이 필요 없으므로, 콘솔 색상을 비활성화 합니다.
    gin.DisableConsoleColor()

    // 파일에 로그를 작성합니다.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // 파일과 동시에 콘솔에도 로그를 작성해야 하는 경우에는 다음과 같은 코드를 사용하세요.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

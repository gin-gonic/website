---
title: "로그 파일 작성 방법"
sidebar:
  order: 1
---

로그를 파일에 기록하는 것은 디버깅, 감사 또는 모니터링을 위해 요청 기록을 보존해야 하는 프로덕션 애플리케이션에 필수적입니다. 기본적으로 Gin은 모든 로그 출력을 `os.Stdout`에 기록합니다. 라우터를 생성하기 전에 `gin.DefaultWriter`를 설정하여 이를 리다이렉트할 수 있습니다.

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // 콘솔 색상 비활성화, 로그를 파일에 기록할 때는 콘솔 색상이 필요하지 않습니다.
    gin.DisableConsoleColor()

    // 파일에 로깅.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // 로그를 파일과 콘솔에 동시에 기록하려면 다음 코드를 사용하세요.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### 파일과 콘솔에 동시 기록

Go 표준 라이브러리의 `io.MultiWriter` 함수는 여러 `io.Writer` 값을 받아 모든 곳에 쓰기를 복제합니다. 개발 중에 터미널에서 로그를 보면서 디스크에도 저장하고 싶을 때 유용합니다:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

이 설정으로 모든 로그 항목이 `gin.log`와 콘솔에 동시에 기록됩니다.

### 프로덕션에서의 로그 로테이션

위 예제는 `os.Create`를 사용하여 애플리케이션이 시작될 때마다 로그 파일을 잘라냅니다. 프로덕션에서는 일반적으로 기존 로그에 추가하고 크기나 시간에 따라 파일을 로테이션하기를 원합니다. [lumberjack](https://github.com/natefinch/lumberjack)와 같은 로그 로테이션 라이브러리 사용을 고려하세요:

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // 메가바이트
        MaxBackups: 3,
        MaxAge:     28, // 일
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### 참고

- [커스텀 로그 형식](../custom-log-format/) -- 자체 로그 라인 형식을 정의합니다.
- [로그 출력 색상 제어](../controlling-log-output-coloring/) -- 색상 출력을 비활성화하거나 강제합니다.
- [로깅 건너뛰기](../skip-logging/) -- 특정 라우트를 로깅에서 제외합니다.

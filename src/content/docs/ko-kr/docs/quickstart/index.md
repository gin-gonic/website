---
title: "빠른 시작"
sidebar:
  order: 2
---

Gin 빠른 시작 가이드에 오신 것을 환영합니다! 이 문서는 Gin 설치, 프로젝트 세팅, 첫 API 실행까지의 모든 단계를 쉽게 따라할 수 있도록 구성되어 있습니다.

## 준비 사항

- **Go**: 버전 1.23 이상이 설치되어 있어야 합니다.
- Go가 `PATH`에 등록되어 있고 터미널에서 실행 가능한지 확인하세요. 설치 방법은 [공식 문서](https://golang.org/doc/install)에서 확인할 수 있습니다.

---

## 1단계: Gin 설치 및 프로젝트 초기화

새 프로젝트 폴더를 만들고 Go 모듈을 초기화합니다:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Gin 패키지를 설치합니다:

```sh
go get -u github.com/gin-gonic/gin
```

---

## 2단계: 첫 Gin 앱 만들기

`main.go` 파일을 생성하세요:

```sh
touch main.go
```

`main.go`에 아래 코드를 추가합니다:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  router.Run() // 0.0.0.0:8080에서 기본적으로 서버를 엽니다
}
```

---

## 3단계: API 서버 실행

서버를 실행합니다:

```sh
go run main.go
```

브라우저에서 [http://localhost:8080/ping](http://localhost:8080/ping)으로 접근하면 아래와 같은 결과를 볼 수 있습니다:

```json
{"message":"pong"}
```

---

## 추가 예제: Gin에서 net/http 활용

응답 코드에 net/http의 상수를 사용하려면 아래와 같이 import 합니다:

```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  router.Run()
}
```

---

## 팁과 자료

- Go가 처음이라면 [여기](https://golang.org/doc/code.html)에서 코드 작성 및 실행 방법을 확인하세요.
- Gin 개념을 실습해보고 싶으신가요? 인터랙티브 챌린지와 튜토리얼을 위해 [학습 자료](../learning-resources)를 확인해보세요.
- 더 완성된 예시가 필요하다면 다음 코드를 참고하세요:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- 자세한 문서는 [Gin 공식 문서](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)에서 확인하세요.

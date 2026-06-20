---
title: "빠른 시작"
sidebar:
  order: 2
---

Gin 빠른 시작에 오신 것을 환영합니다! 이 가이드에서는 Gin 설치, 프로젝트 설정, 첫 번째 API 실행까지 안내하여 웹 서비스를 자신 있게 구축할 수 있도록 도와줍니다.

## 사전 요구 사항

- **Go 버전**: Gin은 [Go](https://go.dev/) [1.25](https://go.dev/doc/devel/release#go1.25) 이상이 필요합니다
- Go가 `PATH`에 설정되어 있고 터미널에서 사용 가능한지 확인하세요. Go 설치에 대한 도움은 [공식 문서를 참조하세요](https://go.dev/doc/install).

---

## 1단계: Gin 설치 및 프로젝트 초기화

새 프로젝트 폴더를 만들고 Go 모듈을 초기화합니다:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

의존성으로 Gin을 추가합니다:

```sh
go get -u github.com/gin-gonic/gin
```

---

## 2단계: 첫 번째 Gin 앱 만들기

`main.go`라는 파일을 생성합니다:

```sh
touch main.go
```

`main.go`를 열고 다음 코드를 추가합니다:

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
  router.Run() // 기본적으로 0.0.0.0:8080에서 수신 대기
}
```

---

## 3단계: API 서버 실행

다음 명령으로 서버를 시작합니다:

```sh
go run main.go
```

브라우저에서 [http://localhost:8080/ping](http://localhost:8080/ping)으로 이동하면 다음을 볼 수 있습니다:

```json
{"message":"pong"}
```

---

## 추가 예제: Gin에서 net/http 사용하기

응답 코드에 `net/http` 상수를 사용하려면 함께 임포트하세요:

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

## 팁 및 참고 자료

- Go가 처음이신가요? [공식 Go 문서](https://go.dev/doc/code)에서 Go 코드를 작성하고 실행하는 방법을 알아보세요.
- Gin 개념을 실습하고 싶으신가요? [학습 자료](../learning-resources)에서 대화형 과제와 튜토리얼을 확인하세요.
- 완전한 기능의 예제가 필요하신가요? 다음 명령으로 스캐폴딩해 보세요:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- 더 자세한 문서는 [Gin 소스 코드 문서](https://github.com/gin-gonic/gin/blob/master/docs/doc.md)를 방문하세요.

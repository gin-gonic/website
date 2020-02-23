---
title: "퀵 스타트"
draft: false
weight: 2
---

이 퀵 스타트에서는, 코드에서 통찰력을 얻고 어떤 식으로 할지 배울 것입니다:

## 요구사항

- Go 1.9 이상

> Go 1.7, Go 1.8은 곧 지원이 중단 될 예정입니다.

## 설치

Gin을 설치 하기 위해서는, Go 언어를 설치 한 후 Go workspace를 설정해야 합니다.

1. 다운로드 후 설치하기:

```sh
$ go get -u github.com/gin-gonic/gin
```

2. 사용할 코드 내에서 임포트 하기:

```go
import "github.com/gin-gonic/gin"
```

3. (선택사항) `net/http`를 임포트 하기. `http.StatusOK` 와 같은 상수를 사용하는 경우 필요합니다.

```go
import "net/http"
```

### [Govendor](https://github.com/kardianos/govendor)같은 vendor 툴을 사용하기

1. `go get` 을 이용하여 govendor 설치

```sh
$ go get github.com/kardianos/govendor
```
2. 프로젝트 디렉토리를 작성 한 후  `cd` 로 이동하기

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

3. Vendor로 프로젝트를 초기화 한 후 Gin을 추가하기

```sh
$ govendor init
$ govendor fetch github.com/gin-gonic/gin@v1.3
```

4. 시작 템플릿을 프로젝트에 복사하기

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

5. 프로젝트 실행하기

```sh
$ go run main.go
```

## 시작하기

> Go 코드 작성 및 실행 방법을 잘 모르시나요? [여기를 클릭하세요](https://golang.org/doc/code.html).

우선 `example.go` 파일을 작성합니다.:

```sh
# 이후 코드는 example.go 파일에 작성합니다.
$ touch example.go
```

다음으로, 아래의 코드를 `example.go` 에 작성합니다.:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
}
```

그리고, `go run example.go` 로 코드를 실행합니다.:

```sh
# example.go 를 실행 후, 0.0.0.0:8080/ping 에 접속합니다.
$ go run example.go
```


---
title: "Context와 취소"
sidebar:
  order: 11
---

모든 Gin 핸들러는 `*gin.Context`를 받으며, 이는 Go의 표준 `context.Context`와 요청 및 응답 헬퍼를 래핑합니다. 기본 context를 올바르게 사용하는 방법을 이해하는 것은 타임아웃, 취소, 리소스 정리를 적절히 처리하는 프로덕션 애플리케이션을 구축하는 데 필수적입니다.

## 요청 context 접근

현재 요청의 표준 `context.Context`는 `c.Request.Context()`를 통해 사용할 수 있습니다. 이것이 모든 다운스트림 호출(데이터베이스 쿼리, HTTP 요청 또는 기타 I/O 작업)에 전달해야 하는 context입니다.

```go
package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/data", func(c *gin.Context) {
		ctx := c.Request.Context()

		// context.Context를 받는 모든 다운스트림 함수에 ctx를 전달합니다.
		log.Println("request context deadline:", ctx.Done())

		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.Run(":8080")
}
```

## 요청 타임아웃

미들웨어를 사용하여 개별 요청에 타임아웃을 적용할 수 있습니다. 타임아웃이 만료되면 context가 취소되고, context 취소를 존중하는 모든 다운스트림 호출이 즉시 반환됩니다.

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// TimeoutMiddleware는 각 요청을 context 데드라인으로 래핑합니다.
func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		// 새로운 context를 가진 요청으로 교체합니다.
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func main() {
	r := gin.Default()
	r.Use(TimeoutMiddleware(5 * time.Second))

	r.GET("/api/slow", func(c *gin.Context) {
		ctx := c.Request.Context()

		// context 데드라인을 존중하는 작업 시뮬레이션.
		select {
		case <-time.After(10 * time.Second):
			c.JSON(http.StatusOK, gin.H{"result": "done"})
		case <-ctx.Done():
			c.JSON(http.StatusGatewayTimeout, gin.H{
				"error": "request timed out",
			})
		}
	})

	r.Run(":8080")
}
```

## 데이터베이스 쿼리에 context 전달

Go의 데이터베이스 드라이버는 첫 번째 인수로 `context.Context`를 받습니다. 클라이언트가 연결을 끊거나 요청이 타임아웃되면 쿼리가 자동으로 취소되도록 항상 요청 context를 전달하세요.

```go
package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "postgres://localhost/mydb?sslmode=disable")
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	r.GET("/api/users/:id", func(c *gin.Context) {
		ctx := c.Request.Context()
		id := c.Param("id")

		var name string
		err := db.QueryRowContext(ctx, "SELECT name FROM users WHERE id = $1", id).Scan(&name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"id": id, "name": name})
	})

	r.Run(":8080")
}
```

## 외부 HTTP 호출에 context 전달

핸들러가 외부 서비스를 호출할 때, 수신 요청과 함께 외부 호출이 취소되도록 요청 context를 전달하세요.

```go
package main

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/proxy", func(c *gin.Context) {
		ctx := c.Request.Context()

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://httpbin.org/delay/3", nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
			return
		}
		defer resp.Body.Close()

		body, _ := io.ReadAll(resp.Body)
		c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
	})

	r.Run(":8080")
}
```

## 클라이언트 연결 끊김 처리

클라이언트가 연결을 닫으면(예: 다른 페이지로 이동하거나 요청을 취소할 때), 요청 context가 취소됩니다. 장시간 실행되는 핸들러에서 이를 감지하여 작업을 일찍 중단하고 리소스를 해제할 수 있습니다.

```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/stream", func(c *gin.Context) {
		ctx := c.Request.Context()

		for i := 0; ; i++ {
			select {
			case <-ctx.Done():
				log.Println("client disconnected, stopping work")
				return
			case <-time.After(1 * time.Second):
				c.SSEvent("message", gin.H{"count": i})
				c.Writer.Flush()
			}
		}
	})

	r.Run(":8080")
}
```

## 모범 사례

- **항상 요청 context를 전파하세요.** `context.Context`를 받는 모든 함수(데이터베이스 호출, HTTP 클라이언트, gRPC 호출, 모든 I/O 작업)에 `c.Request.Context()`를 전달하세요. 이렇게 하면 전체 호출 체인을 통해 취소와 타임아웃이 전파됩니다.

- **`*gin.Context`를 구조체에 저장하거나 고루틴 경계를 넘어 전달하지 마세요.** `gin.Context`는 HTTP 요청/응답 수명 주기에 연결되어 있으며 동시 사용에 안전하지 않습니다. 대신 고루틴을 시작하기 전에 필요한 값(요청 context, 매개변수, 헤더)을 추출하세요.

- **미들웨어 수준에서 타임아웃을 설정하세요.** 타임아웃 미들웨어는 모든 핸들러에서 타임아웃 로직을 중복하지 않고 모든 라우트에 데드라인을 강제하는 단일 장소를 제공합니다.

- **`context.WithValue`는 절제하여 사용하세요.** Gin 핸들러 내에서는 `c.Set()`과 `c.Get()`을 선호하세요. 표준 라이브러리 인터페이스를 통해 패키지 경계를 넘어야 하는 값에 대해서만 `context.WithValue`를 사용하세요.

## 일반적인 함정

### 고루틴에서 `gin.Context` 사용

`gin.Context`는 성능을 위해 요청 간에 재사용됩니다. 고루틴에서 접근해야 하는 경우 **반드시** `c.Copy()`를 호출하여 읽기 전용 복사본을 생성해야 합니다. 고루틴에서 원래 `gin.Context`를 사용하면 데이터 레이스와 예측할 수 없는 동작이 발생합니다.

```go
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/async", func(c *gin.Context) {
		// 잘못된 방법: 고루틴에서 c를 직접 사용.
		// go func() {
		//     log.Println(c.Request.URL.Path) // 데이터 레이스!
		// }()

		// 올바른 방법: 먼저 context를 복사.
		cCopy := c.Copy()
		go func() {
			time.Sleep(2 * time.Second)
			log.Printf("async work done for %s\n", cCopy.Request.URL.Path)
		}()

		c.JSON(http.StatusOK, gin.H{"status": "processing"})
	})

	r.Run(":8080")
}
```

### context 취소 무시

핸들러가 `ctx.Done()`을 확인하지 않으면, 클라이언트가 연결을 끊은 후에도 계속 실행되어 CPU와 메모리를 낭비합니다. context가 취소되면 작업이 즉시 중단되도록 항상 context 인식 API(`QueryRowContext`, `NewRequestWithContext`, `ctx.Done()`에 대한 `select`)를 사용하세요.

### context 취소 후 응답 작성

context가 취소된 후에는 `c.Writer`에 쓰기를 피하세요. 연결이 이미 닫혔을 수 있으며, 쓰기가 조용히 실패하거나 패닉을 일으킬 수 있습니다. 핸들러가 장시간 실행 작업을 수행하는 경우 쓰기 전에 `ctx.Err()`을 확인하세요.

```go
func handler(c *gin.Context) {
	ctx := c.Request.Context()

	result, err := doExpensiveWork(ctx)
	if err != nil {
		if ctx.Err() != nil {
			// 클라이언트가 사라졌습니다; 응답을 작성하지 않습니다.
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}
```

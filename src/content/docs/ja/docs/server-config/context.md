---
title: "コンテキストとキャンセレーション"
sidebar:
  order: 11
---

すべてのGinハンドラは`*gin.Context`を受け取ります。これはGoの標準`context.Context`をリクエストとレスポンスのヘルパーとともにラップしたものです。基盤となるコンテキストを正しく使用する方法を理解することは、タイムアウト、キャンセレーション、リソースクリーンアップを適切に処理する本番アプリケーションを構築するために不可欠です。

## リクエストコンテキストへのアクセス

現在のリクエストの標準`context.Context`は`c.Request.Context()`を通じて利用できます。これは下流の呼び出し（データベースクエリ、HTTPリクエスト、その他のI/O操作）に渡すべきコンテキストです。

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

		// Pass ctx to any downstream function that accepts context.Context.
		log.Println("request context deadline:", ctx.Done())

		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.Run(":8080")
}
```

## リクエストタイムアウト

ミドルウェアを使用して個別のリクエストにタイムアウトを適用できます。タイムアウトが期限切れになると、コンテキストがキャンセルされ、コンテキストキャンセレーションを尊重する下流の呼び出しは即座に返されます。

```go
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// TimeoutMiddleware wraps each request with a context deadline.
func TimeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		// Replace the request with one that carries the new context.
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func main() {
	r := gin.Default()
	r.Use(TimeoutMiddleware(5 * time.Second))

	r.GET("/api/slow", func(c *gin.Context) {
		ctx := c.Request.Context()

		// Simulate work that respects the context deadline.
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

## データベースクエリへのコンテキスト渡し

GoのデータベースドライバはContext.Contextを最初の引数として受け取ります。クライアントが切断したりリクエストがタイムアウトした場合にクエリが自動的にキャンセルされるよう、常にリクエストコンテキストを渡してください。

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

## 外部HTTP呼び出しへのコンテキスト渡し

ハンドラが外部サービスを呼び出す場合、リクエストコンテキストを渡して、受信リクエストと一緒に送信呼び出しがキャンセルされるようにします。

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

## クライアント切断の処理

クライアントが接続を閉じた場合（例：ページ移動やリクエストのキャンセル）、リクエストコンテキストがキャンセルされます。長時間実行されるハンドラでこれを検出して、作業を早期に停止しリソースを解放できます。

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

## ベストプラクティス

- **常にリクエストコンテキストを伝搬する。** `context.Context`を受け取るすべての関数（データベース呼び出し、HTTPクライアント、gRPC呼び出し、あらゆるI/O操作）に`c.Request.Context()`を渡します。これにより、キャンセレーションとタイムアウトがコールチェーン全体に伝搬されます。

- **`*gin.Context`を構造体に格納したり、ゴルーチンの境界を越えて渡さないでください。** `gin.Context`はHTTPリクエスト/レスポンスのライフサイクルに紐づいており、並行使用は安全ではありません。代わりに、ゴルーチンを起動する前に必要な値（リクエストコンテキスト、パラメータ、ヘッダー）を抽出してください。

- **ミドルウェアレベルでタイムアウトを設定する。** タイムアウトミドルウェアは、すべてのハンドラでタイムアウトロジックを重複させるのではなく、すべてのルートにデッドラインを適用する単一の場所を提供します。

- **`context.WithValue`は控えめに使用する。** Ginハンドラ内では`c.Set()`と`c.Get()`を優先してください。`context.WithValue`は標準ライブラリインターフェースを通じてパッケージの境界を越える必要のある値のために予約してください。

## 一般的な落とし穴

### ゴルーチンでの`gin.Context`の使用

`gin.Context`はパフォーマンスのためにリクエスト間で再利用されます。ゴルーチンからアクセスする必要がある場合は、読み取り専用のコピーを作成するために`c.Copy()`を呼び出す**必要があります**。ゴルーチンでオリジナルの`gin.Context`を使用すると、データ競合と予測不能な動作が発生します。

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
		// WRONG: using c directly in a goroutine.
		// go func() {
		//     log.Println(c.Request.URL.Path) // data race!
		// }()

		// CORRECT: copy the context first.
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

### コンテキストキャンセレーションの無視

ハンドラが`ctx.Done()`をチェックしない場合、クライアントが切断した後もCPUとメモリを浪費しながら実行し続けます。コンテキストがキャンセルされたらすぐに作業を停止するよう、常にコンテキスト対応のAPI（`QueryRowContext`、`NewRequestWithContext`、`ctx.Done()`の`select`）を使用してください。

### コンテキストキャンセル後のレスポンス書き込み

コンテキストがキャンセルされたら、`c.Writer`への書き込みを避けてください。接続が既に閉じられている可能性があり、書き込みはサイレントに失敗するかpanicが発生します。ハンドラが長時間実行される作業を行う場合は、書き込む前に`ctx.Err()`をチェックしてください。

```go
func handler(c *gin.Context) {
	ctx := c.Request.Context()

	result, err := doExpensiveWork(ctx)
	if err != nil {
		if ctx.Err() != nil {
			// Client is gone; do not write a response.
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}
```

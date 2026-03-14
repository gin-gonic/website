---
title: "Context ve İptal"
sidebar:
  order: 11
---

Her Gin işleyicisi, Go'nun standart `context.Context`'ini istek ve yanıt yardımcılarıyla birlikte saran bir `*gin.Context` alır. Temel context'in doğru kullanımını anlamak, zaman aşımlarını, iptali ve kaynak temizliğini düzgün şekilde işleyen üretim uygulamaları oluşturmak için önemlidir.

## İstek context'ine erişim

Mevcut istek için standart `context.Context`, `c.Request.Context()` aracılığıyla erişilebilir. Bu, herhangi bir alt akış çağrısına -- veritabanı sorguları, HTTP istekleri veya diğer I/O işlemleri -- geçirmeniz gereken context'tir.

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

## İstek zaman aşımları

Bir ara katman kullanarak bireysel isteklere zaman aşımı uygulayabilirsiniz. Zaman aşımı sona erdiğinde, context iptal edilir ve context iptaline saygı duyan herhangi bir alt akış çağrısı hemen döner.

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

## Context'i veritabanı sorgularına geçirme

Go'daki veritabanı sürücüleri ilk argüman olarak `context.Context` kabul eder. İstemci bağlantısını kestiğinde veya istek zaman aşımına uğradığında sorguların otomatik olarak iptal edilmesi için her zaman istek context'ini geçirin.

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

## Context'i giden HTTP çağrılarına geçirme

İşleyiciniz harici servisleri çağırdığında, giden çağrıların gelen istekle birlikte iptal edilmesi için istek context'ini geçirin.

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

## İstemci bağlantısının kesilmesini işleme

Bir istemci bağlantıyı kapattığında (ör., başka bir sayfaya gider veya isteği iptal eder), istek context'i iptal edilir. İşi erken durdurmak ve kaynakları serbest bırakmak için uzun süren işleyicilerde bunu tespit edebilirsiniz.

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

## En iyi uygulamalar

- **Her zaman istek context'ini yayın.** `c.Request.Context()`'i `context.Context` kabul eden her fonksiyona geçirin -- veritabanı çağrıları, HTTP istemcileri, gRPC çağrıları ve herhangi bir I/O işlemi. Bu, iptal ve zaman aşımlarının tüm çağrı zinciri boyunca yayılmasını sağlar.

- **`*gin.Context`'i struct'larda saklamayın veya goroutine sınırları arasında geçirmeyin.** `gin.Context` HTTP istek/yanıt yaşam döngüsüne bağlıdır ve eşzamanlı kullanım için güvenli değildir. Bunun yerine, goroutine'ler başlatmadan önce ihtiyacınız olan değerleri (istek context'i, parametreler, başlıklar) çıkarın.

- **Zaman aşımlarını ara katman düzeyinde ayarlayın.** Bir zaman aşımı ara katmanı, her işleyicide zaman aşımı mantığını çoğaltmak yerine tüm rotalarda son tarihleri uygulamak için tek bir yer sağlar.

- **`context.WithValue`'yu idareli kullanın.** Gin işleyicileri içinde `c.Set()` ve `c.Get()`'i tercih edin. `context.WithValue`'yu, standart kütüphane arayüzleri aracılığıyla paket sınırlarını aşması gereken değerler için saklayın.

## Yaygın hatalar

### Goroutine'lerde `gin.Context` kullanımı

`gin.Context`, performans için istekler arasında yeniden kullanılır. Bir goroutine'den erişmeniz gerekiyorsa, salt okunur bir kopya oluşturmak için `c.Copy()` çağırmanız **gerekir**. Orijinal `gin.Context`'i bir goroutine'de kullanmak veri yarışlarına ve öngörülemeyen davranışlara yol açar.

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

### Context iptalini yok sayma

İşleyiciniz `ctx.Done()`'u kontrol etmezse, istemci bağlantısını kestikten sonra bile çalışmaya devam eder ve CPU ile bellek harcar. İş, context iptal edilir edilmez durması için her zaman context'e duyarlı API'ler (`QueryRowContext`, `NewRequestWithContext`, `ctx.Done()` üzerinde `select`) kullanın.

### Context iptalinden sonra yanıt yazma

Bir context iptal edildikten sonra `c.Writer`'a yazmaktan kaçının. Bağlantı zaten kapatılmış olabilir ve yazmalar sessizce başarısız olur veya panic verir. İşleyiciniz uzun süren iş yapıyorsa yazmadan önce `ctx.Err()` kontrol edin.

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

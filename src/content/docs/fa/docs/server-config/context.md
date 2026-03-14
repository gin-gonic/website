---
title: "Context و لغو"
sidebar:
  order: 11
---

هر handler در Gin یک `*gin.Context` دریافت می‌کند که `context.Context` استاندارد Go را همراه با توابع کمکی درخواست و پاسخ پوشش می‌دهد. درک نحوه استفاده صحیح از context زیربنایی برای ساخت برنامه‌های تولیدی که timeoutها، لغو و پاکسازی منابع را به درستی مدیریت می‌کنند ضروری است.

## دسترسی به context درخواست

`context.Context` استاندارد برای درخواست جاری از طریق `c.Request.Context()` در دسترس است. این contextی است که باید به هر فراخوانی downstream ارسال کنید -- پرس‌وجوهای پایگاه داده، درخواست‌های HTTP یا سایر عملیات I/O.

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

## timeout درخواست

می‌توانید با استفاده از یک میان‌افزار timeout به درخواست‌های منفرد اعمال کنید. وقتی timeout منقضی شود، context لغو می‌شود و هر فراخوانی downstream که لغو context را رعایت کند بلافاصله برمی‌گردد.

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

## ارسال context به پرس‌وجوهای پایگاه داده

درایورهای پایگاه داده در Go `context.Context` را به عنوان اولین آرگومان می‌پذیرند. همیشه context درخواست را ارسال کنید تا پرس‌وجوها در صورت قطع اتصال کلاینت یا timeout درخواست به طور خودکار لغو شوند.

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

## ارسال context به فراخوانی‌های HTTP خروجی

وقتی handler شما سرویس‌های خارجی را فراخوانی می‌کند، context درخواست را ارسال کنید تا فراخوانی‌های خروجی همراه با درخواست ورودی لغو شوند.

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

## مدیریت قطع اتصال کلاینت

وقتی کلاینت اتصال را می‌بندد (مثلاً به صفحه دیگری می‌رود یا درخواست را لغو می‌کند)، context درخواست لغو می‌شود. می‌توانید این را در handlerهای طولانی‌مدت تشخیص دهید تا کار را زودتر متوقف کرده و منابع را آزاد کنید.

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

## بهترین روش‌ها

- **همیشه context درخواست را منتشر کنید.** `c.Request.Context()` را به هر تابعی که `context.Context` می‌پذیرد ارسال کنید -- فراخوانی‌های پایگاه داده، کلاینت‌های HTTP، فراخوانی‌های gRPC و هر عملیات I/O. این تضمین می‌کند لغو و timeoutها در کل زنجیره فراخوانی منتشر شوند.

- **`*gin.Context` را در structها ذخیره نکنید یا آن را از مرزهای گوروتین عبور ندهید.** `gin.Context` به چرخه حیات درخواست/پاسخ HTTP وابسته است و برای استفاده همزمان ایمن نیست. در عوض، مقادیر مورد نیاز خود (context درخواست، پارامترها، هدرها) را قبل از ایجاد گوروتین‌ها استخراج کنید.

- **timeout را در سطح میان‌افزار تنظیم کنید.** یک میان‌افزار timeout یک مکان واحد برای اعمال مهلت‌ها در تمام مسیرها به شما می‌دهد، به جای تکرار منطق timeout در هر handler.

- **از `context.WithValue` با احتیاط استفاده کنید.** `c.Set()` و `c.Get()` را در handlerهای Gin ترجیح دهید. `context.WithValue` را برای مقادیری که باید از مرزهای پکیج از طریق رابط‌های کتابخانه استاندارد عبور کنند نگه دارید.

## مشکلات رایج

### استفاده از `gin.Context` در گوروتین‌ها

`gin.Context` برای عملکرد در درخواست‌ها بازاستفاده می‌شود. اگر نیاز دارید از یک گوروتین به آن دسترسی داشته باشید، **باید** `c.Copy()` را فراخوانی کنید تا یک کپی فقط خواندنی ایجاد کنید. استفاده از `gin.Context` اصلی در یک گوروتین منجر به شرایط رقابتی و رفتار غیرقابل پیش‌بینی می‌شود.

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

### نادیده گرفتن لغو context

اگر handler شما `ctx.Done()` را بررسی نکند، حتی پس از قطع اتصال کلاینت به اجرا ادامه خواهد داد و CPU و حافظه هدر می‌دهد. همیشه از APIهای آگاه از context (`QueryRowContext`، `NewRequestWithContext`، `select` روی `ctx.Done()`) استفاده کنید تا کار به محض لغو context متوقف شود.

### نوشتن پاسخ پس از لغو context

پس از لغو context، از نوشتن در `c.Writer` خودداری کنید. اتصال ممکن است قبلاً بسته شده باشد و نوشتن‌ها بی‌صدا شکست می‌خورند یا panic ایجاد می‌کنند. قبل از نوشتن، `ctx.Err()` را بررسی کنید اگر handler شما کار طولانی‌مدت انجام می‌دهد.

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

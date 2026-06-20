---
title: "السياق والإلغاء"
sidebar:
  order: 11
---

كل معالج في Gin يستقبل `*gin.Context`، الذي يلف `context.Context` القياسي في Go مع مساعدات الطلب والاستجابة. فهم كيفية استخدام السياق الأساسي بشكل صحيح أمر أساسي لبناء تطبيقات إنتاجية تتعامل مع المهل الزمنية والإلغاء وتنظيف الموارد بشكل صحيح.

## الوصول إلى سياق الطلب

`context.Context` القياسي للطلب الحالي متاح عبر `c.Request.Context()`. هذا هو السياق الذي يجب تمريره إلى أي استدعاء لاحق -- استعلامات قاعدة البيانات، طلبات HTTP، أو عمليات الإدخال/الإخراج الأخرى.

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

## مهل الطلبات الزمنية

يمكنك تطبيق مهلة زمنية على الطلبات الفردية باستخدام وسيط. عند انتهاء المهلة، يتم إلغاء السياق وأي استدعاء لاحق يحترم إلغاء السياق سيعود فوراً.

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

## تمرير السياق إلى استعلامات قاعدة البيانات

تقبل برامج تشغيل قواعد البيانات في Go `context.Context` كأول وسيطة. مرر دائماً سياق الطلب حتى يتم إلغاء الاستعلامات تلقائياً إذا قطع العميل الاتصال أو انتهت مهلة الطلب.

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

## تمرير السياق إلى طلبات HTTP الصادرة

عندما يستدعي معالجك خدمات خارجية، مرر سياق الطلب حتى يتم إلغاء الاستدعاءات الصادرة مع الطلب الوارد.

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

## التعامل مع قطع اتصال العميل

عندما يغلق العميل الاتصال (مثلاً ينتقل بعيداً أو يلغي طلباً)، يتم إلغاء سياق الطلب. يمكنك اكتشاف ذلك في المعالجات طويلة التشغيل لإيقاف العمل مبكراً وتحرير الموارد.

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

## أفضل الممارسات

- **انشر سياق الطلب دائماً.** مرر `c.Request.Context()` إلى كل دالة تقبل `context.Context` -- استدعاءات قاعدة البيانات، عملاء HTTP، استدعاءات gRPC، وأي عملية إدخال/إخراج. هذا يضمن انتشار الإلغاء والمهل الزمنية عبر سلسلة الاستدعاءات بالكامل.

- **لا تخزّن `*gin.Context` في هياكل أو تمررها عبر حدود goroutine.** `gin.Context` مرتبط بدورة حياة طلب/استجابة HTTP وليس آمناً للاستخدام المتزامن. بدلاً من ذلك، استخرج القيم التي تحتاجها (سياق الطلب، المعاملات، الترويسات) قبل إنشاء goroutines.

- **عيّن المهل الزمنية على مستوى الوسيط.** وسيط المهل الزمنية يمنحك مكاناً واحداً لفرض المواعيد النهائية عبر جميع المسارات، بدلاً من تكرار منطق المهلة في كل معالج.

- **استخدم `context.WithValue` باعتدال.** فضّل `c.Set()` و`c.Get()` داخل معالجات Gin. احتفظ بـ `context.WithValue` للقيم التي تحتاج عبور حدود الحزم عبر واجهات المكتبة القياسية.

## الأخطاء الشائعة

### استخدام `gin.Context` في goroutines

يُعاد استخدام `gin.Context` عبر الطلبات للأداء. إذا احتجت الوصول إليه من goroutine، **يجب** استدعاء `c.Copy()` لإنشاء نسخة للقراءة فقط. استخدام `gin.Context` الأصلي في goroutine يؤدي إلى سباقات بيانات وسلوك غير متوقع.

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

### تجاهل إلغاء السياق

إذا لم يتحقق معالجك من `ctx.Done()`، سيستمر في العمل حتى بعد قطع العميل للاتصال، مما يهدر وحدة المعالجة المركزية والذاكرة. استخدم دائماً واجهات برمجة مدركة للسياق (`QueryRowContext`، `NewRequestWithContext`، `select` على `ctx.Done()`) حتى يتوقف العمل بمجرد إلغاء السياق.

### الكتابة إلى الاستجابة بعد إلغاء السياق

بمجرد إلغاء السياق، تجنب الكتابة إلى `c.Writer`. قد يكون الاتصال مغلقاً بالفعل، وستفشل الكتابة بصمت أو تسبب حالة ذعر. تحقق من `ctx.Err()` قبل الكتابة إذا كان معالجك ينفذ عملاً طويل التشغيل.

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

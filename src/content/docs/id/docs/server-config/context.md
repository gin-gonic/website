---
title: "Context dan Pembatalan"
sidebar:
  order: 11
---

Setiap handler Gin menerima `*gin.Context`, yang membungkus `context.Context` standar Go beserta helper permintaan dan respons. Memahami cara menggunakan context yang mendasari dengan benar sangat penting untuk membangun aplikasi produksi yang menangani timeout, pembatalan, dan pembersihan sumber daya dengan tepat.

## Mengakses context permintaan

`context.Context` standar untuk permintaan saat ini tersedia melalui `c.Request.Context()`. Ini adalah context yang harus Anda teruskan ke pemanggilan downstream apa pun -- query database, permintaan HTTP, atau operasi I/O lainnya.

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

## Timeout permintaan

Anda dapat menerapkan timeout pada permintaan individual menggunakan middleware. Ketika timeout habis, context dibatalkan dan pemanggilan downstream apa pun yang menghormati pembatalan context akan segera kembali.

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

## Meneruskan context ke query database

Driver database di Go menerima `context.Context` sebagai argumen pertama. Selalu teruskan context permintaan agar query secara otomatis dibatalkan jika klien terputus atau permintaan timeout.

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

## Meneruskan context ke panggilan HTTP keluar

Ketika handler Anda memanggil layanan eksternal, teruskan context permintaan agar panggilan keluar dibatalkan bersama dengan permintaan masuk.

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

## Menangani pemutusan koneksi klien

Ketika klien menutup koneksi (mis., menavigasi pergi atau membatalkan permintaan), context permintaan dibatalkan. Anda dapat mendeteksi ini di handler yang berjalan lama untuk menghentikan pekerjaan lebih awal dan membebaskan sumber daya.

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

## Praktik terbaik

- **Selalu propagasi context permintaan.** Teruskan `c.Request.Context()` ke setiap fungsi yang menerima `context.Context` -- panggilan database, klien HTTP, panggilan gRPC, dan operasi I/O apa pun. Ini memastikan pembatalan dan timeout dipropagasi melalui seluruh rantai pemanggilan.

- **Jangan simpan `*gin.Context` dalam struct atau teruskan lintas batas goroutine.** `gin.Context` terikat pada siklus hidup permintaan/respons HTTP dan tidak aman untuk penggunaan bersamaan. Sebagai gantinya, ekstrak nilai yang Anda butuhkan (context permintaan, parameter, header) sebelum memulai goroutine.

- **Atur timeout di level middleware.** Middleware timeout memberi Anda satu tempat untuk menerapkan deadline di seluruh rute, alih-alih menduplikasi logika timeout di setiap handler.

- **Gunakan `context.WithValue` dengan hemat.** Utamakan `c.Set()` dan `c.Get()` dalam handler Gin. Cadangkan `context.WithValue` untuk nilai yang perlu melintas batas paket melalui antarmuka pustaka standar.

## Jebakan umum

### Menggunakan `gin.Context` dalam goroutine

`gin.Context` digunakan kembali antar permintaan untuk performa. Jika Anda perlu mengaksesnya dari goroutine, Anda **harus** memanggil `c.Copy()` untuk membuat salinan read-only. Menggunakan `gin.Context` asli dalam goroutine menyebabkan race data dan perilaku yang tidak dapat diprediksi.

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

### Mengabaikan pembatalan context

Jika handler Anda tidak memeriksa `ctx.Done()`, ia akan terus berjalan bahkan setelah klien terputus, membuang CPU dan memori. Selalu gunakan API yang sadar context (`QueryRowContext`, `NewRequestWithContext`, `select` pada `ctx.Done()`) agar pekerjaan berhenti segera setelah context dibatalkan.

### Menulis respons setelah pembatalan context

Setelah context dibatalkan, hindari menulis ke `c.Writer`. Koneksi mungkin sudah ditutup, dan penulisan akan gagal secara diam-diam atau panic. Periksa `ctx.Err()` sebelum menulis jika handler Anda melakukan pekerjaan yang berjalan lama.

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

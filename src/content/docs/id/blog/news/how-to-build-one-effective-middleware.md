---
title: "Cara Membangun Middleware yang Efektif"
linkTitle: "Cara Membangun Middleware yang Efektif"
lastUpdated: 2019-02-26
---

## Bagian-bagian penyusun

Middleware biasanya terdiri dari dua bagian:

- Bagian pertama dieksekusi sekali, saat Anda menginisialisasi middleware Anda. Di sinilah Anda menyiapkan objek global, logika konfigurasi, dll.—semua yang hanya perlu terjadi sekali selama masa hidup aplikasi.

- Bagian kedua dieksekusi pada setiap permintaan. Misalnya, dalam middleware database, Anda akan menyuntikkan objek database global ke dalam context permintaan. Setelah berada di dalam context, middleware lain dan fungsi handler Anda dapat mengambil dan menggunakannya.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // This is part one
  // --->
  // Example initialization: validate input params
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // This is part two
    // --->
    // Example execution per request: inject into context
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## Proses eksekusi

Mari kita lihat contoh kode berikut:

```go
func main() {
  router := gin.Default()

  router.Use(globalMiddleware())

  router.GET("/rest/n/api/*some", mid1(), mid2(), handler)

  router.Run()
}

func globalMiddleware() gin.HandlerFunc {
  fmt.Println("globalMiddleware...1")

  return func(c *gin.Context) {
    fmt.Println("globalMiddleware...2")
    c.Next()
    fmt.Println("globalMiddleware...3")
  }
}

func handler(c *gin.Context) {
  fmt.Println("exec handler.")
}

func mid1() gin.HandlerFunc {
  fmt.Println("mid1...1")

  return func(c *gin.Context) {

    fmt.Println("mid1...2")
    c.Next()
    fmt.Println("mid1...3")
  }
}

func mid2() gin.HandlerFunc {
  fmt.Println("mid2...1")

  return func(c *gin.Context) {
    fmt.Println("mid2...2")
    c.Next()
    fmt.Println("mid2...3")
  }
}
```

Sesuai dengan bagian [Bagian-bagian penyusun](#bagian-bagian-penyusun) di atas, ketika Anda menjalankan proses Gin, **bagian pertama** dari setiap middleware dieksekusi terlebih dahulu dan mencetak informasi berikut:

```go
globalMiddleware...1
mid1...1
mid2...1
```

Urutan inisialisasi adalah:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Ketika Anda membuat permintaan—misalnya, `curl -v localhost:8080/rest/n/api/some`—**bagian kedua** dari setiap middleware dieksekusi secara berurutan dan menghasilkan output berikut:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

Dengan kata lain, urutan eksekusi adalah:

```go
globalMiddleware...2
    |
    v
mid1...2
    |
    v
mid2...2
    |
    v
exec handler.
    |
    v
mid2...3
    |
    v
mid1...3
    |
    v
globalMiddleware...3
```

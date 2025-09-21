---
title: "Etkili Bir Middleware Nasıl Oluşturulur"
linkTitle: "Etkili Bir Middleware Nasıl Oluşturulur"
lastUpdated: 2019-02-26
---

## Bileşenler

Middleware tipik olarak iki bölümden oluşur:

- İlk bölüm, middleware'inizi başlattığınızda bir kez çalışır. Burada global nesneleri, yapılandırma mantığını vb. ayarlarsınız; uygulamanın yaşam döngüsünde yalnızca bir kez olması gereken her şey burada gerçekleşir.

- İkinci bölüm ise her istekte çalışır. Örneğin bir veritabanı middleware'inde, global veritabanı nesnenizi istek bağlamına enjekte edersiniz. Bağlamda olduğunda, diğer middleware'ler ve handler fonksiyonlarınız bunu alıp kullanabilir.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // Bu birinci bölüm
  // --->
  // Örnek başlatma: parametrelerin doğrulanması
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // Bu ikinci bölüm
    // --->
    // Her istek için örnek yürütme: bağlama enjekte et
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## Çalışma süreci

Şimdi aşağıdaki örnek koda bakalım:

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

[Yukarıdaki bileşenler](#bileşenler) bölümüne göre, Gin sürecini başlattığınızda her middleware'in **birinci bölümü** önce çalışır ve aşağıdaki bilgileri yazdırır:

```go
globalMiddleware...1
mid1...1
mid2...1
```

Başlatma sırası:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Bir istek gönderdiğinizde—ör: `curl -v localhost:8080/rest/n/api/some`—her middleware'in **ikinci bölümü** sırayla çalışır ve aşağıdaki çıktıyı verir:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

Yani, yürütme sırası şöyledir:

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

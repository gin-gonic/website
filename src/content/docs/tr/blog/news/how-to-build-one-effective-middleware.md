---
title: "Etkili Bir Ara Katman Nasıl Oluşturulur"
linkTitle: "Etkili Bir Ara Katman Nasıl Oluşturulur"
lastUpdated: 2019-02-26
---

## Yapısal Bileşenler

Ara katman genellikle iki bölümden oluşur:

- İlk bölüm, ara katmanınızı başlattığınızda bir kez çalışır. Burası genel nesneleri, yapılandırma mantığını vb. kurduğunuz yerdir -- uygulamanın ömrü boyunca yalnızca bir kez gerçekleşmesi gereken her şey.

- İkinci bölüm her istekte çalışır. Örneğin, bir veritabanı ara katmanında, genel veritabanı nesnenizi istek context'ine enjekte edersiniz. Context'e yerleştirildikten sonra, diğer ara katmanlar ve işleyici fonksiyonlarınız onu alıp kullanabilir.

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

## Yürütme Süreci

Aşağıdaki örnek koda bakalım:

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

Yukarıdaki [Yapısal Bileşenler](#yapısal-bileşenler) bölümüne göre, Gin sürecini çalıştırdığınızda her ara katmanın **birinci bölümü** önce çalışır ve aşağıdaki bilgileri yazdırır:

```go
globalMiddleware...1
mid1...1
mid2...1
```

Başlatma sırası şöyledir:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Bir istek yaptığınızda -- örneğin `curl -v localhost:8080/rest/n/api/some` -- her ara katmanın **ikinci bölümü** sırasıyla çalışır ve aşağıdaki çıktıyı üretir:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

Başka bir deyişle, yürütme sırası şöyledir:

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

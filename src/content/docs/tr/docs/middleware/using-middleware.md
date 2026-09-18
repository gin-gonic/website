---
title: "Ara katman kullanımı"
sidebar:
  order: 2
---

Gin'de ara katmanlar, rota işleyicinizden önce (ve isteğe bağlı olarak sonra) çalışan fonksiyonlardır. Loglama, kimlik doğrulama, hata kurtarma ve istek değiştirme gibi çapraz kesen konular için kullanılırlar.

Gin üç düzeyde ara katman eklemeyi destekler:

- **Global ara katman** -- Yönlendiricideki her rotaya uygulanır. `router.Use()` ile kaydedilir. Evrensel olarak uygulanan loglama ve panic kurtarma gibi konular için iyidir.
- **Grup ara katmanı** -- Bir rota grubundaki tüm rotalara uygulanır. `group.Use()` ile kaydedilir. Bir rota alt kümesine (ör. tüm `/admin/*` rotaları) kimlik doğrulama veya yetkilendirme uygulamak için faydalıdır.
- **Rota başına ara katman** -- Yalnızca tek bir rotaya uygulanır. `router.GET()`, `router.POST()` vb. fonksiyonlara ek argümanlar olarak geçirilir. Özel hız sınırlama veya girdi doğrulama gibi rotaya özgü mantık için faydalıdır.

**Yürütme sırası:** Ara katman fonksiyonları kaydedildikleri sırada yürütülür. `c.Next()` çağrısı kalan işleyicileri yürütür; çağrı döndükten sonra mevcut ara katmanın yürütülmesi devam eder. Böylece sonraki işleyicilerden önce ve sonra kod çalıştırabilirsiniz. Ara katmanlar sonraki işleyicileri bu şekilde sardığında, son işlemleri ters sırada (LIFO) yürütülür.

Bir ara katman `c.Next()` çağırmadan dönerse, bağlam sonlandırılmadığı sürece sonraki ara katmanlar ve işleyici yine yürütülür. Henüz yürütülmemiş işleyicileri atlamak için `c.Abort()` veya bir `AbortWithStatus*` metodu çağırın. Bağlamı sonlandırmak mevcut ara katman fonksiyonunu durdurmaz; bu fonksiyonun kalan kodunun yürütülmesini de durdurmak istiyorsanız `return` kullanın.

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // Creates a router without any middleware by default
  router := gin.New()

  // Global middleware
  // Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
  // By default gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery middleware recovers from any panics and writes a 500 if there was one.
  router.Use(gin.Recovery())

  // Per route middleware, you can add as many as you desire.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // Authorization group
  // authorized := router.Group("/", AuthRequired())
  // exactly the same as:
  authorized := router.Group("/")
  // per group middleware! in this case we use the custom created
  // AuthRequired() middleware just in the "authorized" group.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // nested group
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
`gin.Default()`, `Logger` ve `Recovery` ara katmanları zaten eklenmiş bir yönlendirici oluşturan kullanışlı bir fonksiyondur. Ara katmansız boş bir yönlendirici istiyorsanız, yukarıda gösterildiği gibi `gin.New()` kullanın ve yalnızca ihtiyacınız olan ara katmanları ekleyin.
:::

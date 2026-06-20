---
title: "Statik dosya sunma"
sidebar:
  order: 6
---

Gin, statik içerik sunmak için üç metod sağlar:

- **`router.Static(relativePath, root)`** -- Tüm bir dizini sunar. `relativePath` istekleri `root` altındaki dosyalara eşlenir. Örneğin, `router.Static("/assets", "./assets")` `./assets/style.css` dosyasını `/assets/style.css` adresinde sunar.
- **`router.StaticFS(relativePath, fs)`** -- `Static` gibidir, ancak bir `http.FileSystem` arayüzü kabul eder ve dosyaların nasıl çözüldüğü üzerinde daha fazla kontrol sağlar. Gömülü dosya sisteminden dosya sunmanız veya dizin listeleme davranışını özelleştirmeniz gerektiğinde kullanın.
- **`router.StaticFile(relativePath, filePath)`** -- Tek bir dosya sunar. `/favicon.ico` veya `/robots.txt` gibi uç noktalar için faydalıdır.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::caution[Güvenlik: yol geçişi]
`Static()` veya `http.Dir()` fonksiyonuna geçirdiğiniz dizin, herhangi bir istemci tarafından tam olarak erişilebilir olacaktır. Yapılandırma dosyaları, `.env` dosyaları, özel anahtarlar veya veritabanı dosyaları gibi hassas dosyalar içermediğinden emin olun.

En iyi uygulama olarak:

- Yalnızca herkese açık olarak sunmayı amaçladığınız dosyaları içeren özel bir dizin kullanın.
- Tüm projenizi veya dosya sisteminizi açığa çıkarabilecek `"."` veya `"/"` gibi yollar geçirmekten kaçının.
- Daha ayrıntılı kontrol gerekiyorsa (örneğin, dizin listelemeleri devre dışı bırakma), özel bir `http.FileSystem` uygulamasıyla `StaticFS` kullanın. Standart `http.Dir` varsayılan olarak dizin listelemeyi etkinleştirir.
:::

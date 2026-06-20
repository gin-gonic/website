---
title: "Log dosyası nasıl yazılır"
sidebar:
  order: 1
---

Logları bir dosyaya yazmak, hata ayıklama, denetim veya izleme için istek geçmişini saklamanız gereken üretim uygulamaları için önemlidir. Varsayılan olarak, Gin tüm log çıktısını `os.Stdout`'a yazar. Yönlendiriciyi oluşturmadan önce `gin.DefaultWriter`'ı ayarlayarak bunu yönlendirebilirsiniz.

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // Disable Console Color, you don't need console color when writing the logs to file.
    gin.DisableConsoleColor()

    // Logging to a file.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Use the following code if you need to write the logs to file and console at the same time.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### Hem dosyaya hem konsola yazma

Go'nun standart kütüphanesindeki `io.MultiWriter` fonksiyonu birden fazla `io.Writer` değeri kabul eder ve yazmaları hepsine çoğaltır. Bu, logları terminalde görürken aynı zamanda diske kaydetmek istediğiniz geliştirme sırasında faydalıdır:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

Bu kurulumla, her log girişi aynı anda hem `gin.log` dosyasına hem de konsola yazılır.

### Üretimde log döndürme

Yukarıdaki örnek, uygulama her başladığında log dosyasını kırpan `os.Create` kullanır. Üretimde genellikle mevcut loglara ekleme ve dosyaları boyut veya zamana göre döndürme istersiniz. [lumberjack](https://github.com/natefinch/lumberjack) gibi bir log döndürme kütüphanesi kullanmayı düşünün:

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // megabytes
        MaxBackups: 3,
        MaxAge:     28, // days
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### Ayrıca bakınız

- [Özel log formatı](../custom-log-format/) -- Kendi log satırı formatınızı tanımlama.
- [Log çıktısı renklendirmesini kontrol etme](../controlling-log-output-coloring/) -- Renkli çıktıyı devre dışı bırakma veya zorlama.
- [Loglamayı atlama](../skip-logging/) -- Belirli rotaları loglamadan hariç tutma.

---
title: "Запись логов в файл"
sidebar:
  order: 1
---

Запись логов в файл необходима для продакшн-приложений, где нужно сохранять историю запросов для отладки, аудита или мониторинга. По умолчанию Gin записывает весь вывод логов в `os.Stdout`. Вы можете перенаправить его, установив `gin.DefaultWriter` до создания маршрутизатора.

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

### Запись одновременно в файл и консоль

Функция `io.MultiWriter` из стандартной библиотеки Go принимает несколько значений `io.Writer` и дублирует записи во все из них. Это полезно при разработке, когда вы хотите видеть логи в терминале, одновременно сохраняя их на диск:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

При такой настройке каждая запись лога записывается одновременно в `gin.log` и в консоль.

### Ротация логов в продакшне

Пример выше использует `os.Create`, который обрезает файл логов при каждом запуске приложения. В продакшне обычно нужно дописывать в существующие логи и ротировать файлы по размеру или времени. Рассмотрите использование библиотеки ротации логов, такой как [lumberjack](https://github.com/natefinch/lumberjack):

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

### Смотрите также

- [Пользовательский формат логов](../custom-log-format/) -- Определение собственного формата строки лога.
- [Управление цветным выводом логов](../controlling-log-output-coloring/) -- Отключение или принудительное включение цветного вывода.
- [Пропуск логирования](../skip-logging/) -- Исключение определённых маршрутов из логирования.

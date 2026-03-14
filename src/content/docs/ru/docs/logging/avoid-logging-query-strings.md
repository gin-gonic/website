---
title: "Исключение строк запроса из логов"
sidebar:
  order: 5
---

Строки запроса часто содержат конфиденциальную информацию, такую как API-токены, пароли, идентификаторы сессий или персональные данные (PII). Логирование этих значений может создавать риски безопасности и нарушать нормативные требования, такие как GDPR или HIPAA. Удаляя строки запроса из логов, вы снижаете риск утечки конфиденциальных данных через файлы логов, системы мониторинга или инструменты отчётов об ошибках.

Используйте опцию `SkipQueryString` в `LoggerConfig`, чтобы предотвратить появление строк запроса в логах. При включении запрос к `/path?token=secret&user=alice` будет залогирован просто как `/path`.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

Вы можете проверить разницу с помощью `curl`:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

Без `SkipQueryString` запись лога включает полную строку запроса:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

С `SkipQueryString: true` строка запроса удаляется:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

Это особенно полезно в средах, чувствительных к нормативным требованиям, где вывод логов пересылается в сторонние сервисы или хранится длительное время. Ваше приложение по-прежнему имеет полный доступ к параметрам запроса через `c.Query()` — затрагивается только вывод логов.

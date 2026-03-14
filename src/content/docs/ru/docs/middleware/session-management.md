---
title: "Управление сессиями"
sidebar:
  order: 9
---

Сессии позволяют хранить данные, специфичные для пользователя, между несколькими HTTP-запросами. Поскольку HTTP является протоколом без сохранения состояния, сессии используют cookies или другие механизмы для идентификации возвращающихся пользователей и получения их сохранённых данных.

## Использование gin-contrib/sessions

Middleware [gin-contrib/sessions](https://github.com/gin-contrib/sessions) предоставляет управление сессиями с несколькими хранилищами:

```sh
go get github.com/gin-contrib/sessions
```

### Сессии на основе cookies

Простейший подход — хранение данных сессии в зашифрованных cookies:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Create cookie-based session store with a secret key
  store := cookie.NewStore([]byte("your-secret-key"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/login", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("user", "john")
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged in"})
  })

  r.GET("/profile", func(c *gin.Context) {
    session := sessions.Default(c)
    user := session.Get("user")
    if user == nil {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"user": user})
  })

  r.GET("/logout", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Clear()
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
  })

  r.Run(":8080")
}
```

### Сессии на основе Redis

Для продакшн-приложений храните сессии в Redis для масштабирования между несколькими экземплярами:

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // Connect to Redis for session storage
  store, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  if err != nil {
    panic(err)
  }
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/set", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("count", 1)
    session.Save()
    c.JSON(http.StatusOK, gin.H{"count": 1})
  })

  r.GET("/get", func(c *gin.Context) {
    session := sessions.Default(c)
    count := session.Get("count")
    c.JSON(http.StatusOK, gin.H{"count": count})
  })

  r.Run(":8080")
}
```

## Параметры сессии

Настройте поведение сессии с помощью `sessions.Options`:

```go
session := sessions.Default(c)
session.Options(sessions.Options{
  Path:     "/",
  MaxAge:   3600,        // Session expires in 1 hour (seconds)
  HttpOnly: true,        // Prevent JavaScript access
  Secure:   true,        // Only send over HTTPS
  SameSite: http.SameSiteLaxMode,
})
```

| Параметр | Описание |
|--------|-------------|
| `Path` | Область действия пути cookie (по умолчанию: `/`) |
| `MaxAge` | Время жизни в секундах. `-1` для удаления, `0` для сессии браузера |
| `HttpOnly` | Предотвращает доступ JavaScript к cookie |
| `Secure` | Отправлять cookie только через HTTPS |
| `SameSite` | Контролирует поведение кросс-сайтовых cookies (`Lax`, `Strict`, `None`) |

:::note
Всегда устанавливайте `HttpOnly: true` и `Secure: true` в продакшне для защиты cookies сессий от XSS-атак и атак «человек посередине».
:::

## Доступные хранилища

| Хранилище | Пакет | Сценарий использования |
|---------|---------|----------|
| Cookie | `sessions/cookie` | Простые приложения, малый объём данных сессии |
| Redis | `sessions/redis` | Продакшн, многоэкземплярные развёртывания |
| Memcached | `sessions/memcached` | Высокопроизводительный слой кеширования |
| MongoDB | `sessions/mongo` | Когда MongoDB — ваше основное хранилище |
| PostgreSQL | `sessions/postgres` | Когда PostgreSQL — ваше основное хранилище |

## Сессии vs JWT

| Аспект | Сессии | JWT |
|--------|----------|-----|
| Хранение | На стороне сервера (Redis, БД) | На стороне клиента (токен) |
| Отзыв | Просто (удалить из хранилища) | Сложно (требует блокировочного списка) |
| Масштабируемость | Нужно общее хранилище | Без состояния |
| Размер данных | Неограничен на сервере | Ограничен размером токена |

Используйте сессии, когда нужен простой отзыв (например, выход, блокировка пользователя). Используйте JWT, когда нужна аутентификация без состояния между микросервисами.

## Смотрите также

- [Работа с cookies](/ru/docs/server-config/cookie/)
- [Лучшие практики безопасности](/ru/docs/middleware/security-guide/)
- [Использование middleware](/ru/docs/middleware/using-middleware/)

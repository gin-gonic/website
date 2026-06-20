---
title: "Маршрутизация"
sidebar:
  order: 3
---

Gin предоставляет мощную систему маршрутизации, построенную на [httprouter](https://github.com/julienschmidt/httprouter) для высокопроизводительного сопоставления URL. Под капотом httprouter использует [radix-дерево](https://en.wikipedia.org/wiki/Radix_tree) (также называемое сжатым префиксным деревом) для хранения и поиска маршрутов, что означает, что сопоставление маршрутов выполняется чрезвычайно быстро и не требует выделения памяти при каждом поиске. Это делает Gin одним из самых быстрых веб-фреймворков для Go.

Маршруты регистрируются путём вызова HTTP-метода на движке (или группе маршрутов) с указанием шаблона URL и одной или нескольких функций-обработчиков:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## В этом разделе

Страницы ниже подробно описывают каждую тему маршрутизации:

- [**Использование HTTP-методов**](./http-method/) -- Регистрация маршрутов для GET, POST, PUT, DELETE, PATCH, HEAD и OPTIONS.
- [**Параметры в пути**](./param-in-path/) -- Захват динамических сегментов из URL-путей (например, `/user/:name`).
- [**Параметры строки запроса**](./querystring-param/) -- Чтение значений строки запроса из URL запроса.
- [**Запрос и POST-форма**](./query-and-post-form/) -- Доступ к данным строки запроса и POST-формы в одном обработчике.
- [**Map как параметры строки запроса или POST-формы**](./map-as-querystring-or-postform/) -- Привязка параметров map из строк запроса или POST-форм.
- [**Multipart/urlencoded форма**](./multipart-urlencoded-form/) -- Разбор тел `multipart/form-data` и `application/x-www-form-urlencoded`.
- [**Загрузка файлов**](./upload-file/) -- Обработка загрузки одного и нескольких файлов.
- [**Группировка маршрутов**](./grouping-routes/) -- Организация маршрутов под общими префиксами с общим middleware.
- [**Перенаправления**](./redirects/) -- Выполнение HTTP-перенаправлений и перенаправлений на уровне маршрутизатора.

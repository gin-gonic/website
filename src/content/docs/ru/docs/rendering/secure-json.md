---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON` защищает от класса уязвимостей, известного как **перехват JSON (JSON hijacking)**. В старых браузерах (прежде всего Internet Explorer 9 и более ранних) вредоносная страница могла включить тег `<script>`, указывающий на JSON API-эндпоинт жертвы. Если этот эндпоинт возвращал JSON-массив верхнего уровня (например, `["secret","data"]`), браузер выполнял его как JavaScript. Переопределив конструктор `Array`, злоумышленник мог перехватить разобранные значения и передать конфиденциальные данные на сторонний сервер.

**Как SecureJSON предотвращает это:**

Когда данные ответа представляют собой JSON-массив, `SecureJSON` добавляет непарсируемый префикс — по умолчанию `while(1);` — к телу ответа. Это заставляет JavaScript-движок браузера войти в бесконечный цикл, если ответ загружается через тег `<script>`, предотвращая доступ к данным. Легитимные потребители API (использующие `fetch`, `XMLHttpRequest` или любой HTTP-клиент) читают сырое тело ответа и могут просто удалить префикс перед парсингом.

API Google используют похожую технику с `)]}'\n`, а Facebook использует `for(;;);`. Вы можете настроить префикс с помощью `router.SecureJsonPrefix()`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // You can also use your own secure json prefix
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // Will output  :   while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::note
Современные браузеры исправили эту уязвимость, поэтому `SecureJSON` актуален прежде всего при необходимости поддержки устаревших браузеров или если ваша политика безопасности требует глубокой защиты. Для большинства новых API достаточно стандартного `c.JSON()`.
:::

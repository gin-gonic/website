---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON with Padding) — это техника для выполнения кросс-доменных запросов из браузеров, которые не поддерживают CORS. Она работает путём оборачивания JSON-ответа в вызов JavaScript-функции. Браузер загружает ответ через тег `<script>`, который не подчиняется политике одного источника, и оборачивающая функция выполняется с данными в качестве аргумента.

Когда вы вызываете `c.JSONP()`, Gin проверяет наличие параметра запроса `callback`. Если он присутствует, тело ответа оборачивается как `callbackName({"foo":"bar"})` с `Content-Type` равным `application/javascript`. Если callback не указан, ответ ведёт себя как стандартный вызов `c.JSON()`.

:::note
JSONP — это устаревшая техника. Для современных приложений используйте [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). CORS более безопасен, поддерживает все HTTP-методы (не только GET) и не требует оборачивания ответов в callback-функции. Используйте JSONP только когда нужна поддержка очень старых браузеров или интеграция со сторонними системами, которые это требуют.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // The callback name is read from the query string, e.g.:
    // GET /JSONP?callback=x
    // Will output  :   x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

Проверьте с помощью curl, чтобы увидеть разницу между ответами JSONP и обычным JSON:

```sh
# With callback -- returns JavaScript
curl "http://localhost:8080/JSONP?callback=handleData"
# Output: handleData({"foo":"bar"});

# Without callback -- returns plain JSON
curl "http://localhost:8080/JSONP"
# Output: {"foo":"bar"}
```

:::caution[Соображения безопасности]
Эндпоинты JSONP могут быть уязвимы для XSS-атак, если параметр callback не очищен должным образом. Вредоносное значение callback, такое как `alert(document.cookie)//`, может внедрить произвольный JavaScript. Gin смягчает это, очищая имя callback и удаляя символы, которые могут быть использованы для инъекции. Тем не менее, вы должны ограничивать JSONP-эндпоинты некритичными данными только для чтения, поскольку любая страница в вебе может загрузить ваш JSONP-эндпоинт через тег `<script>`.
:::

## Смотрите также

- [Рендеринг XML/JSON/YAML/ProtoBuf](/ru/docs/rendering/rendering/)
- [SecureJSON](/ru/docs/rendering/secure-json/)
- [AsciiJSON](/ru/docs/rendering/ascii-json/)
- [PureJSON](/ru/docs/rendering/pure-json/)

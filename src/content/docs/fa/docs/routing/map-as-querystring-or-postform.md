---
title: "Map به عنوان پارامترهای رشته پرس‌وجو یا فرم ارسال"
sidebar:
  order: 6
---

گاهی نیاز دارید مجموعه‌ای از جفت‌های کلید-مقدار دریافت کنید که کلیدها از قبل مشخص نیستند -- مثلاً فیلترهای پویا یا فراداده تعریف‌شده توسط کاربر. Gin متدهای `c.QueryMap` و `c.PostFormMap` را برای تجزیه پارامترهای با نماد براکت (مانند `ids[a]=1234`) به یک `map[string]string` ارائه می‌دهد.

- `c.QueryMap("key")` -- جفت‌های `key[subkey]=value` را از رشته پرس‌وجوی URL تجزیه می‌کند.
- `c.PostFormMap("key")` -- جفت‌های `key[subkey]=value` را از بدنه درخواست تجزیه می‌کند.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    ids := c.QueryMap("ids")
    names := c.PostFormMap("names")

    fmt.Printf("ids: %v; names: %v\n", ids, names)
    c.JSON(http.StatusOK, gin.H{
      "ids":   ids,
      "names": names,
    })
  })

  router.Run(":8080")
}
```

## تست

```sh
curl -X POST "http://localhost:8080/post?ids[a]=1234&ids[b]=hello" \
  -d "names[first]=thinkerou&names[second]=tianou"
# Output: {"ids":{"a":"1234","b":"hello"},"names":{"first":"thinkerou","second":"tianou"}}
```

:::note
نماد براکت `ids[a]=1234` یک قرارداد رایج است. Gin بخش داخل براکت‌ها را به‌عنوان کلید map تجزیه می‌کند. فقط براکت‌های تک‌سطحی پشتیبانی می‌شوند -- براکت‌های تودرتو مانند `ids[a][b]=value` به‌عنوان mapهای تودرتو تجزیه نمی‌شوند.
:::

## همچنین ببینید

- [پارامترهای رشته پرس‌وجو](/fa/docs/routing/querystring-param/)
- [فرم پرس‌وجو و ارسال](/fa/docs/routing/query-and-post-form/)

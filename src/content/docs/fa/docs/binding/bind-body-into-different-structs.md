---
title: "تلاش برای اتصال بدنه به structهای مختلف"
sidebar:
  order: 13
---

متدهای استاندارد اتصال مانند `c.ShouldBind` از `c.Request.Body` استفاده می‌کنند که یک `io.ReadCloser` است -- پس از خواندن، دیگر نمی‌توان آن را دوباره خواند. این به این معنی است که نمی‌توانید `c.ShouldBind` را چندین بار روی همان درخواست فراخوانی کنید تا اشکال مختلف struct را امتحان کنید.

برای حل این مشکل، از `c.ShouldBindBodyWith` استفاده کنید. این متد بدنه را یک بار می‌خواند و در context ذخیره می‌کند و به اتصال‌های بعدی اجازه می‌دهد از بدنه ذخیره‌شده مجدداً استفاده کنند.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

type formA struct {
  Foo string `json:"foo" xml:"foo" binding:"required"`
}

type formB struct {
  Bar string `json:"bar" xml:"bar" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/bind", func(c *gin.Context) {
    objA := formA{}
    objB := formB{}
    // This reads c.Request.Body and stores the result into the context.
    if errA := c.ShouldBindBodyWith(&objA, binding.JSON); errA == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formA", "foo": objA.Foo})
      return
    }
    // At this time, it reuses body stored in the context.
    if errB := c.ShouldBindBodyWith(&objB, binding.JSON); errB == nil {
      c.JSON(http.StatusOK, gin.H{"message": "matched formB", "bar": objB.Bar})
      return
    }

    c.JSON(http.StatusBadRequest, gin.H{"error": "request body did not match any known format"})
  })

  router.Run(":8080")
}
```

## تست

```sh
# Body matches formA
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"foo":"hello"}'
# Output: {"foo":"hello","message":"matched formA"}

# Body matches formB
curl -X POST http://localhost:8080/bind \
  -H "Content-Type: application/json" \
  -d '{"bar":"world"}'
# Output: {"bar":"world","message":"matched formB"}
```

:::note
`c.ShouldBindBodyWith` قبل از اتصال، بدنه را در context ذخیره می‌کند. این تأثیر جزئی بر عملکرد دارد، بنابراین فقط زمانی از آن استفاده کنید که نیاز به اتصال بدنه بیش از یک بار دارید. برای فرمت‌هایی که بدنه را نمی‌خوانند -- مانند `Query`، `Form`، `FormPost`، `FormMultipart` -- می‌توانید `c.ShouldBind()` را چندین بار بدون مشکل فراخوانی کنید.
:::

## همچنین ببینید

- [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/)
- [اتصال رشته پرس‌وجو یا داده ارسالی](/fa/docs/binding/bind-query-or-post/)

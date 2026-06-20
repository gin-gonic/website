---
title: "رندرینگ XML/JSON/YAML/ProtoBuf"
sidebar:
  order: 1
---

Gin پشتیبانی داخلی از رندرینگ پاسخ‌ها در فرمت‌های مختلف از جمله JSON، XML، YAML و Protocol Buffers ارائه می‌دهد. این کار ساخت APIهایی که از مذاکره محتوا پشتیبانی می‌کنند -- یعنی ارائه داده‌ها در هر فرمتی که کلاینت درخواست می‌کند -- را ساده می‌سازد.

**زمان استفاده از هر فرمت:**

- **JSON** -- رایج‌ترین انتخاب برای API‌های REST و کلاینت‌های مبتنی بر مرورگر. از `c.JSON()` برای خروجی استاندارد یا `c.IndentedJSON()` برای قالب‌بندی خوانا در هنگام توسعه استفاده کنید.
- **XML** -- مفید برای یکپارچه‌سازی با سیستم‌های قدیمی، سرویس‌های SOAP یا کلاینت‌هایی که XML را انتظار دارند (مانند برخی برنامه‌های سازمانی).
- **YAML** -- مناسب برای نقاط پایانی مبتنی بر پیکربندی یا ابزارهایی که به طور بومی YAML مصرف می‌کنند (مانند Kubernetes یا خطوط لوله CI/CD).
- **ProtoBuf** -- ایده‌آل برای ارتباط با عملکرد بالا و تأخیر کم بین سرویس‌ها. Protocol Buffers بارهای کوچک‌تر و سریال‌سازی سریع‌تری نسبت به فرمت‌های متنی تولید می‌کنند، اما نیاز به تعریف schema مشترک (فایل `.proto`) دارند.

تمام متدهای رندرینگ یک کد وضعیت HTTP و یک مقدار داده می‌پذیرند. Gin داده‌ها را سریال‌سازی کرده و هدر `Content-Type` مناسب را به طور خودکار تنظیم می‌کند.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.H is a shortcut for map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // You also can use a struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Note that msg.Name becomes "user" in the JSON
    // Will output  :   {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // The specific definition of protobuf is written in the testdata/protoexample file.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Note that data becomes binary data in the response
    // Will output protoexample.Test protobuf serialized data
    c.ProtoBuf(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

## همچنین ببینید

- [PureJSON](/en/docs/rendering/pure-json/)
- [SecureJSON](/en/docs/rendering/secure-json/)
- [AsciiJSON](/en/docs/rendering/ascii-json/)
- [JSONP](/en/docs/rendering/jsonp/)

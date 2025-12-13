---
title: "فرمت مجموعه برای آرایه‌ها"
---

شما می‌توانید نحوه تقسیم مقادیر لیست برای فیلدهای slice/array را با استفاده از تگ ساختار `collection_format` در اتصال فرم کنترل کنید.

فرمت‌های پشتیبانی شده (v1.11+):

- multi (پیش‌فرض): کلیدهای تکراری یا مقادیر جدا شده با کاما
- csv: مقادیر جدا شده با کاما
- ssv: مقادیر جدا شده با فاصله
- tsv: مقادیر جدا شده با تب
- pipes: مقادیر جدا شده با پایپ

مثال:

```go
package main

import (
  "net/http"
  "github.com/gin-gonic/gin"
)

type Filters struct {
  Tags      []string `form:"tags" collection_format:"csv"`     // /search?tags=go,web,api
  Labels    []string `form:"labels" collection_format:"multi"` // /search?labels=bug&labels=helpwanted
  IdsSSV    []int    `form:"ids_ssv" collection_format:"ssv"`  // /search?ids_ssv=1 2 3
  IdsTSV    []int    `form:"ids_tsv" collection_format:"tsv"`  // /search?ids_tsv=1\t2\t3
  Levels    []int    `form:"levels" collection_format:"pipes"` // /search?levels=1|2|3
}

func main() {
  r := gin.Default()
  r.GET("/search", func(c *gin.Context) {
    var f Filters
    if err := c.ShouldBind(&f); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, f)
  })
  r.Run(":8080")
}
```

مقادیر پیش‌فرض برای مجموعه‌ها (v1.11+):

- از `default` در تگ `form` برای تنظیم مقادیر پیش‌فرض استفاده کنید.
- برای `multi` و `csv`، مقادیر پیش‌فرض را با نقطه‌ویرگول جدا کنید: `default=1;2;3`.
- برای `ssv`، `tsv` و `pipes`، از جداکننده طبیعی در مقدار پیش‌فرض استفاده کنید.

همچنین ببینید: مثال "اتصال مقادیر پیش‌فرض برای فیلدهای فرم".

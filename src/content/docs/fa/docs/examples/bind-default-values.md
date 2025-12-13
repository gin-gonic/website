---
title: "اتصال مقادیر پیش‌فرض برای فیلدهای فرم"
---

گاهی اوقات می‌خواهید یک فیلد در صورت عدم ارسال مقدار توسط کلاینت، به یک مقدار پیش‌فرض برگردد. اتصال فرم در Gin از مقادیر پیش‌فرض از طریق گزینه `default` در تگ ساختار `form` پشتیبانی می‌کند. این برای مقادیر اسکالر و از نسخه Gin v1.11 به بعد، برای مجموعه‌ها (slice/array) با فرمت‌های مجموعه صریح کار می‌کند.

نکات کلیدی:

- مقدار پیش‌فرض را درست بعد از کلید فرم قرار دهید: `form:"name,default=William"`.
- برای مجموعه‌ها، نحوه تقسیم مقادیر را با `collection_format:"multi|csv|ssv|tsv|pipes"` مشخص کنید.
- برای `multi` و `csv`، از نقطه ویرگول در مقدار پیش‌فرض برای جدا کردن مقادیر استفاده کنید (مثلاً `default=1;2;3`). Gin این‌ها را به صورت داخلی به کاما تبدیل می‌کند تا پارسر تگ مبهم نباشد.
- برای `ssv` (فاصله)، `tsv` (تب) و `pipes` (|)، از جداکننده طبیعی در مقدار پیش‌فرض استفاده کنید.

مثال:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: در مقادیر پیش‌فرض از ; استفاده کنید
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // binder را از Content-Type استنتاج می‌کند
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

اگر بدون بدنه POST کنید، Gin با مقادیر پیش‌فرض پاسخ می‌دهد:

```sh
curl -X POST http://localhost:8080/person
```

پاسخ (مثال):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

نکات و هشدارها:

- کاماها در سینتکس تگ ساختار Go برای جدا کردن گزینه‌ها استفاده می‌شوند؛ از کاما در داخل مقادیر پیش‌فرض اجتناب کنید.
- برای `multi` و `csv`، نقطه ویرگول مقادیر پیش‌فرض را جدا می‌کند؛ برای این فرمت‌ها، نقطه ویرگول را در داخل مقادیر پیش‌فرض جداگانه قرار ندهید.
- مقادیر نامعتبر `collection_format` منجر به خطای اتصال می‌شود.

تغییرات مرتبط:

- فرمت‌های مجموعه برای اتصال فرم (`multi`، `csv`، `ssv`، `tsv`، `pipes`) در حدود نسخه v1.11 بهبود یافتند.
- مقادیر پیش‌فرض برای مجموعه‌ها در نسخه v1.11 اضافه شدند (PR #4048).

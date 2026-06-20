---
title: "مقادیر پیش‌فرض برای فیلدهای فرم"
sidebar:
  order: 5
---

گاهی می‌خواهید یک فیلد در صورتی که کلاینت مقداری ارسال نکرده به مقدار پیش‌فرض بازگردد. اتصال فرم Gin از مقادیر پیش‌فرض از طریق گزینه `default` در تگ struct `form` پشتیبانی می‌کند. این برای مقادیر اسکالر و، از نسخه Gin v1.11، برای مجموعه‌ها (sliceها/آرایه‌ها) با فرمت‌های مجموعه صریح کار می‌کند.

نکات کلیدی:

- مقدار پیش‌فرض را درست بعد از کلید فرم قرار دهید: `form:"name,default=William"`.
- برای مجموعه‌ها، نحوه تقسیم مقادیر را با `collection_format:"multi|csv|ssv|tsv|pipes"` مشخص کنید.
- برای `multi` و `csv`، از نقطه‌ویرگول در مقدار پیش‌فرض برای جداسازی مقادیر استفاده کنید (مثلاً `default=1;2;3`). Gin این‌ها را به صورت داخلی به کاما تبدیل می‌کند تا تجزیه‌کننده تگ بدون ابهام باقی بماند.
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
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: use ; in defaults
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // infers binder by Content-Type
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

پاسخ (نمونه):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

نکات و محدودیت‌ها:

- کاماها توسط سینتکس تگ struct Go برای جدا کردن گزینه‌ها استفاده می‌شوند؛ از کاما در داخل مقادیر پیش‌فرض خودداری کنید.
- برای `multi` و `csv`، نقطه‌ویرگول‌ها مقادیر پیش‌فرض را جدا می‌کنند؛ نقطه‌ویرگول را در داخل مقادیر پیش‌فرض فردی برای این فرمت‌ها قرار ندهید.
- مقادیر نامعتبر `collection_format` منجر به خطای اتصال خواهند شد.

تغییرات مرتبط:

- فرمت‌های مجموعه برای اتصال فرم (`multi`، `csv`، `ssv`، `tsv`، `pipes`) حدود نسخه v1.11 بهبود یافتند.
- مقادیر پیش‌فرض برای مجموعه‌ها در نسخه v1.11 اضافه شدند (PR #4048).

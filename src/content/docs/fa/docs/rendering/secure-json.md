---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON` از دسته‌ای از آسیب‌پذیری‌ها به نام **ربودن JSON** محافظت می‌کند. در مرورگرهای قدیمی‌تر (عمدتاً Internet Explorer 9 و قبل‌تر)، یک صفحه مخرب می‌تواند تگ `<script>` را به نقطه پایانی API JSON قربانی اشاره دهد. اگر آن نقطه پایانی یک آرایه JSON سطح بالا برگرداند (مثلاً `["secret","data"]`)، مرورگر آن را به عنوان JavaScript اجرا می‌کند. با بازنویسی سازنده `Array`، مهاجم می‌تواند مقادیر تجزیه شده را رهگیری کند و داده‌های حساس را به سرور شخص ثالث نشت دهد.

**نحوه جلوگیری SecureJSON:**

وقتی داده پاسخ یک آرایه JSON است، `SecureJSON` یک پیشوند غیرقابل تجزیه -- به طور پیش‌فرض `while(1);` -- را به بدنه پاسخ اضافه می‌کند. این باعث می‌شود موتور JavaScript مرورگر در صورت بارگذاری پاسخ از طریق تگ `<script>` وارد حلقه بی‌نهایت شود و از دسترسی به داده‌ها جلوگیری کند. مصرف‌کنندگان قانونی API (با استفاده از `fetch`، `XMLHttpRequest` یا هر کلاینت HTTP) بدنه پاسخ خام را می‌خوانند و می‌توانند به سادگی پیشوند را قبل از تجزیه حذف کنند.

APIهای Google از تکنیک مشابهی با `)]}'\n` استفاده می‌کنند و Facebook از `for(;;);` استفاده می‌کند. می‌توانید پیشوند را با `router.SecureJsonPrefix()` سفارشی کنید.

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
مرورگرهای مدرن این آسیب‌پذیری را رفع کرده‌اند، بنابراین `SecureJSON` عمدتاً در صورت نیاز به پشتیبانی از مرورگرهای قدیمی یا اگر سیاست امنیتی شما نیاز به دفاع چندلایه دارد مرتبط است. برای اکثر APIهای جدید، `c.JSON()` استاندارد کافی است.
:::

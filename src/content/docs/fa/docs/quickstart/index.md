---
title: "شروع سریع"
sidebar:
  order: 2
---

به راهنمای شروع سریع Gin خوش آمدید! این راهنما شما را قدم‌به‌قدم از نصب Gin، راه‌اندازی پروژه، تا اجرای اولین API همراهی می‌کند تا بتوانید با اعتماد به نفس سرویس‌های وب بسازید.

## پیش‌نیازها

- **نسخه Go**: Gin نیاز به [Go](https://go.dev/) نسخه [1.24](https://go.dev/doc/devel/release#go1.24) یا بالاتر دارد
- اطمینان حاصل کنید Go در `PATH` شما قرار دارد و از طریق ترمینال قابل اجراست. برای راهنمای نصب [مستندات رسمی Go را ببینید](https://golang.org/doc/install).

---

## گام 1: نصب Gin و راه‌اندازی پروژه

ابتدا یک پوشه جدید برای پروژه بسازید و یک ماژول Go راه‌اندازی کنید:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

اضافه کردن Gin به وابستگی‌ها:

```sh
go get -u github.com/gin-gonic/gin
```

---

## گام 2: ایجاد اولین برنامه Gin

یک فایل با نام `main.go` بسازید:

```sh
touch main.go
```

فایل `main.go` را باز کنید و کد زیر را وارد نمایید:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  router.Run() // به طور پیش‌فرض روی 0.0.0.0:8080 گوش می‌دهد
}
```

---

## گام 3: اجرای سرور API

سرور را با دستور زیر اجرا کنید:

```sh
go run main.go
```

سپس در مرورگر به آدرس [http://localhost:8080/ping](http://localhost:8080/ping) مراجعه کنید و باید خروجی زیر را ببینید:

```json
{"message":"pong"}
```

---

## مثال اضافی: استفاده از net/http همراه با Gin

اگر می‌خواهید از ثابت‌های `net/http` برای کدهای پاسخ استفاده کنید، آن را نیز import کنید:

```go
package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  router.Run()
}
```

---

## نکات و منابع

- تازه‌وارد به Go هستید؟ آموزش نوشتن و اجرای کد Go را [اینجا ببینید](https://golang.org/doc/code.html).
- آماده تمرین مفاهیم Gin به صورت عملی هستید؟ [منابع یادگیری](../learning-resources) ما را برای چالش‌های تعاملی و آموزش‌ها بررسی کنید.
- برای مثال کامل‌تر می‌توانید از دستور زیر استفاده کنید:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- برای مستندات کامل‌تر، به [مستندات کد منبع Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md) مراجعه کنید.

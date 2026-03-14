---
title: "شروع سریع"
sidebar:
  order: 2
---

به شروع سریع Gin خوش آمدید! این راهنما شما را در نصب Gin، راه‌اندازی پروژه و اجرای اولین API راهنمایی می‌کند — تا بتوانید با اطمینان شروع به ساخت سرویس‌های وب کنید.

## پیش‌نیازها

- **نسخه Go**: Gin به [Go](https://go.dev/) نسخه [1.25](https://go.dev/doc/devel/release#go1.25) یا بالاتر نیاز دارد
- مطمئن شوید Go در `PATH` شما قرار دارد و از ترمینال قابل استفاده است. برای کمک در نصب Go، [مستندات رسمی را ببینید](https://go.dev/doc/install).

---

## گام ۱: نصب Gin و راه‌اندازی پروژه

با ایجاد یک پوشه پروژه جدید و مقداردهی اولیه ماژول Go شروع کنید:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Gin را به عنوان وابستگی اضافه کنید:

```sh
go get -u github.com/gin-gonic/gin
```

---

## گام ۲: ایجاد اولین برنامه Gin

یک فایل به نام `main.go` ایجاد کنید:

```sh
touch main.go
```

فایل `main.go` را باز کنید و کد زیر را اضافه کنید:

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
  router.Run() // listens on 0.0.0.0:8080 by default
}
```

---

## گام ۳: اجرای سرور API

سرور خود را با دستور زیر راه‌اندازی کنید:

```sh
go run main.go
```

در مرورگر خود به [http://localhost:8080/ping](http://localhost:8080/ping) بروید و باید ببینید:

```json
{"message":"pong"}
```

---

## مثال اضافی: استفاده از net/http با Gin

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

- تازه‌کار Go هستید؟ نحوه نوشتن و اجرای کد Go را در [مستندات رسمی Go](https://go.dev/doc/code) یاد بگیرید.
- می‌خواهید مفاهیم Gin را عملی تمرین کنید؟ [منابع آموزشی](../learning-resources) ما را برای چالش‌ها و آموزش‌های تعاملی بررسی کنید.
- به یک مثال کامل نیاز دارید؟ با دستور زیر شروع کنید:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- برای مستندات دقیق‌تر، از [مستندات کد منبع Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md) بازدید کنید.

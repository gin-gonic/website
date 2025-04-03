---
title: "شروع سریع"
weight: 2
---

در اینجا ما اطلاعاتی را در کدها دریافت میکنیم و همچنین یاد میگیریم که :

## الزامات

- Go 1.16 یا بالا تر

## نصب و راه اندازی

برای نصب پکیج Gin ابتدا باید گو را نصب کنید و محیط خودتون رو تنظیم کنید.

1. دانلود و نصب:

```sh
$ go get -u github.com/gin-gonic/gin
```

2. جین را به پروژتون اضافه کنید

```go
import "github.com/gin-gonic/gin"
```

3. وارد کنید "net/http" برای متغیر های ثابت مثل http.StatusOK (اختیاری).

```go
import "net/http"
```

1. یک پوشه بسازید و وارد اون پوشه بشید

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

2. یک الگوی اولیه برای شروع را در داخل پروژه خود کپی کنید

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

3. پروژتون رو اجرا کنید

```sh
$ go run main.go
```

## شروع

> نمیدونید چطور یک کد گو رو اجرا کنید ؟ [اینجا کلیک کنید](https://golang.org/doc/code.html).

ابتدا یک فایل به اسم `example.go` بسازید :

```sh
# assume the following codes in example.go file
$ touch example.go
```

سپس کد های زیر رو توی فایل `example.go` بنویسید :

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
	router.Run() // listen and serve on 0.0.0.0:8080
}
```

حالا میتوانید کد رو با دستور زیر اجرا کنید :

```sh
# run example.go and visit 0.0.0.0:8080/ping on browser
$ go run example.go
```

---
title: "Быстрый старт"
черновик: false
вес: 2
---

В этом кратком руководстве мы извлечем уроки из сегментов кода и узнаем, как:

## Требования

- Go 1.16 или выше

## Установка

Чтобы установить пакет Gin, необходимо сначала установить Go и настроить рабочее пространство Go.

1. Скачайте и установите его:

```sh
$ go get -u github.com/gin-gonic/gin
```

2. Импортируйте его в свой код:

```go
import "github.com/gin-gonic/gin"
```

3. (Необязательно) Импортируйте `net/http`. Это необходимо, например, при использовании таких констант, как `http.StatusOK`.

```go
import "net/http"
```

1. Создайте папку проекта и `cd` в ней

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

2. Скопируйте начальный шаблон в свой проект

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

3. Запустите свой проект

```sh
$ go run main.go
```

## Начало работы

> Не знаете, как написать и выполнить код Go? [Нажмите здесь](https://golang.org/doc/code.html).

Сначала создайте файл с именем `example.go`:

```sh
# assume the following codes in example.go file
$ touch example.go
```

Затем поместите следующий код в файл `example.go`:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  r.Run() // listen and serve on 0.0.0.0:8080
}
```

И вы можете запустить код с помощью `go run example.go`:

```sh
# run example.go and visit 0.0.0.0:8080/ping on browser
$ go run example.go
```

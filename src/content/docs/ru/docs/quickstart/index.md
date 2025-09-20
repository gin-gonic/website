---
title: "Быстрый старт"
sidebar:
  order: 2
---

Добро пожаловать в руководство по быстрому старту Gin! Здесь вы узнаете, как установить Gin, настроить проект и запустить свой первый API, чтобы уверенно начинать создавать веб-сервисы.

## Требования

- **Go**: Версия 1.23 или выше должна быть установлена.
- Убедитесь, что Go добавлен в переменную окружения `PATH` и работает в вашем терминале. Если нужна помощь с установкой, смотрите [официальную документацию](https://golang.org/doc/install).

---

## Шаг 1: Установите Gin и инициализируйте проект

Создайте новую папку и инициализируйте Go-модуль:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Добавьте Gin в зависимости:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Шаг 2: Создайте своё первое приложение на Gin

Создайте файл `main.go`:

```sh
touch main.go
```

Откройте `main.go` и добавьте следующий код:

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
  router.Run() // по умолчанию слушает 0.0.0.0:8080
}
```

---

## Шаг 3: Запустите сервер API

Запустите сервер командой:

```sh
go run main.go
```

Откройте [http://localhost:8080/ping](http://localhost:8080/ping) в браузере и увидите:

```json
{"message":"pong"}
```

---

## Дополнительно: Использование net/http вместе с Gin

Чтобы использовать константы из `net/http` для кодов ответов, импортируйте также этот пакет:

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

## Советы и ресурсы

- Впервые используете Go? Узнайте, как писать и запускать код на Go [здесь](https://golang.org/doc/code.html).
- Для более полного примера воспользуйтесь командой:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Подробную документацию смотрите в [репозитории Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).

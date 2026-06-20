---
title: "Быстрый старт"
sidebar:
  order: 2
---

Добро пожаловать в руководство быстрого старта Gin! Это руководство проведёт вас через установку Gin, настройку проекта и запуск вашего первого API, чтобы вы могли уверенно начать создавать веб-сервисы.

## Предварительные требования

- **Версия Go**: Gin требует [Go](https://go.dev/) версии [1.25](https://go.dev/doc/devel/release#go1.25) или выше
- Убедитесь, что Go находится в вашем `PATH` и доступен из терминала. Для помощи по установке Go [смотрите официальную документацию](https://go.dev/doc/install).

---

## Шаг 1: Установка Gin и инициализация проекта

Начните с создания новой папки проекта и инициализации Go-модуля:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

Добавьте Gin как зависимость:

```sh
go get -u github.com/gin-gonic/gin
```

---

## Шаг 2: Создание первого приложения на Gin

Создайте файл с именем `main.go`:

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
  router.Run() // listens on 0.0.0.0:8080 by default
}
```

---

## Шаг 3: Запуск API-сервера

Запустите сервер командой:

```sh
go run main.go
```

Перейдите по адресу [http://localhost:8080/ping](http://localhost:8080/ping) в браузере, и вы должны увидеть:

```json
{"message":"pong"}
```

---

## Дополнительный пример: Использование net/http с Gin

Если вы хотите использовать константы `net/http` для кодов ответов, импортируйте его тоже:

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

- Новичок в Go? Узнайте, как писать и запускать код на Go в [официальной документации Go](https://go.dev/doc/code).
- Хотите попрактиковаться с концепциями Gin? Ознакомьтесь с нашими [Учебными ресурсами](../learning-resources) для интерактивных заданий и руководств.
- Нужен полнофункциональный пример? Попробуйте создать проект с помощью:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- Для более подробной документации посетите [документацию исходного кода Gin](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).

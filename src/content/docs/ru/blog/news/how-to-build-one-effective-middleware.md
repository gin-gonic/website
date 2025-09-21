---
title: "Как создать эффективный middleware"
linkTitle: "Как создать эффективный middleware"
lastUpdated: 2019-02-26
---

## Составные части

Middleware обычно состоит из двух частей:

- Первая часть выполняется один раз — при инициализации вашего middleware. Здесь вы настраиваете глобальные объекты, конфигурационную логику и т.д. — всё, что должно происходить только один раз за время жизни приложения.

- Вторая часть выполняется при каждой обработке запроса. Например, в middleware для базы данных вы можете внедрить глобальный объект базы данных в контекст запроса. После этого другие middleware и функции-обработчики могут получить и использовать его.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // Это первая часть
  // --->
  // Пример инициализации: проверка входных параметров
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // Это вторая часть
    // --->
    // Пример выполнения на каждый запрос: внедрение в контекст
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## Процесс выполнения

Рассмотрим следующий пример кода:

```go
func main() {
  router := gin.Default()

  router.Use(globalMiddleware())

  router.GET("/rest/n/api/*some", mid1(), mid2(), handler)

  router.Run()
}

func globalMiddleware() gin.HandlerFunc {
  fmt.Println("globalMiddleware...1")

  return func(c *gin.Context) {
    fmt.Println("globalMiddleware...2")
    c.Next()
    fmt.Println("globalMiddleware...3")
  }
}

func handler(c *gin.Context) {
  fmt.Println("exec handler.")
}

func mid1() gin.HandlerFunc {
  fmt.Println("mid1...1")

  return func(c *gin.Context) {

    fmt.Println("mid1...2")
    c.Next()
    fmt.Println("mid1...3")
  }
}

func mid2() gin.HandlerFunc {
  fmt.Println("mid2...1")

  return func(c *gin.Context) {
    fmt.Println("mid2...2")
    c.Next()
    fmt.Println("mid2...3")
  }
}
```

Согласно разделу [Составные части](#составные-части), когда вы запускаете процесс Gin, **первая часть** каждого middleware выполняется первой, и отображается следующая информация:

```go
globalMiddleware...1
mid1...1
mid2...1
```

Порядок инициализации:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Когда вы отправляете запрос — например, `curl -v localhost:8080/rest/n/api/some` — **вторая часть** каждого middleware выполняется по порядку и выводит следующее:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

То есть порядок выполнения такой:

```go
globalMiddleware...2
    |
    v
mid1...2
    |
    v
mid2...2
    |
    v
exec handler.
    |
    v
mid2...3
    |
    v
mid1...3
    |
    v
globalMiddleware...3

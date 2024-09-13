---
title: "Как создать эффективное промежуточное программное обеспечение? (Middleware)"
linkTitle: "How to build one effective middleware?"
date: 2019-02-26
---

## Constituent parts

Промежуточное ПО (Middleware) состоит из двух частей:

  - первая часть - это то, что выполняется один раз, когда вы инициализируете промежуточное ПО. В ней вы устанавливаете все глобальные объекты, логики и т. д. Все это происходит один раз за время жизни приложения.

  - Вторая часть - это то, что выполняется при каждом запросе. Например, в промежуточном ПО для работы с базами данных вы просто вводите свой "глобальный" объект базы данных в контекст. Как только он окажется внутри контекста, вы сможете получить его из других промежуточных модулей и из вашей функции-обработчика.

```go
func funcName(params string) gin.HandlerFunc {
    // <---
    // This is part one
    // --->
    // The following code is an example
    if err := check(params); err != nil {
        panic(err)
    }

    return func(c *gin.Context) {
        // <---
        // This is part two
        // --->
        // The following code is an example
        c.Set("TestVar", params)
        c.Next()    
    }
}
```

## Процесс выполнения

Во-первых, у нас есть следующий пример кода:

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

Согласно [Составные части](#Constituent-parts), когда мы запускаем процесс джина, **часть первая** будет выполняться первой и выведет следующую информацию:

```go
globalMiddleware...1
mid1...1
mid2...1
```

And init order is:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Когда мы выполним один запрос `curl -v localhost:8080/rest/n/api/some`, **часть вторая** выполнит свое промежуточное ПО и выведет следующую информацию:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

Другими словами, порядок выполнения таков:

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
```



---
title: "Middleware обработки ошибок"
sidebar:
  order: 4
---

В типичном RESTful-приложении вы можете столкнуться с ошибками в любом маршруте, такими как:

- Некорректный ввод от пользователя
- Сбои базы данных
- Несанкционированный доступ
- Внутренние ошибки сервера

По умолчанию Gin позволяет обрабатывать ошибки вручную в каждом маршруте с помощью `c.Error(err)`.
Но это быстро становится повторяющимся и непоследовательным.

Для решения этой проблемы мы можем использовать пользовательский middleware для обработки всех ошибок в одном месте.
Этот middleware выполняется после каждого запроса и проверяет наличие ошибок, добавленных в контекст Gin (`c.Errors`).
Если ошибка найдена, он отправляет структурированный JSON-ответ с соответствующим кодом статуса.

#### Пример

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler captures errors and returns a consistent JSON error response
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Step1: Process the request first.

        // Step2: Check if any errors were added to the context
        if len(c.Errors) > 0 {
            // Step3: Use the last error
            err := c.Errors.Last().Err

            // Step4: Respond with a generic error message
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // Any other steps if no errors are found
    }
}

func main() {
    r := gin.Default()

    // Attach the error-handling middleware
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### Расширения

- Сопоставление ошибок с кодами статуса
- Генерация разных ответов об ошибках на основе кодов ошибок
- Логирование ошибок

#### Преимущества middleware обработки ошибок

- **Согласованность**: Все ошибки следуют одному формату
- **Чистые маршруты**: Бизнес-логика отделена от форматирования ошибок
- **Меньше дублирования**: Не нужно повторять логику обработки ошибок в каждом обработчике

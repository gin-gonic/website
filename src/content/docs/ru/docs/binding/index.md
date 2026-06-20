---
title: "Привязка данных"
sidebar:
  order: 4
---

Gin предоставляет мощную систему привязки данных, которая разбирает данные запроса в структуры Go и автоматически их валидирует. Вместо ручного вызова `c.PostForm()` или чтения `c.Request.Body`, вы определяете структуру с тегами, и Gin делает всю работу.

## Bind vs ShouldBind

Gin предлагает два семейства методов привязки:

| Метод | При ошибке | Когда использовать |
|--------|----------|----------|
| `c.Bind`, `c.BindJSON` и т.д. | Автоматически вызывает `c.AbortWithError(400, err)` | Когда вы хотите, чтобы Gin обрабатывал ответы об ошибках |
| `c.ShouldBind`, `c.ShouldBindJSON` и т.д. | Возвращает ошибку для вашей обработки | Когда вам нужны пользовательские ответы об ошибках |

В большинстве случаев **предпочтительнее использовать `ShouldBind`** для большего контроля над обработкой ошибок.

## Быстрый пример

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## Поддерживаемые форматы

Gin может привязывать данные из множества источников: **JSON**, **XML**, **YAML**, **TOML**, **данные форм** (URL-кодированные и multipart), **строки запроса**, **URI-параметры** и **заголовки**. Используйте соответствующий тег структуры (`json`, `xml`, `yaml`, `form`, `uri`, `header`) для сопоставления полей. Правила валидации указываются в теге `binding` и используют синтаксис [go-playground/validator](https://github.com/go-playground/validator).

## В этом разделе

- [**Привязка модели и валидация**](./binding-and-validation/) -- Основные концепции привязки и правила валидации
- [**Пользовательские валидаторы**](./custom-validators/) -- Регистрация собственных функций валидации
- [**Привязка строки запроса или POST-данных**](./bind-query-or-post/) -- Привязка из строк запроса и тел форм
- [**Привязка URI**](./bind-uri/) -- Привязка параметров пути в структуры
- [**Привязка заголовков**](./bind-header/) -- Привязка HTTP-заголовков в структуры
- [**Значения по умолчанию**](./default-value/) -- Установка резервных значений для отсутствующих полей
- [**Формат коллекций**](./collection-format/) -- Обработка параметров-массивов в запросе
- [**Пользовательский unmarshaler**](./custom-unmarshaler/) -- Реализация пользовательской логики десериализации
- [**Привязка HTML-чекбоксов**](./bind-html-checkboxes/) -- Обработка ввода чекбоксов форм
- [**Привязка Multipart/urlencoded**](./multipart-urlencoded-binding/) -- Привязка данных multipart-форм
- [**Пользовательский тег структуры**](./custom-struct-tag/) -- Использование пользовательских тегов структур для сопоставления полей
- [**Привязка тела к разным структурам**](./bind-body-into-different-structs/) -- Разбор тела запроса более одного раза

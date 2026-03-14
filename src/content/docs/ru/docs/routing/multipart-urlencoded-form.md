---
title: "Multipart/Urlencoded форма"
sidebar:
  order: 4
---

Используйте `c.PostForm()` и `c.DefaultPostForm()` для чтения значений из отправленных форм. Эти методы работают как с `application/x-www-form-urlencoded`, так и с `multipart/form-data` — двумя стандартными способами отправки данных форм браузерами.

- `c.PostForm("field")` возвращает значение или пустую строку, если поле отсутствует.
- `c.DefaultPostForm("field", "fallback")` возвращает значение или указанное значение по умолчанию, если поле отсутствует.

```go
func main() {
  router := gin.Default()

  router.POST("/form_post", func(c *gin.Context) {
    message := c.PostForm("message")
    nick := c.DefaultPostForm("nick", "anonymous")

    c.JSON(200, gin.H{
      "status":  "posted",
      "message": message,
      "nick":    nick,
    })
  })
  router.Run(":8080")
}
```

### Проверка

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
```

## Смотрите также

- [Загрузка файлов](/ru/docs/routing/upload-file/)
- [Запрос и POST-форма](/ru/docs/routing/query-and-post-form/)

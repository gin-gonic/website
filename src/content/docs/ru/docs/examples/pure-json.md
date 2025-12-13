---
title: "PureJSON"
черновик: false
---

Обычно JSON заменяет специальные HTML-символы их юникодными сущностями, например, `<` становится `\u003c`. Если вы хотите кодировать такие символы буквально, вы можете использовать PureJSON.
Эта функция недоступна в Go 1.6 и ниже.

```go
func main() {
  r := gin.Default()
  
  // Serves unicode entities
  r.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })
  
  // Serves literal characters
  r.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // Досрочное прерывание с ответом PureJSON и кодом состояния (v1.11+)
  r.GET("/abort_purejson", func(c *gin.Context) {
    c.AbortWithStatusPureJSON(403, gin.H{"error": "forbidden"})
  })

  // listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

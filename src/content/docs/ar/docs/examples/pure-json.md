---
title: "PureJSON"
---

عادةً، يستبدل JSON أحرف HTML الخاصة بكيانات unicode الخاصة بها، مثل `<` يصبح `\u003c`. إذا كنت تريد ترميز هذه الأحرف حرفيًا، يمكنك استخدام PureJSON بدلاً من ذلك.
هذه الميزة غير متوفرة في Go 1.6 والإصدارات الأقدم.

```go
func main() {
  router := gin.Default()

  // يقدم كيانات unicode
  router.GET("/json", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // يقدم الأحرف الحرفية
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(200, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // إنهاء مبكر مع استجابة PureJSON ورمز الحالة (الإصدار 1.11+)
  router.GET("/abort_purejson", func(c *gin.Context) {
    c.AbortWithStatusPureJSON(403, gin.H{"error": "forbidden"})
  })

  // الاستماع والخدمة على 0.0.0.0:8080
  router.Run(":8080")
}
```

---
title: "تنسيق المجموعة للمصفوفات"
---

يمكنك التحكم في كيفية تقسيم Gin لقيم القوائم لحقول slice/array باستخدام علامة البنية `collection_format` مع ربط النماذج.

التنسيقات المدعومة (v1.11+):

- multi (افتراضي): مفاتيح متكررة أو قيم مفصولة بفواصل
- csv: قيم مفصولة بفواصل
- ssv: قيم مفصولة بمسافات
- tsv: قيم مفصولة بعلامات تبويب
- pipes: قيم مفصولة بأنابيب

مثال:

```go
package main

import (
  "net/http"
  "github.com/gin-gonic/gin"
)

type Filters struct {
  Tags      []string `form:"tags" collection_format:"csv"`     // /search?tags=go,web,api
  Labels    []string `form:"labels" collection_format:"multi"` // /search?labels=bug&labels=helpwanted
  IdsSSV    []int    `form:"ids_ssv" collection_format:"ssv"`  // /search?ids_ssv=1 2 3
  IdsTSV    []int    `form:"ids_tsv" collection_format:"tsv"`  // /search?ids_tsv=1\t2\t3
  Levels    []int    `form:"levels" collection_format:"pipes"` // /search?levels=1|2|3
}

func main() {
  r := gin.Default()
  r.GET("/search", func(c *gin.Context) {
    var f Filters
    if err := c.ShouldBind(&f); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, f)
  })
  r.Run(":8080")
}
```

القيم الافتراضية للمجموعات (v1.11+):

- استخدم `default` في علامة `form` لتعيين قيم احتياطية.
- بالنسبة لـ `multi` و `csv`، افصل القيم الافتراضية بفواصل منقوطة: `default=1;2;3`.
- بالنسبة لـ `ssv` و `tsv` و `pipes`، استخدم الفاصل الطبيعي في القيمة الافتراضية.

انظر أيضاً: مثال "ربط القيم الافتراضية لحقول النماذج".

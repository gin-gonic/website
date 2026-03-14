---
title: "عرض XML/JSON/YAML/ProtoBuf"
sidebar:
  order: 1
---

يوفر Gin دعماً مدمجاً لعرض الاستجابات بتنسيقات متعددة بما في ذلك JSON وXML وYAML وProtocol Buffers. هذا يسهل بناء واجهات برمجية تدعم التفاوض على المحتوى -- تقديم البيانات بأي تنسيق يطلبه العميل.

**متى تستخدم كل تنسيق:**

- **JSON** -- الخيار الأكثر شيوعاً لواجهات REST البرمجية والعملاء المعتمدين على المتصفح. استخدم `c.JSON()` للإخراج القياسي أو `c.IndentedJSON()` للتنسيق المقروء أثناء التطوير.
- **XML** -- مفيد عند التكامل مع الأنظمة القديمة أو خدمات SOAP أو العملاء الذين يتوقعون XML (مثل بعض تطبيقات المؤسسات).
- **YAML** -- مناسب لنقاط النهاية الموجهة نحو التكوين أو الأدوات التي تستهلك YAML أصلاً (مثل Kubernetes أو خطوط CI/CD).
- **ProtoBuf** -- مثالي للاتصال عالي الأداء ومنخفض التأخير بين الخدمات. ينتج Protocol Buffers حمولات أصغر وتسلسلاً أسرع مقارنة بالتنسيقات النصية، لكنه يتطلب تعريف مخطط مشترك (ملف `.proto`).

تقبل جميع طرق العرض رمز حالة HTTP وقيمة بيانات. يُسلسل Gin البيانات ويعيّن ترويسة `Content-Type` المناسبة تلقائياً.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.H is a shortcut for map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // You also can use a struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Note that msg.Name becomes "user" in the JSON
    // Will output  :   {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // The specific definition of protobuf is written in the testdata/protoexample file.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Note that data becomes binary data in the response
    // Will output protoexample.Test protobuf serialized data
    c.ProtoBuf(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

## انظر أيضاً

- [PureJSON](/ar/docs/rendering/pure-json/)
- [SecureJSON](/ar/docs/rendering/secure-json/)
- [AsciiJSON](/ar/docs/rendering/ascii-json/)
- [JSONP](/ar/docs/rendering/jsonp/)

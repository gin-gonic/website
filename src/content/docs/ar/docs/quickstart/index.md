---
title: "البدء السريع"
sidebar:
  order: 2
---

مرحباً بك في دليل البدء السريع لـ Gin! يرشدك هذا الدليل خلال تثبيت Gin، وإعداد مشروع، وتشغيل أول واجهة برمجية لك - حتى تتمكن من البدء في بناء خدمات الويب بثقة.

## المتطلبات الأساسية

- **إصدار Go**: يتطلب Gin إصدار [Go](https://go.dev/) [1.25](https://go.dev/doc/devel/release#go1.25) أو أعلى
- تأكد من أن Go موجود في `PATH` الخاص بك وقابل للاستخدام من الطرفية. للمساعدة في تثبيت Go، [راجع التوثيق الرسمي](https://go.dev/doc/install).

---

## الخطوة 1: تثبيت Gin وتهيئة مشروعك

ابدأ بإنشاء مجلد مشروع جديد وتهيئة وحدة Go:

```sh
mkdir gin-quickstart && cd gin-quickstart
go mod init gin-quickstart
```

أضف Gin كاعتماد:

```sh
go get -u github.com/gin-gonic/gin
```

---

## الخطوة 2: إنشاء تطبيقك الأول مع Gin

أنشئ ملفاً باسم `main.go`:

```sh
touch main.go
```

افتح `main.go` وأضف الكود التالي:

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

## الخطوة 3: تشغيل خادم الواجهة البرمجية

شغّل خادمك باستخدام:

```sh
go run main.go
```

انتقل إلى [http://localhost:8080/ping](http://localhost:8080/ping) في متصفحك، ويجب أن ترى:

```json
{"message":"pong"}
```

---

## مثال إضافي: استخدام net/http مع Gin

إذا أردت استخدام ثوابت `net/http` لرموز الاستجابة، قم باستيرادها أيضاً:

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

## نصائح وموارد

- جديد على Go؟ تعلم كيفية كتابة وتشغيل كود Go في [توثيق Go الرسمي](https://go.dev/doc/code).
- هل تريد التدرب على مفاهيم Gin عملياً؟ اطلع على [مصادر التعلم](../learning-resources) للتحديات التفاعلية والدروس.
- تحتاج إلى مثال متكامل الميزات؟ جرب البدء باستخدام:

  ```sh
  curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
  ```

- لمزيد من التوثيق التفصيلي، زر [توثيق كود Gin المصدري](https://github.com/gin-gonic/gin/blob/master/docs/doc.md).

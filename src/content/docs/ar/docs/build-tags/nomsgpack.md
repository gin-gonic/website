---
title: "البناء بدون MsgPack"
sidebar:
  order: 2
---

[MsgPack](https://msgpack.org/) (MessagePack) هو تنسيق تسلسل ثنائي مضغوط -- فكر فيه كبديل أسرع وأصغر لـ JSON. يتضمن Gin دعم عرض وربط MsgPack افتراضياً، مما يعني أن تطبيقك يمكنه قبول وإرجاع بيانات مُرمّزة بـ MsgPack مباشرة باستخدام `c.Bind()` و`c.Render()` مع نوع المحتوى المناسب.

ومع ذلك، العديد من التطبيقات تستخدم JSON فقط ولا تحتاج MsgPack أبداً. في هذه الحالة، يضيف اعتماد MsgPack وزناً غير ضروري للملف الثنائي المُترجم. يمكنك إزالته باستخدام علامة البناء `nomsgpack`.

## البناء بدون MsgPack

مرر علامة `nomsgpack` إلى `go build`:

```sh
go build -tags=nomsgpack .
```

هذا يعمل أيضاً مع أوامر Go الأخرى:

```sh
go run -tags=nomsgpack .
go test -tags=nomsgpack ./...
```

## ما الذي يتغير

عند البناء باستخدام `nomsgpack`، يستبعد Gin كود عرض وربط MsgPack في وقت التجميع. لهذا عدة تأثيرات عملية:

- الملف الثنائي المُترجم أصغر لأن مكتبة تسلسل MsgPack لا تُربط.
- أي معالج يحاول عرض أو ربط بيانات MsgPack لن يعمل بعد الآن. إذا كنت تستخدم `c.ProtoBuf()` أو عارضات أخرى غير MsgPack، فلن تتأثر.
- جميع ميزات JSON وXML وYAML وTOML وProtoBuf تستمر في العمل بشكل طبيعي.

:::note
إذا كانت واجهتك البرمجية لا تقدم استجابات MsgPack ولا تستدعي `c.MsgPack()` في أي مكان، فمن الآمن استخدام هذه العلامة. ستتصرف معالجات JSON وHTML الحالية بشكل مطابق.
:::

## التحقق من النتيجة

يمكنك التأكد من تقليل حجم الملف الثنائي بمقارنة البنائين:

```sh
# Standard build
go build -o gin-app .
ls -lh gin-app

# Build without MsgPack
go build -tags=nomsgpack -o gin-app-nomsgpack .
ls -lh gin-app-nomsgpack
```

يعتمد التوفير الدقيق على تطبيقك، لكن إزالة MsgPack عادةً تقتطع مقداراً صغيراً من الملف الثنائي النهائي. لمزيد من المعلومات، راجع [طلب السحب الأصلي](https://github.com/gin-gonic/gin/pull/1852).

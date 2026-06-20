---
title: "الإعلان عن Gin 1.12.0: دعم BSON، تحسينات السياق، الأداء والمزيد"
linkTitle: "إعلان إصدار Gin 1.12.0"
lastUpdated: 2026-02-28
---

## وصل Gin v1.12.0

يسعدنا الإعلان عن إصدار Gin v1.12.0، المليء بميزات جديدة وتحسينات أداء ذات معنى وجولة قوية من إصلاحات الأخطاء. يعمّق هذا الإصدار دعم Gin للبروتوكولات الحديثة ويحسّن تجربة المطور ويواصل تقليد المشروع في البقاء سريعاً وخفيفاً.

### الميزات الرئيسية

- **دعم بروتوكول BSON:** تدعم طبقة العرض الآن ترميز BSON، مما يفتح الباب لتبادل بيانات ثنائية أكثر كفاءة ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **طرق سياق جديدة:** مساعدان جديدان يجعلان معالجة الأخطاء أنظف وأكثر اصطلاحية:
  - `GetError` و`GetErrorSlice` لاسترداد الأخطاء الآمن من حيث النوع من السياق ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - طريقة `Delete` لإزالة المفاتيح من السياق ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **ربط مرن:** ربط URI والاستعلام يحترم الآن `encoding.UnmarshalText`، مما يمنحك مزيداً من التحكم في إلغاء تسلسل الأنواع المخصصة ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **خيار المسار المُرمّز:** خيار محرك جديد يتيح لك اختيار استخدام المسار المُرمّز (الخام) للتوجيه ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **Protocol Buffers في تفاوض المحتوى:** يدعم `context` الآن Protocol Buffers كنوع محتوى قابل للتفاوض، مما يجعل تكامل استجابات نمط gRPC أسهل ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **التأخير الملوّن في المسجّل:** يعرض المسجّل الافتراضي الآن التأخير بألوان، مما يسهّل اكتشاف الطلبات البطيئة بنظرة سريعة ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### الأداء والتحسينات

- **تحسينات شجرة الموجّه:** تحسينات متعددة لشجرة Radix تقلل التخصيصات وتسرّع تحليل المسارات:
  - تخصيصات أقل في `findCaseInsensitivePath` ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - تحليل المسارات باستخدام `strings.Count` للكفاءة ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - استبدال التعبيرات النمطية بدوال مخصصة في `redirectTrailingSlash` ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **تحسين الاسترداد:** قراءة تتبع المكدس أصبحت أكثر كفاءة ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **تحسينات المسجّل:** يمكن الآن تخطي مخرجات سلسلة الاستعلام عبر التكوين ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **ثقة مقبس Unix:** ترويسات `X-Forwarded-For` أصبحت موثوقة دائماً عند وصول الطلبات عبر مقبس Unix ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **أمان Flush:** لم يعد `Flush()` يسبب حالة ذعر عندما لا ينفّذ `http.ResponseWriter` الأساسي `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **إعادة هيكلة جودة الكود:** معالجة خرائط أنظف مع `maps.Copy` و`maps.Clone`، ثوابت مسماة تستبدل الأرقام السحرية، حلقات range-over-int حديثة، والمزيد ([#4352](https://github.com/gin-gonic/gin/pull/4352)، [#4333](https://github.com/gin-gonic/gin/pull/4333)، [#4529](https://github.com/gin-gonic/gin/pull/4529)، [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### إصلاحات الأخطاء

- **إصلاح ذعر الموجّه:** حل حالة ذعر في `findCaseInsensitivePathRec` عند تفعيل `RedirectFixedPath` ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **Content-Length في عرض البيانات:** `Data.Render` يكتب الآن ترويسة `Content-Length` بشكل صحيح ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **ClientIP مع ترويسات متعددة:** `ClientIP` يتعامل الآن بشكل صحيح مع الطلبات ذات قيم ترويسة `X-Forwarded-For` المتعددة ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **حالات حافة الربط:** إصلاح أخطاء القيم الفارغة في الربط ([#2169](https://github.com/gin-gonic/gin/pull/2169)) وتحسين معالجة الشرائح/المصفوفات الفارغة في ربط النماذج ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **مسارات النقطتين الحرفية:** المسارات ذات النقطتين الحرفية تعمل الآن بشكل صحيح مع `engine.Handler()` ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **تسرب واصف الملف:** `RunFd` يغلق الآن مقبض `os.File` بشكل صحيح لمنع تسرب الموارد ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **سلوك Hijack:** تحسين سلوك hijack لنمذجة دورة حياة الاستجابة بشكل صحيح ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **الاسترداد:** `http.ErrAbortHandler` يتم قمعه الآن في وسيط الاسترداد كما هو مقصود ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **عدم تطابق إصدار التصحيح:** إصلاح سلسلة إصدار غير صحيحة مُبلّغ عنها في وضع التصحيح ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### تحديثات البناء والاعتماديات وCI

- **الحد الأدنى Go 1.25:** الحد الأدنى لإصدار Go المدعوم هو الآن **1.25**، مع تحديث سير عمل CI وفقاً لذلك ([#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **ترقية اعتمادية BSON:** تمت ترقية اعتمادية ربط BSON إلى `mongo-driver` v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

Gin 1.12.0 يعكس تفاني مجتمعنا -- المساهمين والمراجعين والمستخدمين على حد سواء. شكراً لكم على جعل Gin أفضل مع كل إصدار.

هل أنت مستعد لتجربة Gin 1.12.0؟ [قم بالترقية على GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.12.0) وأخبرنا برأيك!

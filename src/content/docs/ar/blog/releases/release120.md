---
title: "تم إطلاق Gin 1.12.0"
linkTitle: "تم إطلاق Gin 1.12.0"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### المميزات

* feat(binding): إضافة دعم encoding.UnmarshalText في ربط uri/query ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): إضافة طرق GetError و GetErrorSlice لاسترجاع الأخطاء ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): إضافة دعم Protocol Buffers إلى المفاوضة على المحتوى ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): تنفيذ طريقة Delete ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): إضافة خيار لاستخدام المسار المهرب ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): تأخير الألوان ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): إضافة بروتوكول bson ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### إصلاح الأخطاء

* fix(binding): خطأ القيمة الفارغة ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): تحسين معالجة الشرائح/المصفوفات الفارغة في ربط النموذج ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): إصلاح معالجة ClientIP لقيم رأس X-Forwarded-For المتعددة ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): عدم تطابق الإصدار ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): إغلاق os.File في RunFd لمنع تسرب الموارد ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): إصلاح المسارات بالنقطتين الحرفيتين التي لا تعمل مع engine.Handler() ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): قمع http.ErrAbortHandler في recovery ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): كتابة طول المحتوى في Data.Render ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): تحسين سلوك الاختطاف لدورة حياة الرد ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): إصلاح الذعر في findCaseInsensitivePathRec مع RedirectFixedPath ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: تصحيح الأخطاء الإملائية وتحسين وضوح التوثيق وإزالة الكود الميت ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### التحسينات

* chore(binding): ترقية اعتماد bson إلى mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): الوثوق دائماً برؤوس xff من unix socket ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): ترقية golang.org/x/crypto إلى v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): ترقية quic-go إلى v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): السماح بتخطي إخراج سلسلة الاستعلام ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): منع ذعر Flush() عند وجود `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### إعادة هيكلة

* refactor(binding): استخدام maps.Copy لمعالجة خريطة أنظف ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): حذف أسماء قيم الإرجاع ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): استبدال عناوين IP محلية المشفرة بثابت ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): استخدام maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): استخدام sync.OnceValue لتبسيط وظيفة engine ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): مقارنة الأخطاء الذكية ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): نقل وظائف المرافق إلى utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: يمكن تحديث حلقة for باستخدام range على int ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: استبدال الأرقام السحرية بثوابت مسماة في bodyAllowedForStatus ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: استخدام b.Loop() لتبسيط الكود وتحسين الأداء ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### تحديثات عملية البناء / CI

* ci(bot): زيادة التكرار وتجميع تحديثات الاعتماديات ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): إعادة هيكلة تأكيدات الاختبار وتكوين linter ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): تحسين سلامة النوع وتنظيم الخادم في middleware HTTP ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): جدولة فحوصات أمان Trivy للتشغيل يومياً في منتصف الليل UTC ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: استبدال سير عمل فحص الثغرات بتكامل Trivy ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: تحديث سير عمل CI وتوحيد علامات تكوين Trivy ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: تحديث دعم إصدار Go إلى 1.25+ عبر CI والتوثيق ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### تحديثات التوثيق

* docs(README): إضافة شارة فحص أمان Trivy ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): إضافة تعليقات نموذجية لطرق ShouldBind\* ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): إصلاح بعض التعليقات ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): إصلاح اسم الدالة الخاطئ في التعليق ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): إعادة صياغة وتوسيع التوثيق من أجل الوضوح والاكتمال ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: الإعلان عن إصدار Gin 1.11.0 مع رابط المدونة ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: توثيق واستكمال إصدار Gin v1.12.0 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: إعادة صياغة قوالب المساهمة والدعم في GitHub ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: إعادة صياغة إرشادات المساهمة مع تعليمات شاملة ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: تحديث التوثيق لعكس تغييرات إصدار Go ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: تحديث تعليمات توثيق الميزة لرابط التوثيق المكسور ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### الأداء

* perf(path): استبدال regex بوظائف مخصصة في redirectTrailingSlash ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): تحسين قراءة الأسطر في وظيفة stack ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): تحسين تحليل المسار باستخدام strings.Count ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): تقليل التخصيصات في findCaseInsensitivePath ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### الاختبارات

* test(benchmarks): إصلاح اسم الدالة غير الصحيح ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): إضافة اختبارات للحالات الفارغة/nil ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): استخدام ثابت http.StatusContinue بدلاً من الرقم السحري 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): تحسين تغطية الاختبار من debug.go إلى 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): إضافة تغطية اختبار شاملة لحزمة ginS ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): حل حالات السباق في اختبارات التكامل ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): إضافة اختبارات شاملة للتعامل مع الأخطاء ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): إضافة اختبارات شاملة لعرض MsgPack ([#4537](https://github.com/gin-gonic/gin/pull/4537))

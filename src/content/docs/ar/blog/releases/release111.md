---
title: "تم إصدار Gin 1.11.0"
linkTitle: "تم إصدار Gin 1.11.0"
lastUpdated: 2024-09-20
---

## Gin v1.11.0

### الميزات

* feat(gin): دعم تجريبي لـ HTTP/3 باستخدام quic-go/quic-go ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): إضافة تنسيق تجميعة array في ربط النماذج ([#3986](https://github.com/gin-gonic/gin/pull/3986))، إضافة مصفوفة سلسلة مخصصة لفك ترميز علامة form ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): إضافة BindPlain ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): تصدير واختبار وتوثيق OnlyFilesFS ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): دعم unixMilli و unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): دعم القيم الافتراضية للمجموعات في ربط النماذج ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): أضيف دعم المزيد من الأنواع الأصلية في Go إلى GetXxx ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### التحسينات

* perf(context): تحسين أداء getMapFromFormData ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): استبدال string(/) بـ "/" في node.insertChild ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): إزالة باراميتر headers من writeHeader ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): تبسيط دوال "GetType()" ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): تبسيط دالة Error في SliceValidationError ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context): تجنب استخدام filepath.Dir مرتين في SaveUploadedFile ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): إعادة تصميم معالجة السياق وتحسين قوة الاختبارات ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): استبدال strings.Index بـ strings.Cut ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): إضافة باراميتر صلاحية اختياري إلى SaveUploadedFile ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): التحقق من عدم كون URL فارغًا في initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): تحسين منطق الحكم على YAML في Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: استبدال min المعرّفة ذاتيًا بالنسخة الرسمية ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: إزالة استخدام filepath.Dir الزائد ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### إصلاح الأخطاء

* fix: منع إعادة دخول البرنامج الوسيط في HandleContext ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): منع فك التشفير المكرر وإضافة التحقق في decodeToml ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): عدم حدوث panic عند معالجة طرق غير مسموح بها على شجرة فارغة ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): تحذير من سباق البيانات لوضع gin ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): التحقق من عدم كون URL فارغًا في initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): تحسين منطق الحكم على YAML في Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): التحقق من أن handler ليس nil ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): إصلاح رابط مكسور إلى التوثيق الإنجليزي ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): الحفاظ على رسائل panic متسقة عند فشل إنشاء نوع wildcard ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### تحديثات عملية البناء / CI

* ci: دمج فحص الثغرات الأمنية Trivy في تدفق CI ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: دعم Go 1.25 في CI/CD ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): ترقية github.com/bytedance/sonic من v1.13.2 إلى v1.14.0 ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: إضافة إصدار Go 1.24 إلى GitHub Actions ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: تحديث الحد الأدنى لإصدار Go لـ Gin إلى 1.21 ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): تفعيل linters جديدة (testifylint، usestdlibvars، perfsprint، إلخ) ([#4010](https://github.com/gin-gonic/gin/pull/4010)، [#4091](https://github.com/gin-gonic/gin/pull/4091)، [#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): تحديث سير العمل وتحسين الاتساق في طلبات الاختبار ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### تحديثات التبعيات

* chore(deps): ترقية google.golang.org/protobuf من 1.36.6 إلى 1.36.9 ([#4346](https://github.com/gin-gonic/gin/pull/4346)، [#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): ترقية github.com/stretchr/testify من 1.10.0 إلى 1.11.1 ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): ترقية actions/setup-go من 5 إلى 6 ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): ترقية github.com/quic-go/quic-go من 0.53.0 إلى 0.54.0 ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): ترقية golang.org/x/net من 0.33.0 إلى 0.38.0 ([#4178](https://github.com/gin-gonic/gin/pull/4178)، [#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): ترقية github.com/go-playground/validator/v10 من 10.20.0 إلى 10.22.1 ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### تحديثات التوثيق

* docs(changelog): تحديث ملاحظات الإصدار لـ Gin v1.10.1 ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: تصحيح أخطاء اللغة الإنجليزية والجمل غير الواضحة في doc/doc.md ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: تحديث التوثيق وملاحظات الإصدار لـ Gin v1.10.0 ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: تصحيح خطأ مطبعي في Gin Quick Start ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: تصحيح مشاكل في التعليقات والروابط ([#4205](https://github.com/gin-gonic/gin/pull/4205)، [#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: تصحيح مثال الكود لمجموعة المسارات ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): إضافة توثيق باللغة البرتغالية ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): تصحيح بعض أسماء الدوال في التعليق ([#4079](https://github.com/gin-gonic/gin/pull/4079))

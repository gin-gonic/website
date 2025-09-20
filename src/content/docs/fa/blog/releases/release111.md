---
title: "Gin 1.11.0 منتشر شد"
linkTitle: "Gin 1.11.0 منتشر شد"
lastUpdated: 2024-09-20
---

## Gin v1.11.0

### ویژگی‌ها

* feat(gin): پشتیبانی آزمایشی از HTTP/3 با استفاده از quic-go/quic-go ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): افزودن فرمت مجموعه آرایه‌ها در بایند فرم ([#3986](https://github.com/gin-gonic/gin/pull/3986))، افزودن رشته سفارشی برای unmarshal تگ form ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): افزودن BindPlain ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): خروجی گرفتن، تست و مستندسازی OnlyFilesFS ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): افزودن پشتیبانی از unixMilli و unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): پشتیبانی از ارزش‌های پیش‌فرض برای مجموعه‌ها در بایند فرم ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): تابع GetXxx اکنون از انواع بومی بیشتری در Go پشتیبانی می‌کند ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### بهبودها

* perf(context): بهینه‌سازی عملکرد getMapFromFormData ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): جایگزینی string(/) با "/" در node.insertChild ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): حذف پارامتر headers از writeHeader ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): ساده‌سازی توابع "GetType()" ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): ساده‌سازی متد Error در SliceValidationError ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context): جلوگیری از استفاده دوباره filepath.Dir در SaveUploadedFile ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): بازنگری مدیریت context و بهبود تست‌ها ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): جایگزینی strings.Index با strings.Cut ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): افزودن پارامتر مجوز اختیاری به SaveUploadedFile ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): بررسی عدم تهی بودن URL در initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): منطق قضاوت YAML در Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: جایگزینی min تعریف‌شده به صورت شخصی با نسخه رسمی ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: حذف استفاده‌های اضافه از filepath.Dir ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### رفع اشکال‌ها

* fix: جلوگیری از ورود مجدد middleware در HandleContext ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): جلوگیری از رمزگشایی تکراری و افزودن اعتبارسنجی در decodeToml ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): عدم بروز panic هنگام پردازش متد غیرمجاز روی درخت خالی ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): هشدار رقابت داده برای حالت gin ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): بررسی عدم تهی بودن URL در initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): منطق قضاوت YAML در Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): بررسی تهی نبودن handler ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): اصلاح لینک شکسته به مستندات انگلیسی ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): حفظ یکنواختی پیام‌های panic هنگام شکست ساخت wildcard ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### به‌روزرسانی‌های فرآیند ساخت / CI

* ci: ادغام اسکن آسیب‌پذیری Trivy در جریان کاری CI ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: پشتیبانی از Go 1.25 در CI/CD ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): ارتقاء github.com/bytedance/sonic از v1.13.2 به v1.14.0 ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: افزودن نسخه Go 1.24 به GitHub Actions ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: به‌روزرسانی حداقل نسخه Go برای Gin به 1.21 ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): فعال‌سازی linters جدید (testifylint، usestdlibvars، perfsprint و غیره) ([#4010](https://github.com/gin-gonic/gin/pull/4010), [#4091](https://github.com/gin-gonic/gin/pull/4091), [#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): بهبود و سازگاری بیشتر در workflows و درخواست‌های تست ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### به‌روزرسانی وابستگی‌ها

* chore(deps): ارتقاء google.golang.org/protobuf از 1.36.6 به 1.36.9 ([#4346](https://github.com/gin-gonic/gin/pull/4346), [#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): ارتقاء github.com/stretchr/testify از 1.10.0 به 1.11.1 ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): ارتقاء actions/setup-go از 5 به 6 ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): ارتقاء github.com/quic-go/quic-go از 0.53.0 به 0.54.0 ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): ارتقاء golang.org/x/net از 0.33.0 به 0.38.0 ([#4178](https://github.com/gin-gonic/gin/pull/4178), [#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): ارتقاء github.com/go-playground/validator/v10 از 10.20.0 به 10.22.1 ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### به‌روزرسانی مستندات

* docs(changelog): به‌روزرسانی یادداشت‌های انتشار برای Gin v1.10.1 ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: اصلاح اشتباهات گرامری انگلیسی و جملات نامناسب در doc/doc.md ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: به‌روزرسانی مستندات و یادداشت‌های انتشار برای Gin v1.10.0 ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: تصحیح غلط املایی در Gin Quick Start ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: اصلاح مشکلات نظرها و لینک‌ها ([#4205](https://github.com/gin-gonic/gin/pull/4205), [#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: اصلاح مثال گروه‌بندی مسیرها ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): افزودن مستندات پرتغالی ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): تصحیح نام برخی توابع در کامنت‌ها ([#4079](https://github.com/gin-gonic/gin/pull/4079))

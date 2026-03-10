---
title: "Gin 1.12.0 منتشر شد"
linkTitle: "Gin 1.12.0 منتشر شد"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### ویژگی‌ها

* feat(binding): افزودن پشتیبانی encoding.UnmarshalText در binding uri/query ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): افزودن متدهای GetError و GetErrorSlice برای بازیابی خطا ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): افزودن پشتیبانی Protocol Buffers به مذاکره محتوا ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): پیاده‌سازی متد Delete ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): افزودن گزینه برای استفاده از مسیر فرار شده ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): تاخیر رنگی ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): افزودن پروتکل bson ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### رفع اشکالات

* fix(binding): خطای مقدار خالی ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): بهبود مدیریت اسلایس/آرایه خالی در binding فرم ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): رفع مدیریت ClientIP برای مقادیر header X-Forwarded-For متعدد ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): عدم تطابق نسخه ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): بستن os.File در RunFd برای جلوگیری از نشت منبع ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): رفع مسارهای دو نقطه‌ای که با engine.Handler() کار نمی‌کنند ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): سرکوب http.ErrAbortHandler در recovery ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): نوشتن طول محتوا در Data.Render ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): بهبود رفتار hijack برای چرخه‌ی زندگی پاسخ ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): رفع panic در findCaseInsensitivePathRec با RedirectFixedPath ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: تصحیح اشتباهات تایپی، بهبود وضوح مستندات، و حذف کدهای مردہ ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### بهبودها

* chore(binding): ارتقاء وابستگی bson به mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): همیشه اعتماد به headerهای xff از unix socket ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): ارتقاء golang.org/x/crypto به v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): ارتقاء quic-go به v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): اجازه دادن برای حذف خروجی query string ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): جلوگیری از panic Flush() در صورت وجود `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### بازسازی

* refactor(binding): استفاده از maps.Copy برای مدیریت نقشه تمیزتر ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): حذف نام‌های مقادیر بازگشتی ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): جایگزینی آدرهای IP localhost کدگذاری شده با ثابت‌ها ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): استفاده از maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): استفاده از sync.OnceValue برای ساده‌سازی تابع engine ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): مقایسه هوشمند خطا ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): انتقال توابع util به utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: حلقه for می‌تواند با استفاده از range بر int مدرنیزه شود ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: جایگزینی اعداد جادویی با ثابت‌های نام‌گذاری شده در bodyAllowedForStatus ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: استفاده از b.Loop() برای ساده‌سازی کد و بهبود عملکرد ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### به‌روزرسانی‌های فرآیند ساخت / CI

* ci(bot): افزایش بسامد و گروه‌بندی به‌روزرسانی‌های وابستگی ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): بازسازی تأکیدات تست و پیکربندی linter ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): بهبود ایمنی نوع و سازمان‌دهی سرور در HTTP middleware ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): زمان‌بندی اسکن‌های امنیتی Trivy برای اجرا روزانه در نیمه‌شب UTC ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: جایگزینی گردش کار اسکن آسیب‌پذیری با ادغام Trivy ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: به‌روزرسانی گردش‌های کار CI و استاندارد‌سازی نقل‌های پیکربندی Trivy ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: به‌روزرسانی پشتیبانی نسخه Go به 1.25+ در سراسر CI و مستندات ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### به‌روزرسانی‌های مستندات

* docs(README): افزودن نشان اسکن امنیتی Trivy ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): افزودن نظرات نمونه برای متدهای ShouldBind\* ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): رفع برخی نظرات ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): رفع نام تابع اشتباه در نظر ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): بازنمایی و گسترش مستندات برای وضوح و کمال ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: اعلام انتشار Gin 1.11.0 با پیوند وبلاگ ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: مستندات و نهایی‌سازی انتشار Gin v1.12.0 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: بازنمایی قالب‌های مشارکت و پشتیبانی GitHub ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: بازنمایی راهنمای مشارکت با دستورالعمل‌های جامع ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: به‌روزرسانی مستندات برای بازتاب تغییرات نسخه Go ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: به‌روزرسانی دستورالعمل‌های مستندات ویژگی برای پیوند مستندات شکسته ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### عملکرد

* perf(path): جایگزینی regex با توابع سفارشی در redirectTrailingSlash ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): بهینه‌سازی خواندن خط در تابع stack ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): بهینه‌سازی تجزیه مسیر با استفاده از strings.Count ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): کاهش تخصیص‌ها در findCaseInsensitivePath ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### تست‌ها

* test(benchmarks): رفع نام تابع نادرست ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): افزودن تست‌ها برای موارد خالی/nil ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): استفاده از ثابت http.StatusContinue به جای عدد جادویی 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): بهبود پوشش تست debug.go به 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): افزودن پوشش تست جامع برای بسته ginS ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): حل شرایط نژاد در تست‌های ادغام ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): افزودن تست‌های جامع برای مدیریت خطا ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): افزودن تست‌های جامع برای رندر MsgPack ([#4537](https://github.com/gin-gonic/gin/pull/4537))

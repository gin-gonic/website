---
title: Gin Web Framework
linkTitle: Gin Web Framework
---

{{< blocks/cover title="Gin Web Framework" image_anchor="top" height="full" >}}
<a class="btn btn-lg btn-primary me-3 mb-4" href="/docs/"> Daha Fazla Öğren
<i class="fas fa-arrow-alt-circle-right ms-2"></i> </a>
<a class="btn btn-lg btn-secondary text-dark me-3 mb-4" href="https://github.com/gin-gonic/gin/releases">
İndir <i class="fab fa-github ms-2 "></i> </a>

<p class="lead mt-5">Go ile yazılmış, en hızlı, tam teşekküllü ve kristal berraklığında bir web çerçevesi.</p>

{{< blocks/link-down color="info" >}} {{< /blocks/cover >}}

{{% blocks/lead color="white" %}}

**Gin nedir??**

Gin, Golang'da yazılmış bir web çerçevesidir.

Martini benzeri bir API'ye sahiptir, ancak performans açısından Martini'den 40
kata kadar daha hızlıdır.

Performans ve üretkenliğe ihtiyacınız varsa Gin'i seveceksiniz.

{{% /blocks/lead %}}

{{% blocks/section color="light" type="row" %}}
{{% blocks/feature icon="fa-tachometer-alt" title="Hızlı" %}}

Radix ağacı tabanlı routing, küçük bellek ayak izi. Reflection yok.
Öngörülebilir API performansı.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-bars" title="Middleware desteği" %}}

Gelen bir HTTP isteği, bir middleware zinciri ve son eylem tarafından
işlenebilir. Örneğin: Logger, Authorization, GZIP ve son olarak veritabanına bir
mesaj gönderin.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-life-ring" title="Çökmeye Dirençli" %}}

Gin, bir HTTP isteği sırasında oluşan bir paniği yakalayabilir ve düzeltebilir.
Bu şekilde sunucunuz her zaman çalışacaktır. Ayrıca bir paniği Sentry'ye
bildirmek de mümkündür.

{{% /blocks/feature %}}

{{% /blocks/section %}}

{{% blocks/section color="white" type="row" %}}
{{% blocks/feature icon="fa-check-circle" title="JSON doğrulama" %}}

Gin, bir isteğin JSON'ını ayrıştırabilir ve doğrulayabilir. Örneğin gerekli
değerlerin varlığını kontrol edebilir.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-users-cog" title="Route gruplama" %}}

Routelarınızı daha iyi düzenleyin. Authorization gerektiren veya gerektirmeyen,
farklı API sürümlerini kolayca düzenleyin. Ayrıca, gruplar performansı
düşürmeden sınırsız olarak iç içe yerleştirilebilir.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-briefcase" title="Hata yönetimi" %}}

Gin, bir HTTP isteği sırasında meydana gelen tüm hataları toplamak için uygun
bir yol sağlar. Sonunda, middleware bunları bir log dosyasına veya bir
veritabanına yazabilir ve ağ üzerinden gönderebilir.

{{% /blocks/feature %}}

{{% /blocks/section %}}

{{% blocks/section color="info" type="row" %}}

{{% blocks/feature icon="fa-images" title="Hazır rendering" %}}

Gin, JSON, XML ve HTML işleme için kullanımı kolay bir API sağlar.

{{% /blocks/feature %}}

{{% blocks/feature icon="fa-code" title="Genişletilebilir" %}}

Yeni middleware oluşturmak çok kolaydır, sadece örnek kodları inceleyin.

{{% /blocks/feature %}}

{{% /blocks/section %}}

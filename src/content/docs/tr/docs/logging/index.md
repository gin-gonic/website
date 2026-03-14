---
title: "Loglama"
sidebar:
  order: 7
---

Gin, durum kodu, HTTP metodu, yol ve gecikme dahil olmak üzere her HTTP isteği hakkında ayrıntıları kaydeden yerleşik bir logger ara katmanı içerir.

`gin.Default()` ile bir yönlendirici oluşturduğunuzda, logger ara katmanı kurtarma ara katmanıyla birlikte otomatik olarak eklenir:

```go
// Logger and Recovery middleware are already attached
router := gin.Default()
```

Hangi ara katmanı kullanacağınız üzerinde tam kontrol istiyorsanız, `gin.New()` ile bir yönlendirici oluşturun ve logger'ı manuel olarak ekleyin:

```go
// No middleware attached
router := gin.New()

// Attach the logger middleware
router.Use(gin.Logger())
```

Varsayılan logger `os.Stdout`'a yazar ve her istek için şu tarz çıktı üretir:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     512.345µs |       127.0.0.1 | GET      "/ping"
```

Her giriş bir zaman damgası, HTTP durum kodu, istek gecikmesi, istemci IP'si, HTTP metodu ve istenen yolu içerir.

## Bu bölümde

- [**Dosyaya log yazma**](./write-log/) -- Log çıktısını bir dosyaya, konsola veya her ikisine aynı anda yönlendirme.
- [**Özel log formatı**](./custom-log-format/) -- `LoggerWithFormatter` kullanarak kendi log formatınızı tanımlama.
- [**Loglamayı atlama**](./skip-logging/) -- Belirli yollar veya koşullar için loglamayı atlama.
- [**Log çıktısı renklendirmesini kontrol etme**](./controlling-log-output-coloring/) -- Renkli log çıktısını etkinleştirme veya devre dışı bırakma.
- [**Sorgu dizelerini loglamaktan kaçınma**](./avoid-logging-query-strings/) -- Güvenlik ve gizlilik için log çıktısından sorgu parametrelerini çıkarma.
- [**Rota loglarının formatını tanımlama**](./define-format-for-the-log-of-routes/) -- Başlangıçta kayıtlı rotaların nasıl yazdırılacağını özelleştirme.

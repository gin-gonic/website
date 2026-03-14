---
title: "Dosya yükleme"
sidebar:
  order: 7
---

Gin, multipart dosya yüklemelerini kolayca işlemeyi sağlar. Framework, yüklenen dosyaları almak için `gin.Context` üzerinde yerleşik metodlar sunar:

- **`c.FormFile(name)`** -- İstekten form alan adına göre tek bir dosya alır.
- **`c.MultipartForm()`** -- Tüm multipart formu ayrıştırır, yüklenen tüm dosyalara ve alan değerlerine erişim sağlar.
- **`c.SaveUploadedFile(file, dst)`** -- Alınan bir dosyayı diskteki hedef yola kaydeden kullanışlı bir metod.

### Bellek limiti

Gin, multipart form ayrıştırması için `router.MaxMultipartMemory` aracılığıyla varsayılan **32 MiB** bellek limiti ayarlar. Bu limitin altındaki dosyalar bellekte tamponlanır; bu limiti aşan dosyalar diskteki geçici dosyalara yazılır. Bu değeri uygulamanızın ihtiyaçlarına göre ayarlayabilirsiniz:

```go
router := gin.Default()
// Lower the limit to 8 MiB
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### Güvenlik notu

İstemci tarafından bildirilen dosya adı (`file.Filename`) **güvenilmemelidir**. Dosya sistemi işlemlerinde kullanmadan önce her zaman temizleyin veya değiştirin. Ayrıntılar için [MDN'deki Content-Disposition belgelendirmesine](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) bakın.

### Alt sayfalar

- [**Tekli dosya**](./single-file/) -- İstek başına tek bir dosya yükleme ve kaydetme.
- [**Çoklu dosya**](./multiple-file/) -- Tek bir istekte birden fazla dosya yükleme ve kaydetme.
- [**Yükleme boyutunu sınırlama**](./limit-bytes/) -- `http.MaxBytesReader` kullanarak yükleme boyutunu kısıtlama.

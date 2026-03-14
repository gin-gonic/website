---
title: "Bağlama (Binding)"
sidebar:
  order: 4
---

Gin, istek verilerini Go struct'larına ayrıştıran ve otomatik olarak doğrulayan güçlü bir bağlama sistemi sağlar. Manuel olarak `c.PostForm()` çağırmak veya `c.Request.Body` okumak yerine, etiketlerle bir struct tanımlar ve Gin'in işi yapmasına izin verirsiniz.

## Bind ve ShouldBind karşılaştırması

Gin iki bağlama metod ailesi sunar:

| Metod | Hata durumunda | Şu durumda kullanın |
|--------|----------|----------|
| `c.Bind`, `c.BindJSON`, vb. | Otomatik olarak `c.AbortWithError(400, err)` çağırır | Gin'in hata yanıtlarını işlemesini istediğinizde |
| `c.ShouldBind`, `c.ShouldBindJSON`, vb. | Hatayı size işlemeniz için döndürür | Özel hata yanıtları istediğinizde |

Çoğu durumda, hata işleme üzerinde daha fazla kontrol için **`ShouldBind`'ı tercih edin**.

## Hızlı örnek

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## Desteklenen formatlar

Gin birçok kaynaktan veri bağlayabilir: **JSON**, **XML**, **YAML**, **TOML**, **form verisi** (URL-encoded ve multipart), **sorgu dizeleri**, **URI parametreleri** ve **başlıklar**. Alanları eşlemek için uygun struct etiketini (`json`, `xml`, `yaml`, `form`, `uri`, `header`) kullanın. Doğrulama kuralları `binding` etiketine gider ve [go-playground/validator](https://github.com/go-playground/validator) sözdizimini kullanır.

## Bu bölümde

- [**Model bağlama ve doğrulama**](./model-binding-and-validation/) -- Temel bağlama kavramları ve doğrulama kuralları
- [**Özel doğrulayıcılar**](./custom-validators/) -- Kendi doğrulama fonksiyonlarınızı kaydetme
- [**Sorgu dizesi veya post verisi bağlama**](./bind-query-or-post/) -- Sorgu dizeleri ve form gövdelerinden bağlama
- [**URI bağlama**](./bind-uri/) -- Yol parametrelerini struct'lara bağlama
- [**Başlık bağlama**](./bind-header/) -- HTTP başlıklarını struct'lara bağlama
- [**Varsayılan değer**](./default-value/) -- Eksik alanlar için yedek değerler ayarlama
- [**Koleksiyon formatı**](./collection-format/) -- Dizi sorgu parametrelerini işleme
- [**Özel unmarshaler**](./custom-unmarshaler/) -- Özel seriyi kaldırma mantığı uygulama
- [**HTML checkbox bağlama**](./bind-html-checkboxes/) -- Checkbox form girişlerini işleme
- [**Multipart/urlencoded bağlama**](./multipart-urlencoded-binding/) -- Multipart form verisi bağlama
- [**Özel struct etiketi**](./custom-struct-tag/) -- Alan eşleme için özel struct etiketleri kullanma
- [**Gövdeyi farklı struct'lara bağlamayı deneme**](./bind-body-into-different-structs/) -- İstek gövdesini birden fazla kez ayrıştırma

---
title: "Model bağlama ve doğrulama"
sidebar:
  order: 1
---

Bir istek gövdesini bir türe bağlamak için model bağlama kullanın. Şu anda JSON, XML, YAML ve standart form değerlerinin (foo=bar&boo=baz) bağlanmasını destekliyoruz.

Gin, doğrulama için [**go-playground/validator/v10**](https://github.com/go-playground/validator) kullanır. Etiket kullanımı hakkında tam belgelendirmeyi [buradan](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags) kontrol edin.

Bağlamak istediğiniz tüm alanlara ilgili bağlama etiketini ayarlamanız gerektiğini unutmayın. Örneğin, JSON'dan bağlama yaparken `json:"alanadi"` olarak ayarlayın.

Ayrıca, Gin bağlama için iki set metod sağlar:
- **Tür** - Zorunlu bağlama
  - **Metodlar** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Davranış** - Bu metodlar arka planda `MustBindWith` kullanır. Bir bağlama hatası varsa, istek `c.AbortWithError(400, err).SetType(ErrorTypeBind)` ile iptal edilir. Bu, yanıt durum kodunu 400'e ve `Content-Type` başlığını `text/plain; charset=utf-8` olarak ayarlar. Bundan sonra yanıt kodunu ayarlamaya çalışırsanız, `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422` uyarısı alırsınız. Davranış üzerinde daha fazla kontrol istiyorsanız, eşdeğer `ShouldBind` metodunu kullanmayı düşünün.
- **Tür** - İsteğe bağlı bağlama
  - **Metodlar** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Davranış** - Bu metodlar arka planda `ShouldBindWith` kullanır. Bir bağlama hatası varsa, hata döndürülür ve isteği ve hatayı uygun şekilde işlemek geliştiricinin sorumluluğundadır.

Bind metodunu kullanırken, Gin Content-Type başlığına bağlı olarak bağlayıcıyı çıkarmaya çalışır. Neyi bağladığınızdan eminseniz `MustBindWith` veya `ShouldBindWith` kullanabilirsiniz.

Belirli alanların zorunlu olduğunu da belirtebilirsiniz. Bir alan `binding:"required"` ile süslenmişse ve bağlama sırasında boş bir değere sahipse, bir hata döndürülecektir.

Struct alanlarından biri kendisi bir struct ise (iç içe struct), o struct'ın alanlarının da doğru şekilde doğrulanması için `binding:"required"` ile süslenmesi gerekecektir.

```go
// Binding from JSON
type Login struct {
  User     string `form:"user" json:"user" xml:"user"  binding:"required"`
  Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  // Example for binding JSON ({"user": "manu", "password": "123"})
  router.POST("/loginJSON", func(c *gin.Context) {
    var json Login
    if err := c.ShouldBindJSON(&json); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if json.User != "manu" || json.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // Example for binding XML (
  //  <?xml version="1.0" encoding="UTF-8"?>
  //  <root>
  //    <user>manu</user>
  //    <password>123</password>
  //  </root>)
  router.POST("/loginXML", func(c *gin.Context) {
    var xml Login
    if err := c.ShouldBindXML(&xml); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if xml.User != "manu" || xml.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // Example for binding a HTML form (user=manu&password=123)
  router.POST("/loginForm", func(c *gin.Context) {
    var form Login
    // This will infer what binder to use depending on the content-type header.
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if form.User != "manu" || form.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

### Örnek istek

```sh
$ curl -v -X POST \
  http://localhost:8080/loginJSON \
  -H 'content-type: application/json' \
  -d '{ "user": "manu" }'
> POST /loginJSON HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.51.0
> Accept: */*
> content-type: application/json
> Content-Length: 18
>
* upload completely sent off: 18 out of 18 bytes
< HTTP/1.1 400 Bad Request
< Content-Type: application/json; charset=utf-8
< Date: Fri, 04 Aug 2017 03:51:31 GMT
< Content-Length: 100
<
{"error":"Key: 'Login.Password' Error:Field validation for 'Password' failed on the 'required' tag"}
```

### Doğrulamayı atlama

Yukarıdaki örnekte `curl` komutu kullanıldığında hata döndürür. Çünkü örnekte `Password` için `binding:"required"` kullanılmıştır. `Password` için `binding:"-"` kullanırsanız, yukarıdaki örneği tekrar çalıştırdığınızda hata döndürmeyecektir.

## Ayrıca bakınız

- [Özel doğrulayıcılar](/tr/docs/binding/custom-validators/)
- [Sorgu veya post verisi bağlama](/tr/docs/binding/bind-query-or-post/)

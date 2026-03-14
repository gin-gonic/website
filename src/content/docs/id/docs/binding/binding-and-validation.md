---
title: "Model binding dan validasi"
sidebar:
  order: 1
---

Untuk mengikat body permintaan ke sebuah tipe, gunakan model binding. Saat ini kami mendukung binding JSON, XML, YAML, dan nilai form standar (foo=bar&boo=baz).

Gin menggunakan [**go-playground/validator/v10**](https://github.com/go-playground/validator) untuk validasi. Lihat dokumentasi lengkap penggunaan tag [di sini](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

Perhatikan bahwa Anda perlu mengatur tag binding yang sesuai pada semua field yang ingin Anda ikat. Misalnya, saat binding dari JSON, atur `json:"fieldname"`.

Selain itu, Gin menyediakan dua set metode untuk binding:
- **Tipe** - Must bind
  - **Metode** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Perilaku** - Metode ini menggunakan `MustBindWith` di balik layar. Jika terjadi error binding, permintaan dibatalkan dengan `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. Ini mengatur kode status respons ke 400 dan header `Content-Type` diatur ke `text/plain; charset=utf-8`. Perhatikan bahwa jika Anda mencoba mengatur kode respons setelah ini, akan menghasilkan peringatan `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. Jika Anda ingin kontrol lebih besar atas perilaku, pertimbangkan menggunakan metode `ShouldBind` yang setara.
- **Tipe** - Should bind
  - **Metode** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Perilaku** - Metode ini menggunakan `ShouldBindWith` di balik layar. Jika terjadi error binding, error dikembalikan dan menjadi tanggung jawab pengembang untuk menangani permintaan dan error dengan tepat.

Saat menggunakan metode Bind, Gin mencoba menyimpulkan binder berdasarkan header Content-Type. Jika Anda yakin apa yang Anda ikat, Anda dapat menggunakan `MustBindWith` atau `ShouldBindWith`.

Anda juga dapat menentukan bahwa field tertentu wajib diisi. Jika sebuah field didekorasi dengan `binding:"required"` dan memiliki nilai kosong saat binding, error akan dikembalikan.

Jika salah satu field struct adalah struct itu sendiri (struct bertingkat), field dari struct tersebut juga perlu didekorasi dengan `binding:"required"` agar validasi berjalan dengan benar.

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

### Contoh permintaan

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

### Melewati validasi

Saat menjalankan contoh di atas menggunakan perintah `curl` di atas, dikembalikan error. Karena contoh menggunakan `binding:"required"` untuk `Password`. Jika menggunakan `binding:"-"` untuk `Password`, maka tidak akan mengembalikan error saat menjalankan contoh di atas lagi.

## Lihat juga

- [Validator kustom](/id/docs/binding/custom-validators/)
- [Bind query atau post data](/id/docs/binding/bind-query-or-post/)

---
title: "Model binding dan validasi"
---

Untuk melakukan binding body permintaan ke dalam sebuah tipe, gunakan model binding. Kami saat ini mendukung binding JSON, XML, YAML dan nilai formulir standar (foo=bar&boo=baz).

Gin menggunakan [**go-playground/validator/v10**](https://github.com/go-playground/validator) untuk validasi. Lihat dokumentasi lengkap penggunaan tag [di sini](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

Perhatikan bahwa Anda perlu mengatur tag binding yang sesuai pada semua field yang ingin Anda bind. Contohnya, saat binding JSON, atur `json:"fieldname"`.

Selain itu, Gin menyediakan dua kumpulan metode untuk binding:
- **Tipe** - Wajib bind
  - **Metode** - `Bind`, `BindJSON`, `BindXML`, `BindQuery`, `BindYAML`
  - **Perilaku** - Metode-metode ini menggunakan `MustBindWith` di balik layar. Jika terjadi galat binding, permintaan akan dihentikan dengan `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. Ini mengatur kode status respons menjadi 400 dan header `Content-Type` diatur ke `text/plain; charset=utf-8`. Perhatikan bahwa jika Anda mencoba mengatur kode respons setelah ini, akan menghasilkan peringatan `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. Jika Anda ingin memiliki kontrol yang lebih besar atas perilakunya, pertimbangkan untuk menggunakan metode yang setara dengan `ShouldBind`.
- **Tipe** - Seharusnya bind
  - **Metode** - `ShouldBind`, `ShouldBindJSON`, `ShouldBindXML`, `ShouldBindQuery`, `ShouldBindYAML`
  - **Perilaku** - Metode-metode ini menggunakan `ShouldBindWith` di balik layar. Jika terjadi galat binding, error dikembalikan dan merupakan tanggung jawab developer untuk menangani permintaan dan error dengan tepat.

Saat menggunakan metode Bind, Gin mencoba menginferensi binder berdasarkan header Content-Type. Jika Anda yakin apa yang Anda bind, Anda dapat menggunakan `MustBindWith` atau `ShouldBindWith`.

Anda juga dapat menentukan bahwa field tertentu diperlukan. Jika sebuah field ditandai dengan `binding:"required"` dan memiliki nilai kosong saat binding, sebuah error akan dikembalikan.

Jika salah satu field struct itu sendiri adalah struct (struct bersarang), field dari struct tersebut juga perlu ditandai dengan `binding:"required"` agar dapat divalidasi dengan benar.

```go
// Binding dari JSON
type Login struct {
  User     string `form:"user" json:"user" xml:"user"  binding:"required"`
  Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  // Contoh binding JSON ({"user": "manu", "password": "123"})
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

  // Contoh binding XML (
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

  // Contoh binding formulir HTML (user=manu&password=123)
  router.POST("/loginForm", func(c *gin.Context) {
    var form Login
    // Ini akan menginferensi binder apa yang akan digunakan berdasarkan header content-type.
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

  // Jalankan server pada 0.0.0.0:8080
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

### Lewati validasi

Saat menjalankan contoh di atas menggunakan perintah `curl`, akan mengembalikan error. Karena contoh tersebut menggunakan `binding:"required"` untuk `Password`. Jika menggunakan `binding:"-"` untuk `Password`, maka tidak akan mengembalikan error saat menjalankan contoh di atas lagi.

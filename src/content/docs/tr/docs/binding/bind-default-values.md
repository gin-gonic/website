---
title: "Form alanları için varsayılan değer bağlama"
sidebar:
  order: 5
---

Bazen istemci bir değer göndermediğinde bir alanın varsayılan bir değere dönmesini isteyebilirsiniz. Gin'in form bağlaması, `form` struct etiketindeki `default` seçeneği aracılığıyla varsayılan değerleri destekler. Bu, skaler değerler için çalışır ve Gin v1.11'den itibaren açık koleksiyon formatlarıyla koleksiyonlar (dilimler/diziler) için de çalışır.

Önemli noktalar:

- Varsayılanı form anahtarının hemen ardına koyun: `form:"name,default=William"`.
- Koleksiyonlar için, değerlerin nasıl bölüneceğini `collection_format:"multi|csv|ssv|tsv|pipes"` ile belirtin.
- `multi` ve `csv` için, varsayılan değerleri ayırmak üzere noktalı virgül kullanın (ör., `default=1;2;3`). Gin bunları dahili olarak virgüllere dönüştürür, böylece etiket ayrıştırıcısı belirsizlikten kurtulur.
- `ssv` (boşluk), `tsv` (sekme) ve `pipes` (|) için, varsayılanlarda doğal ayırıcıyı kullanın.

Örnek:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name      string    `form:"name,default=William"`
  Age       int       `form:"age,default=10"`
  Friends   []string  `form:"friends,default=Will;Bill"`                     // multi/csv: use ; in defaults
  Addresses [2]string `form:"addresses,default=foo bar" collection_format:"ssv"`
  LapTimes  []int     `form:"lap_times,default=1;2;3" collection_format:"csv"`
}

func main() {
  r := gin.Default()
  r.POST("/person", func(c *gin.Context) {
    var req Person
    if err := c.ShouldBind(&req); err != nil { // infers binder by Content-Type
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, req)
  })
  _ = r.Run(":8080")
}
```

Herhangi bir gövde olmadan POST yaparsanız, Gin varsayılan değerlerle yanıt verir:

```sh
curl -X POST http://localhost:8080/person
```

Yanıt (örnek):

```json
{
  "Name": "William",
  "Age": 10,
  "Friends": ["Will", "Bill"],
  "Addresses": ["foo", "bar"],
  "LapTimes": [1, 2, 3]
}
```

Notlar ve uyarılar:

- Virgüller Go struct etiket sözdiziminde seçenekleri ayırmak için kullanılır; varsayılan değerlerde virgül kullanmaktan kaçının.
- `multi` ve `csv` için, noktalı virgüller varsayılan değerleri ayırır; bu formatlar için tek tek varsayılan değerler içinde noktalı virgül kullanmayın.
- Geçersiz `collection_format` değerleri bağlama hatasına neden olacaktır.

İlgili değişiklikler:

- Form bağlama için koleksiyon formatları (`multi`, `csv`, `ssv`, `tsv`, `pipes`) v1.11 civarında geliştirildi.
- Koleksiyonlar için varsayılan değerler v1.11'de eklendi (PR #4048).

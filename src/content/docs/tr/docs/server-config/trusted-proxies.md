---
title: "Güvenilir proxy'ler"
sidebar:
  order: 8
---

Gin, gerçek istemci IP'sini tutmak için hangi başlıkların kullanılacağını (varsa) ve bu başlıklardan birini belirtmeye güvendiğiniz proxy'leri (veya doğrudan istemcileri) belirtmenize olanak tanır.

### Güvenilir proxy yapılandırmasının önemi

Uygulamanız bir ters proxy (Nginx, HAProxy, bir bulut yük dengeleyici vb.) arkasında bulunduğunda, proxy orijinal istemcinin IP adresini `X-Forwarded-For` veya `X-Real-Ip` gibi başlıklarda iletir. Sorun şu ki **herhangi bir istemci bu başlıkları ayarlayabilir**. Uygun güvenilir proxy yapılandırması olmadan, bir saldırgan `X-Forwarded-For`'u taklit ederek şunları yapabilir:

- **IP tabanlı erişim kontrollerini atlama** -- Uygulamanız belirli rotaları dahili bir IP aralığıyla (ör., `10.0.0.0/8`) kısıtlıyorsa, bir saldırgan genel bir IP'den `X-Forwarded-For: 10.0.0.1` gönderebilir ve kısıtlamayı tamamen atlayabilir.
- **Logları ve denetim izlerini bozma** -- Sahte IP'ler, istekleri gerçek kaynağa geri izleyemeyeceğiniz için olay soruşturmasını güvenilmez kılar.
- **Hız sınırlamayı atlatma** -- Hız sınırlama `ClientIP()`'ye göre anahtarlanmışsa, her istek kısıtlamadan kaçınmak için farklı bir IP adresi talep edebilir.

`SetTrustedProxies`, Gin'e hangi ağ adreslerinin meşru proxy'ler olduğunu söyleyerek bunu çözer. `ClientIP()` `X-Forwarded-For` zincirini ayrıştırdığında, yalnızca bu proxy'ler tarafından eklenen girişlere güvenir ve bir istemcinin eklemiş olabileceği her şeyi atar. Bir istek doğrudan gelirse (güvenilir bir proxy'den değil), yönlendirme başlıkları tamamen yok sayılır ve ham uzak adres kullanılır.

`gin.Engine`'inizde `SetTrustedProxies()` fonksiyonunu kullanarak, istemci IP'siyle ilgili istek başlıklarının güvenilir olduğu ağ adreslerini veya ağ CIDR'lerini belirtin. IPv4 adresleri, IPv4 CIDR'leri, IPv6 adresleri veya IPv6 CIDR'leri olabilirler.

**Dikkat:** Yukarıdaki fonksiyonu kullanarak güvenilir bir proxy belirtmezseniz Gin varsayılan olarak tüm proxy'lere güvenir, bu **GÜVENLİ DEĞİLDİR**. Aynı zamanda, herhangi bir proxy kullanmıyorsanız, `Engine.SetTrustedProxies(nil)` kullanarak bu özelliği devre dışı bırakabilirsiniz, ardından `Context.ClientIP()` gereksiz hesaplamadan kaçınmak için doğrudan uzak adresi döndürecektir.

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // If the client is 192.168.1.2, use the X-Forwarded-For
    // header to deduce the original client IP from the trust-
    // worthy parts of that header.
    // Otherwise, simply return the direct client IP
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**Bilgi:** Bir CDN servisi kullanıyorsanız, TrustedProxies kontrolünü atlamak için `Engine.TrustedPlatform`'u ayarlayabilirsiniz, TrustedProxies'den daha yüksek önceliğe sahiptir.
Aşağıdaki örneğe bakın:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Use predefined header gin.PlatformXXX
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // Or, you can set your own trusted request header. But be sure your CDN
  // prevents users from passing this header! For example, if your CDN puts
  // the client IP in X-CDN-Client-IP:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // If you set TrustedPlatform, ClientIP() will resolve the
    // corresponding header and return IP directly
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

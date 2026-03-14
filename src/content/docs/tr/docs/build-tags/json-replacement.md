---
title: "JSON yerine alternatif ile derleme"
sidebar:
  order: 1
---

Gin, varsayılan olarak JSON serileştirme ve deserileştirme için standart kütüphane `encoding/json` paketini kullanır. Standart kütüphane kodlayıcısı iyi test edilmiş ve tamamen uyumludur, ancak mevcut en hızlı seçenek değildir. JSON performansı uygulamanızda bir darboğaz oluşturuyorsa -- örneğin, büyük yanıt yükleri serileştiren yüksek verimli API'lerde -- derleme etiketlerini kullanarak derleme zamanında daha hızlı bir yerine geçen alternatif kullanabilirsiniz. Kod değişikliği gerekmez.

## Kullanılabilir alternatifler

Gin, üç alternatif JSON kodlayıcısını destekler. Her biri Gin'in beklediği aynı arayüzü uygular, bu nedenle işleyicileriniz, ara katmanlarınız ve bağlama mantığınız herhangi bir değişiklik olmadan çalışmaya devam eder.

### go-json

[go-json](https://github.com/goccy/go-json), tam uyumluluk sağlarken `encoding/json` üzerinde önemli performans iyileştirmeleri sunan saf Go JSON kodlayıcısıdır. Tüm platformlarda ve mimarilerde çalışır.

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go) (json-iterator), `encoding/json` ile API uyumlu olan ve gelişmiş kullanım senaryoları için esnek bir yapılandırma sistemi sunan başka bir saf Go, yüksek performanslı JSON kütüphanesidir.

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic), ByteDance tarafından geliştirilen son derece hızlı bir JSON kodlayıcısıdır. Maksimum verim elde etmek için JIT derleme ve SIMD komutlarını kullanır, bu da onu üç seçenek arasında en hızlı yapar.

```sh
go build -tags="sonic avx" .
```

:::note
Sonic, AVX komut desteğine sahip bir CPU gerektirir. Bu, çoğu modern x86_64 işlemcide (Intel Sandy Bridge ve sonrası, AMD Bulldozer ve sonrası) mevcuttur, ancak ARM mimarilerinde veya eski x86 donanımında çalışmaz. Dağıtım hedefiniz AVX'i desteklemiyorsa, bunun yerine go-json veya jsoniter kullanın.
:::

## Alternatif seçme

| Kodlayıcı | Platform desteği | Temel güç |
|---|---|---|
| `encoding/json` (varsayılan) | Tümü | Maksimum uyumluluk, ek bağımlılık yok |
| go-json | Tümü | İyi hız artışı, saf Go, geniş uyumluluk |
| jsoniter | Tümü | İyi hız artışı, esnek yapılandırma |
| sonic | Yalnızca AVX'li x86_64 | JIT ve SIMD ile en yüksek verim |

Çoğu uygulama için **go-json** güvenli ve etkili bir seçimdir -- her yerde çalışır ve anlamlı performans kazanımları sağlar. Maksimum JSON verimi gerektiğinde ve sunucularınız x86_64 donanımında çalışıyorsa **sonic**'i seçin. Özel yapılandırma özelliklerine ihtiyacınız varsa veya kod tabanınızda zaten kullanıyorsanız **jsoniter**'ı seçin.

## Alternatifi doğrulama

Serileştirme performansını basit bir karşılaştırma ile veya ikili dosyanın sembol tablosunu kontrol ederek alternatifin aktif olduğunu doğrulayabilirsiniz:

```sh
# go-json ile derleme
go build -tags=go_json -o myapp .

# go-json sembollerinin mevcut olduğunu kontrol etme
go tool nm myapp | grep goccy
```

Derleme etiketi diğer Go komutlarıyla da çalışır:

```sh
go run -tags=go_json .
go test -tags=go_json ./...
```

:::note
Aynı anda yalnızca bir JSON alternatif etiketi kullanın. Birden fazla JSON etiketi belirtirseniz (örneğin, `-tags=go_json,jsoniter`), davranış tanımsızdır. `nomsgpack` etiketi herhangi bir JSON alternatif etiketiyle güvenle birleştirilebilir.
:::

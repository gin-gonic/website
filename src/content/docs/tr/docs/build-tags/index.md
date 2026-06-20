---
title: "Derleme Etiketleri"
sidebar:
  order: 11
---

Go [derleme etiketleri](https://pkg.go.dev/go/build#hdr-Build_Constraints) (derleme kısıtlamaları olarak da bilinir), Go derleyicisine derleme sırasında dosyaları dahil etmesini veya hariç tutmasını söyleyen yönergelerdir. Gin, derleme etiketlerini kullanarak herhangi bir uygulama kodunu değiştirmeden, derleme zamanında dahili uygulamaları değiştirmenize veya isteğe bağlı özellikleri devre dışı bırakmanıza olanak tanır.

Bu, çeşitli senaryolarda kullanışlıdır:

- **Performans optimizasyonu** -- Varsayılan `encoding/json` paketini daha hızlı bir üçüncü taraf kodlayıcıyla değiştirerek API'nizdeki JSON serileştirmesini hızlandırın.
- **İkili dosya boyutunu küçültme** -- MsgPack işleme gibi kullanmadığınız özellikleri çıkararak daha küçük bir derlenmiş ikili dosya üretin.
- **Dağıtım ayarlama** -- Farklı ortamlar için farklı kodlayıcılar seçin (örneğin, yüksek verimli bir üretim derlemesi ile standart bir geliştirme derlemesi).

Derleme etiketleri Go araç zincirine `-tags` bayrağı ile iletilir:

```sh
go build -tags=<etiket_adı> .
```

Birden fazla etiketi virgülle ayırarak birleştirebilirsiniz:

```sh
go build -tags=nomsgpack,go_json .
```

### Kullanılabilir derleme etiketleri

| Etiket | Etki |
|---|---|
| `go_json` | `encoding/json` yerine [go-json](https://github.com/goccy/go-json) kullanır |
| `jsoniter` | `encoding/json` yerine [jsoniter](https://github.com/json-iterator/go) kullanır |
| `sonic avx` | `encoding/json` yerine [sonic](https://github.com/bytedance/sonic) kullanır (AVX CPU komutları gerektirir) |
| `nomsgpack` | MsgPack işleme desteğini devre dışı bırakır |

:::note
Derleme etiketleri yalnızca Gin'in nasıl derleneceğini etkiler. Uygulama kodunuz (rota işleyicileri, ara katmanlar vb.) etiketleri değiştirdiğinizde değişmesine gerek yoktur.
:::

## Bu bölümde

Aşağıdaki sayfalar her derleme etiketini ayrıntılı olarak ele almaktadır:

- [**JSON yerine alternatif ile derleme**](./json-replacement/) -- Daha hızlı serileştirme için varsayılan JSON kodlayıcısını go-json, jsoniter veya sonic ile değiştirin.
- [**MsgPack olmadan derleme**](./nomsgpack/) -- İkili dosya boyutunu küçültmek için `nomsgpack` derleme etiketi ile MsgPack işlemeyi devre dışı bırakın.

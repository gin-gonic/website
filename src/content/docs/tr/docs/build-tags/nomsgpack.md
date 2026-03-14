---
title: "MsgPack olmadan derleme"
sidebar:
  order: 2
---

[MsgPack](https://msgpack.org/) (MessagePack), kompakt bir ikili serileştirme formatıdır -- JSON'un daha hızlı, daha küçük bir alternatifi olarak düşünebilirsiniz. Gin, varsayılan olarak MsgPack işleme ve bağlama desteği içerir, bu da uygulamanızın uygun içerik türüyle `c.Bind()` ve `c.Render()` kullanarak MsgPack kodlu verileri kutudan çıktığı gibi kabul edip döndürebileceği anlamına gelir.

Ancak birçok uygulama yalnızca JSON kullanır ve MsgPack'e hiç ihtiyaç duymaz. Bu durumda, MsgPack bağımlılığı derlenmiş ikili dosyanıza gereksiz ağırlık ekler. Bunu `nomsgpack` derleme etiketi ile çıkarabilirsiniz.

## MsgPack olmadan derleme

`go build`'e `nomsgpack` etiketini iletin:

```sh
go build -tags=nomsgpack .
```

Bu, diğer Go komutlarıyla da çalışır:

```sh
go run -tags=nomsgpack .
go test -tags=nomsgpack ./...
```

## Neler değişir

`nomsgpack` ile derleme yaptığınızda, Gin derleme zamanında MsgPack işleme ve bağlama kodunu hariç tutar. Bunun birkaç pratik etkisi vardır:

- MsgPack serileştirme kütüphanesi bağlanmadığı için derlenmiş ikili dosya daha küçük olur.
- MsgPack verisi işlemeye veya bağlamaya çalışan herhangi bir işleyici artık çalışmaz. `c.ProtoBuf()` veya MsgPack dışındaki diğer işleyicileri kullanıyorsanız, bunlar etkilenmez.
- Tüm JSON, XML, YAML, TOML ve ProtoBuf özellikleri normal şekilde çalışmaya devam eder.

:::note
API'niz MsgPack yanıtları sunmuyorsa ve kodunuzda hiçbir yerde `c.MsgPack()` çağırmıyorsanız, bu etiketi kullanmak güvenlidir. Mevcut JSON ve HTML işleyicileriniz aynı şekilde davranacaktır.
:::

## Sonucu doğrulama

Derlemeleri karşılaştırarak ikili dosya boyutundaki küçülmeyi doğrulayabilirsiniz:

```sh
# Standart derleme
go build -o gin-app .
ls -lh gin-app

# MsgPack olmadan derleme
go build -tags=nomsgpack -o gin-app-nomsgpack .
ls -lh gin-app-nomsgpack
```

Tam kazanç uygulamanıza bağlıdır, ancak MsgPack'i kaldırmak genellikle son ikili dosyadan küçük bir miktar düşürür. Daha fazla bilgi için [orijinal pull request](https://github.com/gin-gonic/gin/pull/1852)'e bakın.

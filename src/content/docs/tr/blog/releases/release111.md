---
title: "Gin 1.11.0 yayınlandı"
linkTitle: "Gin 1.11.0 yayınlandı"
lastUpdated: 2024-09-20
---

## Gin v1.11.0

### Özellikler

* feat(gin): quic-go/quic-go kullanılarak HTTP/3 için deneme desteği ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): form bağlamada dizi koleksiyonu formatı eklendi ([#3986](https://github.com/gin-gonic/gin/pull/3986)), form etiketi için özel string slice unmarshal eklendi ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): BindPlain eklendi ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): OnlyFilesFS dışa aktarıldı, test edildi ve belgeleri hazırlandı ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): unixMilli ve unixMicro desteği eklendi ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): form bağlamada koleksiyonlar için varsayılan değer desteği eklendi ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): GetXxx artık daha fazla Go yerel türünü destekliyor ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### Geliştirmeler

* perf(context): getMapFromFormData performansı optimize edildi ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): node.insertChild içinde string(/) yerine "/" kullanıldı ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): writeHeader’dan headers parametresi kaldırıldı ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): "GetType()" fonksiyonları sadeleştirildi ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): SliceValidationError Error metodu sadeleştirildi ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context): SaveUploadedFile’da filepath.Dir iki kez kullanılmaktan kaçınıldı ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): Context işleyişi yeniden düzenlendi ve test dayanıklılığı artırıldı ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): strings.Index yerine strings.Cut kullanıldı ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): SaveUploadedFile’a isteğe bağlı yetki parametresi eklendi ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): initQueryCache()’de URL’nin null olmadığı doğrulandı ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): Negotiate fonksiyonunda YAML değerlendirme mantığı ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: kendi tanımlı ‘min’ yerine resmi olan kullanıldı ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: filepath.Dir’in gereksiz kullanımları kaldırıldı ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### Hata Düzeltmeleri

* fix: HandleContext’te middleware’in tekrar giriş sorununu önle ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): decodeToml’da çift geçerli çözmeyi engelle ve doğrulama ekle ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): Boş ağaçta izin verilmeyen metodlar işlenirken panic oluşmasını engelle ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): gin modunda veri yarışı uyarısı ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): initQueryCache()’de URL’nin null olmadığını doğrula ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): Negotiate fonksiyonunda YAML değerlendirme mantığı ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): handler null olup olmadığını kontrol et ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): İngilizce dokümantasyona olan bozuk bağlantıyı düzelt ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): wildcard tipi başarısız olduğunda panic bilgisini tutarlı yap ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### Derleme süreç/CI güncellemeleri

* ci: CI akışına Trivy güvenlik taraması entegre edildi ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: CI/CD’de Go 1.25 desteği ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): github.com/bytedance/sonic v1.13.2’den v1.14.0’a güncellendi ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: GitHub Actions’a Go 1.24 sürümü eklendi ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: Gin’in minimum Go sürümü 1.21 olarak güncellendi ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): yeni linters etkinleştirildi (testifylint, usestdlibvars, perfsprint vb.) ([#4010](https://github.com/gin-gonic/gin/pull/4010), [#4091](https://github.com/gin-gonic/gin/pull/4091), [#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): iş akışları güncellendi ve test isteklerinde daha fazla tutarlılık sağlandı ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### Bağımlılık güncellemeleri

* chore(deps): google.golang.org/protobuf 1.36.6’dan 1.36.9’a yükseltildi ([#4346](https://github.com/gin-gonic/gin/pull/4346), [#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): github.com/stretchr/testify 1.10.0’dan 1.11.1’e yükseltildi ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): actions/setup-go 5’ten 6’ya yükseltildi ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): github.com/quic-go/quic-go 0.53.0’dan 0.54.0’a yükseltildi ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): golang.org/x/net 0.33.0’dan 0.38.0’a yükseltildi ([#4178](https://github.com/gin-gonic/gin/pull/4178), [#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): github.com/go-playground/validator/v10 10.20.0’dan 10.22.1’e yükseltildi ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### Belgelendirme güncellemeleri

* docs(changelog): Gin v1.10.1 için sürüm notları güncellendi ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: doc/doc.md dosyasında İngilizce dilbilgisi ve ifadeleri düzeltildi ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: Gin v1.10.0 için dokümantasyon ve sürüm notları güncellendi ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: Gin Quick Start'ta yazım hatası düzeltildi ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: yorum ve bağlantı sorunları düzeltildi ([#4205](https://github.com/gin-gonic/gin/pull/4205), [#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: rota grubu örnek kodu düzeltildi ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): Portekizce dokümantasyonu eklendi ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): bazı fonksiyon adları yorumlarda düzeltildi ([#4079](https://github.com/gin-gonic/gin/pull/4079))

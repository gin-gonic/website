---
title: "Gin 1.12.0 yayınlandı"
linkTitle: "Gin 1.12.0 yayınlandı"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### Özellikler

* feat(binding): uri/query binding'de encoding.UnmarshalText desteği ekle ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): hata alımı için GetError ve GetErrorSlice yöntemleri ekle ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): içerik müzakeresi için Protocol Buffers desteği ekle ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): Delete yöntemi uygula ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): kaçış yolu kullanma seçeneği ekle ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): renklendirilen gecikme ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): bson protokolü ekle ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### Hata Düzeltmeleri

* fix(binding): boş değer hatası ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): form binding'de boş dilim/dizi işlemesini iyileştir ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): birden çok X-Forwarded-For başlık değerleri için ClientIP işlemesini düzelt ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): sürüm uyuşmazlığı ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): kaynak sızıntısını önlemek için RunFd'de os.File'ı kapat ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): engine.Handler() ile çalışmayan harfsel iki nokta rotalarını düzelt ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): recovery'de http.ErrAbortHandler'ı bastır ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): Data.Render'de içerik uzunluğu yaz ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): yanıt yaşam döngüsü için ele geçirme davranışını iyileştir ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): RedirectFixedPath ile findCaseInsensitivePathRec'de paniği düzelt ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: Yazım hatalarını düzelt, belge netliğini iyileştir ve ölü kodu kaldır ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### İyileştirmeler

* chore(binding): bson bağımlılığını mongo-driver v2'ye yükselt ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): unix soketinden gelen xff başlıklarına her zaman güven ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): golang.org/x/crypto'yu v0.45.0'a yükselt ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): quic-go'yu v0.57.1'e yükselt ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): sorgu dizesi çıkışını atlamaya izin ver ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): `http.Flusher` olduğunda Flush() panikini önle ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### Yeniden Düzenleme

* refactor(binding): daha temiz harita işlemesi için maps.Copy kullan ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): dönüş değeri adlarını atla ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): sabit kodlanmış localhost IP adreslerini sabitlerle değiştir ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): maps.Clone kullanıyor ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): motor işlevini basitleştirmek için sync.OnceValue kullan ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): akıllı hata karşılaştırması ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): util işlevlerini utils.go'ya taşı ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: for döngüsü int üzerinde range kullanılarak modernize edilebilir ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: bodyAllowedForStatus'ta sihirli sayıları adlandırılmış sabitlerle değiştir ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: kodu basitleştirmek ve performansı artırmak için b.Loop() kullan ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### Derleme Süreci Güncellemeleri / CI

* ci(bot): bağımlılık güncellemelerinin sıklığını artır ve gruplandır ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): test iddiaları ve linter yapılandırmasını yeniden düzenle ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): HTTP ara yazılımda tür güvenliğini ve sunucu organizasyonunu iyileştir ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): Trivy güvenlik taramalarını her gün UTC gece yarısında çalışacak şekilde zamanla ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: güvenlik açığı tarama iş akışını Trivy entegrasyonu ile değiştir ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: CI iş akışlarını güncelle ve Trivy yapılandırma tırnaklarını standartlaştır ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: CI ve belgeler genelinde Go sürüm desteğini 1.25+'a güncelle ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### Belge Güncellemeleri

* docs(README): Trivy güvenlik tarama rozeti ekle ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): ShouldBind\* yöntemleri için örnek yorumlar ekle ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): bazı yorumları düzelt ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): yorumda hatalı işlev adını düzelt ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): belgeleri açıklık ve eksiksizlik için yeniden tasarla ve genişlet ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: Gin 1.11.0 sürümünü blog bağlantısı ile duyur ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: Gin v1.12.0 sürümünü belge ve sonuçlandır ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: GitHub katkı ve destek şablonlarını yeniden tasarla ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: katkı kılavuzlarını kapsamlı talimatlarla yeniden tasarla ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: Go sürüm değişikliklerini yansıtacak şekilde belgeleri güncelle ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: bozuk belge bağlantısı için özellik belgeleme talimatlarını güncelle ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### Performans

* perf(path): redirectTrailingSlash'ta regex'i özel işlevlerle değiştir ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): yığın işlevinde satır okumayı optimize et ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): strings.Count kullanarak yol ayrıştırmasını optimize et ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): findCaseInsensitivePath'de ayırmaları azalt ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### Testler

* test(benchmarks): hatalı işlev adını düzelt ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): boş/nil durumları için test ekle ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): sihirli sayı 100 yerine http.StatusContinue sabitini kullan ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): debug.go test kapsamını %100'e iyileştir ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): ginS paketi için kapsamlı test kapsamı ekle ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): entegrasyon testlerinde yarış koşullarını çöz ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): kapsamlı hata işleme testleri ekle ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): MsgPack oluşturma için kapsamlı testler ekle ([#4537](https://github.com/gin-gonic/gin/pull/4537))

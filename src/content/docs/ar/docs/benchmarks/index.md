---
title: "اختبارات الأداء"
sidebar:
  order: 12
---

> **بيانات محدّثة:** تم جمع اختبارات الأداء هذه في مارس 2026 باستخدام Gin v1.12.0 و Go 1.25.8. للحصول على نتائج اختبارات أداء محدّثة، راجع مستودع [go-http-routing-benchmark](https://github.com/gin-gonic/go-http-routing-benchmark).

## اختبارات أداء إطار عمل Gin للويب

تساعد اختبارات الأداء المطورين على تقييم كفاءة واستهلاك الموارد لمكتبات توجيه HTTP في Go. تلخّص هذه الصفحة القياسات عبر العديد من أطر العمل الشائعة، حتى تتمكن من مقارنة سرعتها واستهلاكها للذاكرة بسهولة.

**بيئة الاختبار:**

- **منصة الاستضافة:** Apple M4 Pro
- **مواصفات الجهاز:** macOS (Darwin 25.3.0), arm64
- **تاريخ الاختبار:** 15 مارس 2026
- **إصدار Gin:** v1.12.0
- **إصدار Go:** 1.25.8 (darwin/arm64)
- **مصدر اختبارات الأداء:** [Go HTTP Router Benchmark](https://github.com/gin-gonic/go-http-routing-benchmark)

يستخدم Gin نسخة محسّنة من [HttpRouter](https://github.com/julienschmidt/httprouter) للتوجيه عالي الأداء.

إذا أردت عرض المزيد من حالات الاختبار، يمكنك الاطلاع على [جميع اختبارات الأداء هنا](https://github.com/gin-gonic/gin/blob/master/BENCHMARKS.md).

---

## كيفية قراءة الجدول

تعرض اختبارات الأداء أدناه أطر عمل Go المختلفة وهي تنفذ مهام توجيه HTTP شائعة.
**الأرقام الأقل (الوقت، الذاكرة، التخصيصات) أفضل.**
يمكنك استخدام هذه النتائج لمقارنة مباشرة بين Gin والموجهات البديلة.

| الاختبار                              | التكرارات | الوقت (ns/op) | البايتات (B/op) | التخصيصات (allocs/op) |
| ---------------------------------- | ----------- | ------------ | ------------ | ----------------------- |
| BenchmarkGin_GithubStatic         | 43895277    | 28.10        | 0            | 0                       |
| BenchmarkAce_GithubStatic         | 42779731    | 28.31        | 0            | 0                       |
| BenchmarkAero_GithubStatic        | 83284414    | 14.50        | 0            | 0                       |
| BenchmarkBear_GithubStatic        | 9311720     | 131.2        | 120          | 3                       |
| BenchmarkBeego_GithubStatic       | 2897301     | 395.7        | 352          | 3                       |
| BenchmarkBone_GithubStatic        | 308800      | 3903         | 2880         | 60                      |
| BenchmarkChi_GithubStatic         | 5401872     | 229.6        | 368          | 2                       |
| BenchmarkDenco_GithubStatic       | 98722773    | 11.71        | 0            | 0                       |
| BenchmarkEcho_GithubStatic        | 40625690    | 27.23        | 0            | 0                       |
| BenchmarkGocraftWeb_GithubStatic  | 5341020     | 229.8        | 288          | 5                       |
| BenchmarkGoji_GithubStatic        | 15548287    | 76.12        | 0            | 0                       |
| BenchmarkGojiv2_GithubStatic      | 2520218     | 490.3        | 1120         | 7                       |
| BenchmarkGoRestful_GithubStatic   | 330211      | 3671         | 4792         | 14                      |
| BenchmarkGoJsonRest_GithubStatic  | 3861292     | 321.3        | 297          | 11                      |
| BenchmarkGorillaMux_GithubStatic  | 938425      | 1474         | 848          | 7                       |
| BenchmarkGowwwRouter_GithubStatic | 38324576    | 32.24        | 0            | 0                       |
| BenchmarkHttpRouter_GithubStatic  | 69731800    | 17.26        | 0            | 0                       |
| BenchmarkHttpTreeMux_GithubStatic | 55391751    | 22.97        | 0            | 0                       |
| BenchmarkKocha_GithubStatic       | 52384971    | 24.34        | 0            | 0                       |
| BenchmarkLARS_GithubStatic        | 45034478    | 25.48        | 0            | 0                       |
| BenchmarkMacaron_GithubStatic     | 2014342     | 578.0        | 728          | 8                       |
| BenchmarkMartini_GithubStatic     | 554347      | 2686         | 792          | 11                      |
| BenchmarkPat_GithubStatic         | 288867      | 4049         | 3648         | 76                      |
| BenchmarkPossum_GithubStatic      | 3928141     | 306.4        | 416          | 3                       |
| BenchmarkR2router_GithubStatic    | 11773146    | 97.06        | 112          | 3                       |
| BenchmarkRivet_GithubStatic       | 37206849    | 32.03        | 0            | 0                       |
| BenchmarkTango_GithubStatic       | 3806214     | 321.1        | 192          | 6                       |
| BenchmarkTigerTonic_GithubStatic  | 15421950    | 82.96        | 48           | 1                       |
| BenchmarkTraffic_GithubStatic     | 307382      | 3618         | 4632         | 89                      |
| BenchmarkVulcan_GithubStatic      | 6107649     | 198.2        | 98           | 3                       |
| BenchmarkAce_GithubParam          | 12033406    | 102.1        | 96           | 1                       |
| BenchmarkAero_GithubParam         | 34218457    | 35.12        | 0            | 0                       |
| BenchmarkBear_GithubParam         | 3491167     | 340.3        | 496          | 5                       |
| BenchmarkBeego_GithubParam        | 2462625     | 492.9        | 352          | 3                       |
| BenchmarkBone_GithubParam         | 479170      | 2435         | 1824         | 18                      |
| BenchmarkChi_GithubParam          | 2392147     | 439.7        | 704          | 4                       |
| BenchmarkDenco_GithubParam        | 10566573    | 108.5        | 128          | 1                       |
| BenchmarkEcho_GithubParam         | 22438311    | 53.46        | 0            | 0                       |
| BenchmarkGin_GithubParam          | 25399108    | 50.29        | 0            | 0                       |
| BenchmarkGocraftWeb_GithubParam   | 2686350     | 425.8        | 656          | 7                       |
| BenchmarkGoji_GithubParam         | 3468987     | 331.6        | 336          | 2                       |
| BenchmarkGojiv2_GithubParam       | 1713819     | 693.3        | 1216         | 10                      |
| BenchmarkGoJsonRest_GithubParam   | 2105818     | 561.9        | 681          | 14                      |
| BenchmarkGoRestful_GithubParam    | 268806      | 4732         | 4696         | 15                      |
| BenchmarkGorillaMux_GithubParam   | 484622      | 2436         | 1168         | 8                       |
| BenchmarkGowwwRouter_GithubParam  | 6445003     | 195.4        | 368          | 2                       |
| BenchmarkHttpRouter_GithubParam   | 14665429    | 88.59        | 96           | 1                       |
| BenchmarkHttpTreeMux_GithubParam  | 4199426     | 311.2        | 384          | 4                       |
| BenchmarkKocha_GithubParam        | 8478230     | 139.3        | 112          | 3                       |
| BenchmarkLARS_GithubParam         | 27976429    | 43.36        | 0            | 0                       |
| BenchmarkMacaron_GithubParam      | 1475805     | 805.7        | 1064         | 10                      |
| BenchmarkMartini_GithubParam      | 354076      | 3459         | 1176         | 13                      |
| BenchmarkPat_GithubParam          | 422454      | 2919         | 2360         | 45                      |
| BenchmarkPossum_GithubParam       | 3345200     | 349.5        | 496          | 5                       |
| BenchmarkR2router_GithubParam     | 5887364     | 205.1        | 400          | 4                       |
| BenchmarkRivet_GithubParam        | 9056540     | 118.9        | 96           | 1                       |
| BenchmarkTango_GithubParam        | 3217730     | 376.9        | 296          | 6                       |
| BenchmarkTigerTonic_GithubParam   | 1000000     | 1043         | 1072         | 21                      |
| BenchmarkTraffic_GithubParam      | 375636      | 3171         | 2840         | 43                      |
| BenchmarkVulcan_GithubParam       | 3770610     | 321.0        | 98           | 3                       |
| BenchmarkAce_GithubAll            | 61230       | 21354        | 13792        | 167                     |
| BenchmarkAero_GithubAll           | 176716      | 6646         | 0            | 0                       |
| BenchmarkBear_GithubAll           | 16941       | 69598        | 86448        | 943                     |
| BenchmarkBeego_GithubAll          | 12163       | 97593        | 71456        | 609                     |
| BenchmarkBone_GithubAll           | 1176        | 1040342      | 709472       | 8453                    |
| BenchmarkChi_GithubAll            | 12346       | 98943        | 130816       | 740                     |
| BenchmarkDenco_GithubAll          | 59050       | 22401        | 20224        | 167                     |
| BenchmarkEcho_GithubAll           | 104632      | 12030        | 0            | 0                       |
| BenchmarkGin_GithubAll            | 135811      | 9058         | 0            | 0                       |
| BenchmarkGocraftWeb_GithubAll     | 13927       | 85845        | 123552       | 1400                    |
| BenchmarkGoji_GithubAll           | 8512        | 158755       | 56112        | 334                     |
| BenchmarkGojiv2_GithubAll         | 5108        | 226986       | 313744       | 3712                    |
| BenchmarkGoJsonRest_GithubAll     | 9859        | 120437       | 127875       | 2737                    |
| BenchmarkGoRestful_GithubAll      | 1359        | 863892       | 1006744      | 3009                    |
| BenchmarkGorillaMux_GithubAll     | 974         | 1282012      | 225666       | 1588                    |
| BenchmarkGowwwRouter_GithubAll    | 32976       | 35511        | 61456        | 334                     |
| BenchmarkHttpRouter_GithubAll     | 89264       | 13840        | 13792        | 167                     |
| BenchmarkHttpTreeMux_GithubAll    | 25005       | 49430        | 65856        | 671                     |
| BenchmarkKocha_GithubAll          | 38254       | 33213        | 20592        | 504                     |
| BenchmarkLARS_GithubAll           | 144225      | 8714         | 0            | 0                       |
| BenchmarkMacaron_GithubAll        | 8706        | 131574       | 147784       | 1624                    |
| BenchmarkMartini_GithubAll        | 825         | 1483537      | 231418       | 2731                    |
| BenchmarkPat_GithubAll            | 838         | 1432291      | 1421792      | 23019                   |
| BenchmarkPossum_GithubAll         | 18913       | 62291        | 84448        | 609                     |
| BenchmarkR2router_GithubAll       | 26276       | 45938        | 70832        | 776                     |
| BenchmarkRivet_GithubAll          | 49792       | 23337        | 16272        | 167                     |
| BenchmarkTango_GithubAll          | 14306       | 84094        | 53850        | 1215                    |
| BenchmarkTigerTonic_GithubAll     | 5797        | 209921       | 188584       | 4300                    |
| BenchmarkTraffic_GithubAll        | 1044        | 1213864      | 829175       | 14582                   |
| BenchmarkVulcan_GithubAll         | 19022       | 60788        | 19894        | 609                     |

---

## ملاحظات جدول اختبارات الأداء

- **التكرارات**: إجمالي التكرارات المحققة في وقت ثابت. الأرقام الأعلى تعني ثقة أكبر في النتائج.
- **الوقت (ns/op)**: مدة عملية واحدة بالنانو ثانية. الأقل أفضل.
- **البايتات (B/op)**: ذاكرة الكومة المخصصة لكل عملية. الأقل يعني كفاءة أفضل.
- **التخصيصات (allocs/op)**: متوسط عدد تخصيصات الذاكرة لكل عملية. تخصيصات أقل أفضل للأداء وجمع القمامة.

للأسئلة أو المساهمات، تحقق من [مستودع GitHub](https://github.com/gin-gonic/gin).

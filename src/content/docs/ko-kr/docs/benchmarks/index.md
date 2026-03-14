---
title: "벤치마크"
sidebar:
  order: 12
---

> **과거 데이터:** 이 벤치마크는 2020년 5월에 Gin v1.6.3과 Go 1.14.2를 사용하여 수집되었습니다. 프레임워크 성능은 그 이후 크게 변경되었을 수 있습니다. 최신 벤치마크 결과는 [go-http-routing-benchmark](https://github.com/gin-gonic/go-http-routing-benchmark) 저장소를 참조하세요.

## Gin 웹 프레임워크 성능 벤치마크

벤치마크는 개발자가 Go의 HTTP 라우터 라이브러리의 효율성과 리소스 사용량을 평가하는 데 도움이 됩니다. 이 페이지는 많은 인기 프레임워크의 측정치를 요약하여 속도와 메모리 소비를 쉽게 비교할 수 있도록 합니다.

**테스트 환경:**

- **호스트 플랫폼:** Travis CI (가상 Linux VM)
- **머신 사양:** Ubuntu 16.04.6 LTS x64
- **테스트 날짜:** 2020년 5월 4일
- **Gin 버전:** v1.6.3
- **Go 버전:** 1.14.2 (linux/amd64)
- **벤치마크 소스:** [Go HTTP Router Benchmark](https://github.com/gin-gonic/go-http-routing-benchmark)
- **상세 결과:** [gist 보기](https://gist.github.com/appleboy/b5f2ecfaf50824ae9c64dcfb9165ae5e) 또는 [Travis 결과](https://travis-ci.org/github/gin-gonic/go-http-routing-benchmark/jobs/682947061)

Gin은 고성능 라우팅을 위해 [HttpRouter](https://github.com/julienschmidt/httprouter)의 최적화된 포크를 사용합니다.

더 많은 테스트 케이스를 보려면 [여기에서 모든 벤치마크를 확인하세요](https://github.com/gin-gonic/gin/blob/master/BENCHMARKS.md).

---

## 테이블 읽는 방법

아래 벤치마크는 다양한 Go 프레임워크가 일반적인 HTTP 라우팅 작업을 실행하는 것을 보여줍니다.
**낮은 숫자(시간, 메모리, 할당)가 더 좋습니다.**
이 결과를 사용하여 Gin과 대안 라우터를 직접적으로 나란히 비교할 수 있습니다.

| 테스트                              | 반복 횟수 | 시간 (ns/op) | 바이트 (B/op) | 할당 (allocs/op) |
| ---------------------------------- | ----------- | ------------ | ------------ | ----------------------- |
| BenchmarkGin_GithubStatic         | 15629472    | 76.7         | 0            | 0                       |
| BenchmarkAce_GithubStatic         | 15542612    | 75.9         | 0            | 0                       |
| BenchmarkAero_GithubStatic        | 24777151    | 48.5         | 0            | 0                       |
| BenchmarkBear_GithubStatic        | 2788894     | 435          | 120          | 3                       |
| BenchmarkBeego_GithubStatic       | 1000000     | 1064         | 352          | 3                       |
| BenchmarkBone_GithubStatic        | 93507       | 12838        | 2880         | 60                      |
| BenchmarkChi_GithubStatic         | 1387743     | 860          | 432          | 3                       |
| BenchmarkDenco_GithubStatic       | 39384996    | 30.4         | 0            | 0                       |
| BenchmarkEcho_GithubStatic        | 12076382    | 99.1         | 0            | 0                       |
| BenchmarkGocraftWeb_GithubStatic  | 1596495     | 756          | 296          | 5                       |
| BenchmarkGoji_GithubStatic        | 6364876     | 189          | 0            | 0                       |
| BenchmarkGojiv2_GithubStatic      | 550202      | 2098         | 1312         | 10                      |
| BenchmarkGoRestful_GithubStatic   | 102183      | 12552        | 4256         | 13                      |
| BenchmarkGoJsonRest_GithubStatic  | 1000000     | 1029         | 329          | 11                      |
| BenchmarkGorillaMux_GithubStatic  | 255552      | 5190         | 976          | 9                       |
| BenchmarkGowwwRouter_GithubStatic | 15531916    | 77.1         | 0            | 0                       |
| BenchmarkHttpRouter_GithubStatic  | 27920724    | 43.1         | 0            | 0                       |
| BenchmarkHttpTreeMux_GithubStatic | 21448953    | 55.8         | 0            | 0                       |
| BenchmarkKocha_GithubStatic       | 21405310    | 56.0         | 0            | 0                       |
| BenchmarkLARS_GithubStatic        | 13625156    | 89.0         | 0            | 0                       |
| BenchmarkMacaron_GithubStatic     | 1000000     | 1747         | 736          | 8                       |
| BenchmarkMartini_GithubStatic     | 187186      | 7326         | 768          | 9                       |
| BenchmarkPat_GithubStatic         | 109143      | 11563        | 3648         | 76                      |
| BenchmarkPossum_GithubStatic      | 1575898     | 770          | 416          | 3                       |
| BenchmarkR2router_GithubStatic    | 3046231     | 404          | 144          | 4                       |
| BenchmarkRivet_GithubStatic       | 11484826    | 105          | 0            | 0                       |
| BenchmarkTango_GithubStatic       | 1000000     | 1153         | 248          | 8                       |
| BenchmarkTigerTonic_GithubStatic  | 4929780     | 249          | 48           | 1                       |
| BenchmarkTraffic_GithubStatic     | 106351      | 11819        | 4664         | 90                      |
| BenchmarkVulcan_GithubStatic      | 1613271     | 722          | 98           | 3                       |
| BenchmarkAce_GithubParam          | 8386032     | 143          | 0            | 0                       |
| BenchmarkAero_GithubParam         | 11816200    | 102          | 0            | 0                       |
| BenchmarkBear_GithubParam         | 1000000     | 1012         | 496          | 5                       |
| BenchmarkBeego_GithubParam        | 1000000     | 1157         | 352          | 3                       |
| BenchmarkBone_GithubParam         | 184653      | 6912         | 1888         | 19                      |
| BenchmarkChi_GithubParam          | 1000000     | 1102         | 432          | 3                       |
| BenchmarkDenco_GithubParam        | 3484798     | 352          | 128          | 1                       |
| BenchmarkEcho_GithubParam         | 6337380     | 189          | 0            | 0                       |
| BenchmarkGin_GithubParam          | 9132032     | 131          | 0            | 0                       |
| BenchmarkGocraftWeb_GithubParam   | 1000000     | 1446         | 712          | 9                       |
| BenchmarkGoji_GithubParam         | 1248640     | 977          | 336          | 2                       |
| BenchmarkGojiv2_GithubParam       | 383233      | 2784         | 1408         | 13                      |
| BenchmarkGoJsonRest_GithubParam   | 1000000     | 1991         | 713          | 14                      |
| BenchmarkGoRestful_GithubParam    | 76414       | 16015        | 4352         | 16                      |
| BenchmarkGorillaMux_GithubParam   | 150026      | 7663         | 1296         | 10                      |
| BenchmarkGowwwRouter_GithubParam  | 1592044     | 751          | 432          | 3                       |
| BenchmarkHttpRouter_GithubParam   | 10420628    | 115          | 0            | 0                       |
| BenchmarkHttpTreeMux_GithubParam  | 1403755     | 835          | 384          | 4                       |
| BenchmarkKocha_GithubParam        | 2286170     | 533          | 128          | 5                       |
| BenchmarkLARS_GithubParam         | 9540374     | 129          | 0            | 0                       |
| BenchmarkMacaron_GithubParam      | 533154      | 2742         | 1072         | 10                      |
| BenchmarkMartini_GithubParam      | 119397      | 9638         | 1152         | 11                      |
| BenchmarkPat_GithubParam          | 150675      | 8858         | 2408         | 48                      |
| BenchmarkPossum_GithubParam       | 1000000     | 1001         | 496          | 5                       |
| BenchmarkR2router_GithubParam     | 1602886     | 761          | 432          | 5                       |
| BenchmarkRivet_GithubParam        | 2986579     | 409          | 96           | 1                       |
| BenchmarkTango_GithubParam        | 1000000     | 1356         | 344          | 8                       |
| BenchmarkTigerTonic_GithubParam   | 388899      | 3429         | 1176         | 22                      |
| BenchmarkTraffic_GithubParam      | 123160      | 9734         | 2816         | 40                      |
| BenchmarkVulcan_GithubParam       | 1000000     | 1138         | 98           | 3                       |
| BenchmarkAce_GithubAll            | 40543       | 29670        | 0            | 0                       |
| BenchmarkAero_GithubAll           | 57632       | 20648        | 0            | 0                       |
| BenchmarkBear_GithubAll           | 9234        | 216179       | 86448        | 943                     |
| BenchmarkBeego_GithubAll          | 7407        | 243496       | 71456        | 609                     |
| BenchmarkBone_GithubAll           | 420         | 2922835      | 720160       | 8620                    |
| BenchmarkChi_GithubAll            | 7620        | 238331       | 87696        | 609                     |
| BenchmarkDenco_GithubAll          | 18355       | 64494        | 20224        | 167                     |
| BenchmarkEcho_GithubAll           | 31251       | 38479        | 0            | 0                       |
| BenchmarkGin_GithubAll            | 43550       | 27364        | 0            | 0                       |
| BenchmarkGocraftWeb_GithubAll     | 4117        | 300062       | 131656       | 1686                    |
| BenchmarkGoji_GithubAll           | 3274        | 416158       | 56112        | 334                     |
| BenchmarkGojiv2_GithubAll         | 1402        | 870518       | 352720       | 4321                    |
| BenchmarkGoJsonRest_GithubAll     | 2976        | 401507       | 134371       | 2737                    |
| BenchmarkGoRestful_GithubAll      | 410         | 2913158      | 910144       | 2938                    |
| BenchmarkGorillaMux_GithubAll     | 346         | 3384987      | 251650       | 1994                    |
| BenchmarkGowwwRouter_GithubAll    | 10000       | 143025       | 72144        | 501                     |
| BenchmarkHttpRouter_GithubAll     | 55938       | 21360        | 0            | 0                       |
| BenchmarkHttpTreeMux_GithubAll    | 10000       | 153944       | 65856        | 671                     |
| BenchmarkKocha_GithubAll          | 10000       | 106315       | 23304        | 843                     |
| BenchmarkLARS_GithubAll           | 47779       | 25084        | 0            | 0                       |
| BenchmarkMacaron_GithubAll        | 3266        | 371907       | 149409       | 1624                    |
| BenchmarkMartini_GithubAll        | 331         | 3444706      | 226551       | 2325                    |
| BenchmarkPat_GithubAll            | 273         | 4381818      | 1483152      | 26963                   |
| BenchmarkPossum_GithubAll         | 10000       | 164367       | 84448        | 609                     |
| BenchmarkR2router_GithubAll       | 10000       | 160220       | 77328        | 979                     |
| BenchmarkRivet_GithubAll          | 14625       | 82453        | 16272        | 167                     |
| BenchmarkTango_GithubAll          | 6255        | 279611       | 63826        | 1618                    |
| BenchmarkTigerTonic_GithubAll     | 2008        | 687874       | 193856       | 4474                    |
| BenchmarkTraffic_GithubAll        | 355         | 3478508      | 820744       | 14114                   |
| BenchmarkVulcan_GithubAll         | 6885        | 193333       | 19894        | 609                     |

---

## 벤치마크 테이블 참고 사항

- **반복 횟수**: 일정 시간 내에 달성된 총 반복 횟수. 숫자가 높을수록 결과에 대한 신뢰도가 높습니다.
- **시간 (ns/op)**: 한 연산의 소요 시간으로 나노초 단위로 측정됩니다. 낮을수록 좋습니다.
- **바이트 (B/op)**: 연산당 힙 메모리 할당량. 낮을수록 효율성이 좋습니다.
- **할당 (allocs/op)**: 연산당 평균 메모리 할당 횟수. 할당이 적을수록 성능과 가비지 컬렉션에 유리합니다.

질문이나 기여 사항은 [GitHub 저장소](https://github.com/gin-gonic/gin)를 확인하세요.

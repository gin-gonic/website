---
title: "Benchmarks"
weight: 3
---

**VM HOST:** Travis
**Machine:** Ubuntu 16.04.6 LTS x64
**Date:** May 04th, 2020
**Version:** Gin v1.6.3
**Go Version:** 1.14.2 linux/amd64
**Source:** [Go HTTP Router Benchmark](https://github.com/gin-gonic/go-http-routing-benchmark)
**Result:** [See the gist](https://gist.github.com/appleboy/b5f2ecfaf50824ae9c64dcfb9165ae5e) or [Travis result](https://travis-ci.org/github/gin-gonic/go-http-routing-benchmark/jobs/682947061)

Gin uses a custom version of [HttpRouter](https://github.com/julienschmidt/httprouter)

[See all benchmarks](https://github.com/gin-gonic/gin/blob/master/BENCHMARKS.md)

| Test                              | Repetitions | Time (ns/op) | Bytes (B/op) | Allocations (allocs/op) |
| --------------------------------- | ----------- | ------------ | ------------ | ----------------------- |
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

Notes:

- Repetitions: Total repetitions achieved in constant time, higher means more confident result
- Time: Single repetition duration (ns/op), lower is better
- Bytes: Heap memory (B/op), lower is better
- Allocations: Average allocations per repetition (allocs/op), lower is better

---
title: "벤치마크"
draft: false
weight: 3
---

Gin은 [HttpRouter](https://github.com/julienschmidt/httprouter)을 커스텀 한 버전을 사용합니다.

[모든 벤치마크 보기](https://github.com/gin-gonic/gin/blob/master/BENCHMARKS.md)

벤치마크 이름                    | (1)        | (2)         | (3) 		    | (4)
------------------------------|-----------:|------------:|-----------:|---------:
**BenchmarkGin_GithubAll**    | **30000**  |  **48375**  |     **0**  |   **0**
BenchmarkAce_GithubAll        |   10000    |   134059    |   13792    |   167
BenchmarkBear_GithubAll       |    5000    |   534445    |   86448    |   943
BenchmarkBeego_GithubAll      |    3000    |   592444    |   74705    |   812
BenchmarkBone_GithubAll       |     200    |  6957308    |  698784    |  8453
BenchmarkDenco_GithubAll      |   10000    |   158819    |   20224    |   167
BenchmarkEcho_GithubAll       |   10000    |   154700    |    6496    |   203
BenchmarkGocraftWeb_GithubAll |    3000    |   570806    |  131656    |  1686
BenchmarkGoji_GithubAll       |    2000    |   818034    |   56112    |   334
BenchmarkGojiv2_GithubAll     |    2000    |  1213973    |  274768    |  3712
BenchmarkGoJsonRest_GithubAll |    2000    |   785796    |  134371    |  2737
BenchmarkGoRestful_GithubAll  |     300    |  5238188    |  689672    |  4519
BenchmarkGorillaMux_GithubAll |     100    | 10257726    |  211840    |  2272
BenchmarkHttpRouter_GithubAll |   20000    |   105414    |   13792    |   167
BenchmarkHttpTreeMux_GithubAll|   10000    |   319934    |   65856    |   671
BenchmarkKocha_GithubAll      |   10000    |   209442    |   23304    |   843
BenchmarkLARS_GithubAll       |   20000    |    62565    |       0    |     0
BenchmarkMacaron_GithubAll    |    2000    |  1161270    |  204194    |  2000
BenchmarkMartini_GithubAll    |     200    |  9991713    |  226549    |  2325
BenchmarkPat_GithubAll        |     200    |  5590793    | 1499568    | 27435
BenchmarkPossum_GithubAll     |   10000    |   319768    |   84448    |   609
BenchmarkR2router_GithubAll   |   10000    |   305134    |   77328    |   979
BenchmarkRivet_GithubAll      |   10000    |   132134    |   16272    |   167
BenchmarkTango_GithubAll      |    3000    |   552754    |   63826    |  1618
BenchmarkTigerTonic_GithubAll |    1000    |  1439483    |  239104    |  5374
BenchmarkTraffic_GithubAll    |     100    | 11383067    | 2659329    | 21848
BenchmarkVulcan_GithubAll     |    5000    |   394253    |   19894    |   609

- (1): 일정한 시간 내에 실행된 총횟수, 높을수록 더 좋은 결과를 뜻합니다.
- (2): 1회 실행에 걸린 시간 (ns/op), 낮을수록 좋습니다.
- (3): 힙 메모리 (B/op), 낮을수록 좋습니다.
- (4): 1회 실행에 할당된 메모리 평균량 (allocs/op), 낮을수록 좋습니다.

---
title: "벤치마크"
sidebar:
  order: 12
---

> **업데이트된 데이터:** 이 벤치마크는 2026년 3월에 Gin v1.12.0과 Go 1.25.8을 사용하여 수집되었습니다. 최신 벤치마크 결과는 [go-http-routing-benchmark](https://github.com/gin-gonic/go-http-routing-benchmark) 저장소를 참조하세요.

## Gin 벤치마크 보고서

**테스트 환경:**

- **호스트 플랫폼:** Apple M4 Pro
- **머신 스펙:** macOS (Darwin 25.3.0), arm64
- **테스트 날짜:** 2026년 3월 15일
- **Gin 버전:** v1.12.0
- **Go 버전:** 1.25.8 (darwin/arm64)
- **벤치마크 소스:** [Go HTTP Router Benchmark](https://github.com/gin-gonic/go-http-routing-benchmark)

---

## 요약

아래 표는 모든 라우터를 **GitHub API 처리량** (203개 라우트, 모든 메서드) 기준으로 순위를 매긴 것으로, 실제 라우팅 워크로드를 가장 잘 대표합니다. _ns/op가 낮을수록 좋습니다._

| Rank | Router | ns/op | B/op | allocs/op | Zero-alloc |
| :--: | :--- | ---: | ---: | ---: | :---: |
| 1 | **Gin** | 9,944 | 0 | 0 | ✓ |
| 2 | **BunRouter** | 10,281 | 0 | 0 | ✓ |
| 3 | **Echo** | 11,072 | 0 | 0 | ✓ |
| 4 | HttpRouter | 15,059 | 13,792 | 167 | |
| 5 | HttpTreeMux | 49,302 | 65,856 | 671 | |
| 6 | Chi | 94,376 | 130,817 | 740 | |
| 7 | Beego | 101,941 | 71,456 | 609 | |
| 8 | Fiber | 109,148 | 0 | 0 | ✓ |
| 9 | Macaron | 121,785 | 147,784 | 1,624 | |
| 10 | Goji v2 | 242,849 | 313,744 | 3,712 | |
| 11 | GoRestful | 885,678 | 1,006,744 | 3,009 | |
| 12 | GorillaMux | 1,316,844 | 225,667 | 1,588 | |

**주요 시사점:**

- Gin, BunRouter, Echo는 최상위 그룹을 형성하며, 모두 힙 할당이 0이고 전체 GitHub API를 약 10마이크로초 만에 라우팅합니다.
- **HttpRouter**는 매우 빠르지만 매개변수화된 라우트당 1회 할당이 발생합니다 (203개 라우트에서 167회 할당).
- Fiber도 할당 0을 달성하지만, fasthttp 기반 벤치마크 인프라가 반복당 리셋 오버헤드를 추가하므로 net/http 라우터와의 직접 비교는 주의가 필요합니다.
- **GorillaMux**와 **GoRestful**은 기능이 풍부하지만 수 배 느려서 지연 시간에 민감한 애플리케이션에는 적합하지 않습니다.

> **Fiber 주의사항:** Fiber 벤치마크는 반복마다 Reset을 수행하는 `fasthttp.RequestCtx`를 사용하며, 이는 net/http 벤치마크에는 없는 일정한 오버헤드를 추가합니다. Fiber 간 비교는 유효하지만, 프레임워크 간 비교는 신중하게 해석해야 합니다.

---

## 메모리 소비

라우팅 구조를 로드하는 데 필요한 메모리입니다 (낮을수록 좋습니다). 바이트 오름차순으로 정렬되어 있습니다.

### 정적 라우트: 157개

| Router | Bytes |
| :--- | ---: |
| **HttpRouter** | **21,680** |
| **Gin** | **34,408** |
| **Macaron** | **36,976** |
| BunRouter | 51,232 |
| Fiber | 59,248 |
| HttpServeMux | 71,728 |
| HttpTreeMux | 73,448 |
| Chi | 83,160 |
| Echo | 91,976 |
| Beego | 98,824 |
| Goji v2 | 117,952 |
| GorillaMux | 599,496 |
| GoRestful | 819,704 |

### GitHub API 라우트: 203개

| Router | Bytes |
| :--- | ---: |
| **HttpRouter** | **37,072** |
| **Gin** | **58,840** |
| **HttpTreeMux** | **78,800** |
| Macaron | 90,632 |
| BunRouter | 93,776 |
| Chi | 94,888 |
| Echo | 117,784 |
| Goji v2 | 118,640 |
| Beego | 150,840 |
| Fiber | 163,832 |
| GoRestful | 1,270,848 |
| GorillaMux | 1,319,696 |

### Google+ API 라우트: 13개

| Router | Bytes |
| :--- | ---: |
| **HttpRouter** | **2,776** |
| **Gin** | **4,576** |
| **BunRouter** | **7,360** |
| HttpTreeMux | 7,440 |
| Chi | 8,008 |
| Goji v2 | 8,096 |
| Macaron | 8,672 |
| Beego | 10,256 |
| Fiber | 10,840 |
| Echo | 10,968 |
| GorillaMux | 68,000 |
| GoRestful | 72,536 |

### Parse API 라우트: 26개

| Router | Bytes |
| :--- | ---: |
| **HttpRouter** | **5,024** |
| **Gin** | **7,896** |
| **HttpTreeMux** | **7,848** |
| BunRouter | 9,336 |
| Chi | 9,656 |
| Echo | 13,816 |
| Macaron | 13,704 |
| Fiber | 15,352 |
| Goji v2 | 16,064 |
| Beego | 19,256 |
| GorillaMux | 105,384 |
| GoRestful | 121,200 |

---

## 벤치마크 결과

### GitHub API (203개 라우트)

작업당 203개의 모든 GitHub API 엔드포인트를 라우팅합니다.

| Rank | Router | ns/op | B/op | allocs/op |
| :--: | :--- | ---: | ---: | ---: |
| 1 | **Gin** | 9,944 | 0 | 0 |
| 2 | **BunRouter** | 10,281 | 0 | 0 |
| 3 | **Echo** | 11,072 | 0 | 0 |
| 4 | HttpRouter | 15,059 | 13,792 | 167 |
| 5 | HttpTreeMux | 49,302 | 65,856 | 671 |
| 6 | Chi | 94,376 | 130,817 | 740 |
| 7 | Beego | 101,941 | 71,456 | 609 |
| 8 | Fiber | 109,148 | 0 | 0 |
| 9 | Macaron | 121,785 | 147,784 | 1,624 |
| 10 | Goji v2 | 242,849 | 313,744 | 3,712 |
| 11 | GoRestful | 885,678 | 1,006,744 | 3,009 |
| 12 | GorillaMux | 1,316,844 | 225,667 | 1,588 |

### Google+ API (13개 라우트)

작업당 13개의 모든 Google+ API 엔드포인트를 라우팅합니다.

| Rank | Router | ns/op | B/op | allocs/op |
| :--: | :--- | ---: | ---: | ---: |
| 1 | **BunRouter** | 348.5 | 0 | 0 |
| 2 | **Gin** | 429.7 | 0 | 0 |
| 3 | **Echo** | 451.1 | 0 | 0 |
| 4 | HttpRouter | 668.6 | 640 | 11 |
| 5 | HttpTreeMux | 2,428 | 4,032 | 38 |
| 6 | Fiber | 2,506 | 0 | 0 |
| 7 | Chi | 5,333 | 8,480 | 48 |
| 8 | Beego | 5,927 | 4,576 | 39 |
| 9 | Macaron | 7,294 | 9,464 | 104 |
| 10 | Goji v2 | 8,000 | 15,120 | 115 |
| 11 | GorillaMux | 14,707 | 14,448 | 102 |
| 12 | GoRestful | 24,189 | 60,720 | 193 |

### Parse API (26개 라우트)

작업당 26개의 모든 Parse API 엔드포인트를 라우팅합니다.

| Rank | Router | ns/op | B/op | allocs/op |
| :--: | :--- | ---: | ---: | ---: |
| 1 | **BunRouter** | 588.2 | 0 | 0 |
| 2 | **Gin** | 712.1 | 0 | 0 |
| 3 | **Echo** | 742.1 | 0 | 0 |
| 4 | HttpRouter | 948.5 | 640 | 16 |
| 5 | HttpTreeMux | 3,372 | 5,728 | 51 |
| 6 | Fiber | 4,250 | 0 | 0 |
| 7 | Chi | 8,863 | 14,944 | 84 |
| 8 | Beego | 10,541 | 9,152 | 78 |
| 9 | Macaron | 13,635 | 18,928 | 208 |
| 10 | Goji v2 | 13,264 | 29,456 | 199 |
| 11 | GorillaMux | 25,886 | 26,960 | 198 |
| 12 | GoRestful | 54,780 | 131,728 | 380 |

### 정적 라우트 (157개 라우트)

작업당 157개의 모든 정적 라우트를 라우팅합니다. 기준선으로 http.ServeMux를 포함합니다.

| Rank | Router | ns/op | B/op | allocs/op |
| :--: | :--- | ---: | ---: | ---: |
| 1 | **HttpRouter** | 4,177 | 0 | 0 |
| 2 | **HttpTreeMux** | 5,363 | 0 | 0 |
| 3 | **Gin** | 5,528 | 0 | 0 |
| 4 | BunRouter | 5,997 | 0 | 0 |
| 5 | Echo | 6,897 | 0 | 0 |
| — | HttpServeMux | 18,172 | 0 | 0 |
| 6 | Fiber | 29,310 | 0 | 0 |
| 7 | Chi | 41,317 | 57,776 | 314 |
| 8 | Beego | 68,255 | 55,264 | 471 |
| 9 | Macaron | 81,824 | 114,296 | 1,256 |
| 10 | Goji v2 | 84,459 | 175,840 | 1,099 |
| 11 | GorillaMux | 302,825 | 133,137 | 1,099 |
| 12 | GoRestful | 436,510 | 677,824 | 2,193 |

---

## 마이크로 벤치마크

### 단일 파라미터

라우트: `/user/:name` — 요청: `GET /user/gordon`

| Rank | Router | ns/op | B/op | allocs/op |
| :--: | :--- | ---: | ---: | ---: |
| 1 | **BunRouter** | 12.22 | 0 | 0 |
| 2 | **Echo** | 17.75 | 0 | 0 |
| 3 | **Gin** | 23.31 | 0 | 0 |
| 4 | HttpRouter | 31.88 | 32 | 1 |
| 5 | Fiber | 114.4 | 0 | 0 |
| 6 | HttpTreeMux | 165.0 | 352 | 3 |
| 7 | Chi | 332.2 | 704 | 4 |
| 8 | Beego | 348.8 | 352 | 3 |
| 9 | Goji v2 | 494.3 | 1,136 | 8 |
| 10 | GorillaMux | 630.6 | 1,152 | 8 |
| 11 | Macaron | 708.0 | 1,064 | 10 |
| 12 | GoRestful | 1,394 | 4,600 | 15 |

### 5개 파라미터

라우트: `/:a/:b/:c/:d/:e` — 요청: `GET /test/test/test/test/test`

| Rank | Router | ns/op | B/op | allocs/op |
| :--: | :--- | ---: | ---: | ---: |
| 1 | **BunRouter** | 41.86 | 0 | 0 |
| 2 | **Echo** | 43.76 | 0 | 0 |
| 3 | **Gin** | 44.20 | 0 | 0 |
| 4 | HttpRouter | 83.74 | 160 | 1 |
| 5 | Fiber | 271.6 | 0 | 0 |
| 6 | HttpTreeMux | 358.8 | 576 | 6 |
| 7 | Chi | 453.7 | 704 | 4 |
| 8 | Beego | 480.3 | 352 | 3 |
| 9 | Goji v2 | 532.4 | 1,200 | 8 |
| 10 | Macaron | 799.7 | 1,064 | 10 |
| 11 | GorillaMux | 972.6 | 1,216 | 8 |
| 12 | GoRestful | 1,579 | 4,712 | 15 |

### 20개 파라미터

라우트: `/:a/:b/.../:t` (20개 세그먼트) — 요청: `GET /a/b/.../t`

| Rank | Router | ns/op | B/op | allocs/op |
| :--: | :--- | ---: | ---: | ---: |
| 1 | **Gin** | 121.7 | 0 | 0 |
| 2 | **Echo** | 127.5 | 0 | 0 |
| 3 | **BunRouter** | 211.4 | 0 | 0 |
| 4 | HttpRouter | 290.2 | 704 | 1 |
| 5 | Fiber | 466.1 | 0 | 0 |
| 6 | Goji v2 | 745.3 | 1,440 | 8 |
| 7 | Beego | 1,099 | 352 | 3 |
| 8 | Chi | 1,805 | 2,504 | 9 |
| 9 | HttpTreeMux | 1,857 | 3,144 | 13 |
| 10 | Macaron | 2,058 | 2,864 | 15 |
| 11 | GorillaMux | 2,223 | 3,272 | 13 |
| 12 | GoRestful | 3,337 | 7,008 | 20 |

### 파라미터 쓰기

라우트: `/user/:name` (응답 쓰기 포함) — 요청: `GET /user/gordon`

| Rank | Router | ns/op | B/op | allocs/op |
| :--: | :--- | ---: | ---: | ---: |
| 1 | **BunRouter** | 25.86 | 0 | 0 |
| 2 | **Gin** | 27.65 | 0 | 0 |
| 3 | HttpRouter | 37.40 | 32 | 1 |
| 4 | Echo | 47.94 | 8 | 1 |
| 5 | Fiber | 125.7 | 0 | 0 |
| 6 | HttpTreeMux | 180.4 | 352 | 3 |
| 7 | Chi | 348.3 | 704 | 4 |
| 8 | Beego | 386.1 | 360 | 4 |
| 9 | Goji v2 | 516.9 | 1,168 | 10 |
| 10 | GorillaMux | 665.5 | 1,152 | 8 |
| 11 | Macaron | 784.3 | 1,112 | 13 |
| 12 | GoRestful | 1,534 | 4,608 | 16 |

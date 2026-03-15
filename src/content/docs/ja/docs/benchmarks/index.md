---
title: "ベンチマーク"
sidebar:
  order: 12
---

> **更新データ：** これらのベンチマークは2026年3月にGin v1.12.0とGo 1.25.8を使用して収集されました。最新のベンチマーク結果については、[go-http-routing-benchmark](https://github.com/gin-gonic/go-http-routing-benchmark)リポジトリをご覧ください。

## Ginベンチマークレポート

**テスト環境：**

- **ホストプラットフォーム：** Apple M4 Pro
- **マシンスペック：** macOS (Darwin 25.3.0), arm64
- **テスト日：** 2026年3月15日
- **Ginバージョン：** v1.12.0
- **Goバージョン：** 1.25.8 (darwin/arm64)
- **ベンチマークソース：** [Go HTTP Router Benchmark](https://github.com/gin-gonic/go-http-routing-benchmark)

---

## 概要

以下の表は、**GitHub APIスループット**（203ルート、全メソッド）で全ルーターをランク付けしたもので、実際のルーティングワークロードを最もよく表しています。_ns/opが低いほど優れています。_

| Rank | Router | ns/op | B/op | allocs/op | Zero-alloc |
| :--: | :--- | ---: | ---: | ---: | :---: |
| 1 | **Gin** | 9,944 | 0 | 0 | :white_check_mark: |
| 2 | **BunRouter** | 10,281 | 0 | 0 | :white_check_mark: |
| 3 | **Echo** | 11,072 | 0 | 0 | :white_check_mark: |
| 4 | HttpRouter | 15,059 | 13,792 | 167 | |
| 5 | HttpTreeMux | 49,302 | 65,856 | 671 | |
| 6 | Chi | 94,376 | 130,817 | 740 | |
| 7 | Beego | 101,941 | 71,456 | 609 | |
| 8 | Fiber | 109,148 | 0 | 0 | :white_check_mark: |
| 9 | Macaron | 121,785 | 147,784 | 1,624 | |
| 10 | Goji v2 | 242,849 | 313,744 | 3,712 | |
| 11 | GoRestful | 885,678 | 1,006,744 | 3,009 | |
| 12 | GorillaMux | 1,316,844 | 225,667 | 1,588 | |

**主なポイント：**

- Gin、BunRouter、Echoがトップティアを形成しており、すべてヒープアロケーションゼロを達成し、GitHub API全体を約10マイクロ秒でルーティングします。
- **HttpRouter**は非常に高速ですが、パラメータ付きルートごとに1回のアロケーションが発生します（203ルートで167回のアロケーション）。
- Fiberもゼロアロケーションを達成していますが、fasthttpベースのベンチマークインフラストラクチャがイテレーションごとのリセットオーバーヘッドを追加するため、net/httpルーターとの直接比較には注意が必要です。
- **GorillaMux**と**GoRestful**は機能豊富ですが、桁違いに遅いため、レイテンシに敏感なアプリケーションには適していません。

> **Fiberに関する注意：** Fiberのベンチマークは`fasthttp.RequestCtx`を使用し、イテレーションごとにResetを行います。これにより、net/httpベンチマークには存在しない一定のオーバーヘッドが追加されます。Fiber同士の比較は有効ですが、フレームワーク間の比較は慎重に解釈する必要があります。

---

## メモリ消費量

ルーティング構造の読み込みに必要なメモリ（低いほど優れています）。バイト数の昇順でソートしています。

### 静的ルート：157

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

### GitHub APIルート：203

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

### Google+ APIルート：13

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

### Parse APIルート：26

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

## ベンチマーク結果

### GitHub API（203ルート）

操作ごとに203のGitHub APIエンドポイントすべてをルーティング。

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

### Google+ API（13ルート）

操作ごとに13のGoogle+ APIエンドポイントすべてをルーティング。

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

### Parse API（26ルート）

操作ごとに26のParse APIエンドポイントすべてをルーティング。

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

### 静的ルート（157ルート）

操作ごとに157の静的ルートすべてをルーティング。ベースラインとしてhttp.ServeMuxを含みます。

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

## マイクロベンチマーク

### 単一パラメータ

ルート：`/user/:name` — リクエスト：`GET /user/gordon`

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

### 5パラメータ

ルート：`/:a/:b/:c/:d/:e` — リクエスト：`GET /test/test/test/test/test`

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

### 20パラメータ

ルート：`/:a/:b/.../:t`（20セグメント） — リクエスト：`GET /a/b/.../t`

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

### パラメータ書き込み

ルート：`/user/:name`（レスポンス書き込みあり） — リクエスト：`GET /user/gordon`

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

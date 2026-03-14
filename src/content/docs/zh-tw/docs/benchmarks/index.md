---
title: "基準測試"
sidebar:
  order: 12
---

> **歷史資料：** 這些基準測試於 2020 年 5 月使用 Gin v1.6.3 和 Go 1.14.2 收集。框架效能自那時起可能已有顯著變化。如需最新的基準測試結果，請參閱 [go-http-routing-benchmark](https://github.com/gin-gonic/go-http-routing-benchmark) 儲存庫。

## Gin Web 框架效能基準測試

基準測試幫助開發者評估 Go 中 HTTP 路由器函式庫的效率和資源使用。本頁面總結了許多流行框架的測量結果，讓你可以輕鬆比較它們的速度和記憶體消耗。

**測試環境：**

- **主機平台：** Travis CI（虛擬 Linux VM）
- **機器規格：** Ubuntu 16.04.6 LTS x64
- **測試日期：** 2020 年 5 月 4 日
- **Gin 版本：** v1.6.3
- **Go 版本：** 1.14.2（linux/amd64）
- **基準測試來源：** [Go HTTP Router Benchmark](https://github.com/gin-gonic/go-http-routing-benchmark)
- **詳細結果：** [查看 gist](https://gist.github.com/appleboy/b5f2ecfaf50824ae9c64dcfb9165ae5e) 或 [Travis 結果](https://travis-ci.org/github/gin-gonic/go-http-routing-benchmark/jobs/682947061)

Gin 使用 [HttpRouter](https://github.com/julienschmidt/httprouter) 的最佳化分支來實現高效能路由。

如果你想查看更多測試案例，可以查看[所有基準測試](https://github.com/gin-gonic/gin/blob/master/BENCHMARKS.md)。

---

## 如何閱讀表格

以下基準測試展示了各種 Go 框架執行常見 HTTP 路由任務的結果。
**數字越低（時間、記憶體、配置次數）越好。**
你可以使用這些結果直接並排比較 Gin 和其他路由器。

| 測試                              | 重複次數 | 時間 (ns/op) | 位元組 (B/op) | 配置次數 (allocs/op) |
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
| BenchmarkGin_GithubParam          | 9132032     | 131          | 0            | 0                       |
| BenchmarkGin_GithubAll            | 43550       | 27364        | 0            | 0                       |

---

## 基準測試表格說明

- **重複次數**：在固定時間內達成的總重複次數。數字越高代表結果越有信心。
- **時間 (ns/op)**：一次操作的持續時間，以奈秒為單位。越低越好。
- **位元組 (B/op)**：每次操作配置的堆積記憶體。越低代表效率越好。
- **配置次數 (allocs/op)**：每次操作的平均記憶體配置次數。配置次數越少對效能和垃圾回收越好。

如有問題或貢獻，請查看我們的 [GitHub 儲存庫](https://github.com/gin-gonic/gin)。

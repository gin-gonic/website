---
title: "建構標籤"
sidebar:
  order: 11
---

Go 的[建構標籤](https://pkg.go.dev/go/build#hdr-Build_Constraints)（也稱為建構約束）是告訴 Go 編譯器在編譯期間包含或排除檔案的指令。Gin 使用建構標籤讓你可以在編譯時替換內部實作或停用可選功能，而不需要更改任何應用程式程式碼。

這在幾種情境中很有用：

- **效能最佳化** -- 用更快的第三方編碼器取代預設的 `encoding/json` 套件，加速 API 中的 JSON 序列化。
- **縮小二進位檔大小** -- 移除你不使用的功能，如 MsgPack 渲染，以產生更小的編譯二進位檔。
- **部署調整** -- 為不同環境選擇不同的編碼器（例如，高吞吐量的正式環境建構 vs. 標準的開發建構）。

建構標籤透過 `-tags` 旗標傳遞給 Go 工具鏈：

```sh
go build -tags=<tag_name> .
```

你可以用逗號分隔來組合多個標籤：

```sh
go build -tags=nomsgpack,go_json .
```

### 可用的建構標籤

| 標籤 | 效果 |
|---|---|
| `go_json` | 將 `encoding/json` 替換為 [go-json](https://github.com/goccy/go-json) |
| `jsoniter` | 將 `encoding/json` 替換為 [jsoniter](https://github.com/json-iterator/go) |
| `sonic avx` | 將 `encoding/json` 替換為 [sonic](https://github.com/bytedance/sonic)（需要 AVX CPU 指令） |
| `nomsgpack` | 停用 MsgPack 渲染支援 |

:::note
建構標籤只影響 Gin 的編譯方式。你的應用程式程式碼（路由處理函式、中介軟體等）在切換標籤時不需要改變。
:::

## 本節內容

以下頁面詳細介紹了每個建構標籤：

- [**使用 JSON 替代方案建構**](./json-replacement/) -- 用 go-json、jsoniter 或 sonic 替換預設的 JSON 編碼器以加速序列化。
- [**不含 MsgPack 建構**](./nomsgpack/) -- 使用 `nomsgpack` 建構標籤停用 MsgPack 渲染以縮小二進位檔大小。

---
title: "使用 JSON 替代方案建構"
sidebar:
  order: 1
---

Gin 預設使用標準函式庫的 `encoding/json` 套件進行 JSON 序列化和反序列化。標準函式庫編碼器經過充分測試且完全相容，但不是最快的選擇。如果 JSON 效能是你應用程式的瓶頸——例如，在序列化大型回應酬載的高吞吐量 API 中——你可以在建構時使用建構標籤替換為更快的替代方案。不需要更改程式碼。

## 可用的替代方案

Gin 支援三種替代的 JSON 編碼器。每一種都實作了 Gin 期望的相同介面，因此你的處理函式、中介軟體和綁定邏輯無需修改即可繼續運作。

### go-json

[go-json](https://github.com/goccy/go-json) 是一個純 Go 的 JSON 編碼器，在保持完全相容性的同時，提供了相較於 `encoding/json` 的顯著效能提升。它可在所有平台和架構上運作。

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go)（json-iterator）是另一個純 Go 的高效能 JSON 函式庫。它與 `encoding/json` API 相容，並提供靈活的配置系統以滿足進階使用情境。

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic) 是 ByteDance 開發的超高速 JSON 編碼器。它使用 JIT 編譯和 SIMD 指令來實現最大吞吐量，使其成為三者中最快的選擇。

```sh
go build -tags="sonic avx" .
```

:::note
Sonic 需要支援 AVX 指令的 CPU。這在大多數現代 x86_64 處理器（Intel Sandy Bridge 及更新版本、AMD Bulldozer 及更新版本）上都可用，但無法在 ARM 架構或較舊的 x86 硬體上運作。如果你的部署目標不支援 AVX，請改用 go-json 或 jsoniter。
:::

## 選擇替代方案

| 編碼器 | 平台支援 | 主要優勢 |
|---|---|---|
| `encoding/json`（預設） | 全部 | 最大相容性，無額外依賴 |
| go-json | 全部 | 良好加速，純 Go，廣泛相容性 |
| jsoniter | 全部 | 良好加速，靈活配置 |
| sonic | 僅限有 AVX 的 x86_64 | 透過 JIT 和 SIMD 實現最高吞吐量 |

對於大多數應用程式，**go-json** 是安全且有效的選擇——它適用於所有平台並提供有意義的效能提升。當你需要最大 JSON 吞吐量且伺服器在 x86_64 硬體上運行時，選擇 **sonic**。如果你需要其特定的配置功能或已在程式碼庫的其他地方使用它，選擇 **jsoniter**。

## 驗證替代方案

你可以透過簡單的基準測試比較序列化效能，或檢查二進位檔的符號表來確認替代方案已生效：

```sh
# Build with go-json
go build -tags=go_json -o myapp .

# Check that go-json symbols are present
go tool nm myapp | grep goccy
```

建構標籤也適用於其他 Go 指令：

```sh
go run -tags=go_json .
go test -tags=go_json ./...
```

:::note
一次只使用一個 JSON 替代標籤。如果你指定多個 JSON 標籤（例如 `-tags=go_json,jsoniter`），行為是未定義的。`nomsgpack` 標籤可以安全地與任何 JSON 替代標籤組合。
:::

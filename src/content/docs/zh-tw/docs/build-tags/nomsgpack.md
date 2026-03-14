---
title: "不含 MsgPack 建構"
sidebar:
  order: 2
---

[MsgPack](https://msgpack.org/)（MessagePack）是一種緊湊的二進位序列化格式——可以把它想成更快、更小的 JSON 替代方案。Gin 預設包含 MsgPack 渲染和綁定支援，這意味著你的應用程式可以使用 `c.Bind()` 和 `c.Render()` 搭配適當的內容類型來開箱即用地接受和回傳 MsgPack 編碼的資料。

然而，許多應用程式只使用 JSON，永遠不需要 MsgPack。在這種情況下，MsgPack 依賴會為你的編譯二進位檔增加不必要的體積。你可以使用 `nomsgpack` 建構標籤將其移除。

## 不含 MsgPack 建構

將 `nomsgpack` 標籤傳給 `go build`：

```sh
go build -tags=nomsgpack .
```

這也適用於其他 Go 指令：

```sh
go run -tags=nomsgpack .
go test -tags=nomsgpack ./...
```

## 有什麼改變

當你使用 `nomsgpack` 建構時，Gin 會在編譯時排除 MsgPack 渲染和綁定程式碼。這有幾個實際效果：

- 編譯的二進位檔更小，因為 MsgPack 序列化函式庫不會被連結進來。
- 任何嘗試渲染或綁定 MsgPack 資料的處理函式將不再運作。如果你使用 `c.ProtoBuf()` 或其他非 MsgPack 渲染器，它們不受影響。
- 所有 JSON、XML、YAML、TOML 和 ProtoBuf 功能繼續正常運作。

:::note
如果你的 API 不提供 MsgPack 回應且你沒有在任何地方呼叫 `c.MsgPack()`，使用此標籤是安全的。你現有的 JSON 和 HTML 處理函式行為完全相同。
:::

## 驗證結果

你可以透過比較建構來確認二進位檔大小的縮減：

```sh
# Standard build
go build -o gin-app .
ls -lh gin-app

# Build without MsgPack
go build -tags=nomsgpack -o gin-app-nomsgpack .
ls -lh gin-app-nomsgpack
```

確切的節省取決於你的應用程式，但移除 MsgPack 通常會減少最終二進位檔的少量大小。如需更多背景資訊，請參閱[原始的 pull request](https://github.com/gin-gonic/gin/pull/1852)。

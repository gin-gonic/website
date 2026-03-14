---
title: "ファイルアップロード"
sidebar:
  label: "ファイルアップロード"
  order: 7
---

Ginではmultipartファイルアップロードを簡単に処理できます。フレームワークはアップロードされたファイルを受信するための`gin.Context`上の組み込みメソッドを提供しています：

- **`c.FormFile(name)`** -- フォームフィールド名で単一のファイルをリクエストから取得します。
- **`c.MultipartForm()`** -- multipartフォーム全体をパースし、アップロードされたすべてのファイルとフィールド値にアクセスできます。
- **`c.SaveUploadedFile(file, dst)`** -- 受信したファイルをディスク上の指定パスに保存する便利なメソッドです。

### メモリ制限

Ginは`router.MaxMultipartMemory`を通じて、multipartフォームのパースにデフォルトで**32 MiB**のメモリ制限を設定しています。この制限内のファイルはメモリにバッファされ、それを超えるものはディスク上の一時ファイルに書き込まれます。アプリケーションのニーズに合わせてこの値を調整できます：

```go
router := gin.Default()
// 制限を8 MiBに下げる
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### セキュリティに関する注意

クライアントが報告するファイル名（`file.Filename`）は**信頼すべきではありません**。ファイルシステム操作で使用する前に、必ずサニタイズまたは置換してください。詳細については[MDNのContent-Dispositionドキュメント](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives)を参照してください。

### サブページ

- [**単一ファイル**](./single-file/) -- リクエストごとに単一のファイルをアップロードして保存します。
- [**複数ファイル**](./multiple-file/) -- 1回のリクエストで複数のファイルをアップロードして保存します。
- [**アップロードサイズの制限**](./limit-bytes/) -- `http.MaxBytesReader`を使用してアップロードサイズを制限します。

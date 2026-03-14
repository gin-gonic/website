---
title: "Gin 1.11.0 リリースのお知らせ: HTTP/3、フォーム改善、パフォーマンス向上など"
linkTitle: "Gin 1.11.0 リリースのお知らせ"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 がリリースされました

Gin v1.11.0のリリースを発表できることを嬉しく思います。このリリースでは、多数の新機能、パフォーマンスの調整、バグ修正がWebフレームワークに追加されました。このリリースは、速度、柔軟性、そしてモダンなGo開発に対するGinのコミットメントを継続するものです。

### 主な機能

- **実験的なHTTP/3サポート:** Ginは[quic-go](https://github.com/quic-go/quic-go)を介した実験的なHTTP/3をサポートするようになりました！最新のWebトランスポートプロトコルを試したい方は、ぜひお試しください。([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **フォームバインディングの改善:** フォームバインディングに大幅な改善を加えました：
  - フォームでの配列コレクションフォーマットのサポート ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - フォームタグのカスタム文字列スライスアンマーシャリング ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - コレクションのデフォルト値 ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **バインディングタイプの拡張:** 新しい`BindPlain`メソッドでプレーンテキストを簡単にバインドでき ([#3904](https://github.com/gin-gonic/gin/pull/3904))、unixMilliおよびunixMicroフォーマットもサポートされました ([#4190](https://github.com/gin-gonic/gin/pull/4190))。

- **Context APIの改善:** `GetXxx`がより多くのGoネイティブ型をサポートするようになり ([#3633](https://github.com/gin-gonic/gin/pull/3633))、型安全なコンテキストデータの取得が容易になりました。

- **ファイルシステムの更新:** 新しい`OnlyFilesFS`がエクスポートされ、テストとドキュメントが整備されました ([#3939](https://github.com/gin-gonic/gin/pull/3939))。

### パフォーマンスと機能強化

- **フォームデータ処理の高速化:** フォームパースの内部最適化によりパフォーマンスが向上しました ([#4339](https://github.com/gin-gonic/gin/pull/4339))。
- 堅牢性と明確性のためにコア、レンダリング、コンテキストロジックをリファクタリングしました ([変更ログの完全なPRリスト](../releases/release111.md))。

### バグ修正

- **ミドルウェアの信頼性:** ミドルウェアが予期せず再入される稀なバグを修正しました ([#3987](https://github.com/gin-gonic/gin/pull/3987))。
- TOMLフォームバインディングの安定性を改善しました ([#4193](https://github.com/gin-gonic/gin/pull/4193))。
- 空のツリーで「method not allowed」リクエストを処理する際のpanicを解消しました ([#4003](https://github.com/gin-gonic/gin/pull/4003))。
- コンテキスト処理、競合状態などの全般的な改善。

### ビルド、依存関係、CIの更新

- CI/CDワークフローで**Go 1.25**をサポートし、より厳格なコード品質のために新しいリンターを有効化しました ([#4341](https://github.com/gin-gonic/gin/pull/4341)、[#4010](https://github.com/gin-gonic/gin/pull/4010))。
- Trivy脆弱性スキャンがCIに統合されました ([#4359](https://github.com/gin-gonic/gin/pull/4359))。
- `sonic`、`setup-go`、`quic-go`などの複数の依存関係がアップグレードされました。

### ドキュメント

- ドキュメントの拡充、変更ログの更新、文法とコードサンプルの改善、そしてポルトガル語ドキュメントの新規追加 ([#4078](https://github.com/gin-gonic/gin/pull/4078))。

---

Gin 1.11.0は、活発なコミュニティと継続的な開発の証です。Ginを最新かつモダンなWebアプリケーションに適したものに保ち続けてくださる、すべてのコントリビューター、Issue報告者、ユーザーの皆様に感謝いたします。

Gin 1.11.0を試してみませんか？[GitHubでアップグレード](https://github.com/gin-gonic/gin/releases/tag/v1.11.0)して、ご感想をお聞かせください！

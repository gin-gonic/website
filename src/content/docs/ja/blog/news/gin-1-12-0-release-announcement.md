---
title: "Gin 1.12.0 リリースのお知らせ: BSONサポート、Context改善、パフォーマンス向上など"
linkTitle: "Gin 1.12.0 リリースのお知らせ"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 がリリースされました

Gin v1.12.0のリリースを発表できることを大変嬉しく思います。このリリースには、新機能、意義あるパフォーマンス改善、そして堅実なバグ修正が盛り込まれています。モダンなプロトコルに対するGinのサポートを深め、開発者体験を洗練し、高速で軽量であり続けるというプロジェクトの伝統を継続するものです。

### 主な機能

- **BSONプロトコルサポート:** レンダリング層がBSONエンコーディングをサポートするようになり、より効率的なバイナリデータ交換への道が開かれました ([#4145](https://github.com/gin-gonic/gin/pull/4145))。

- **新しいContextメソッド:** 2つの新しいヘルパーにより、エラーハンドリングがよりクリーンでGoらしくなりました：
  - コンテキストからの型安全なエラー取得のための`GetError`と`GetErrorSlice` ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - コンテキストからキーを削除するための`Delete`メソッド ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **柔軟なバインディング:** URIおよびクエリバインディングが`encoding.UnmarshalText`を尊重するようになり、カスタム型のデシリアライゼーションをより細かく制御できるようになりました ([#4203](https://github.com/gin-gonic/gin/pull/4203))。

- **エスケープパスオプション:** 新しいエンジンオプションにより、ルーティングにエスケープされた（生の）リクエストパスを使用することを選択できるようになりました ([#4420](https://github.com/gin-gonic/gin/pull/4420))。

- **コンテンツネゴシエーションでのProtocol Buffers:** `context`がネゴシエーション可能なコンテンツタイプとしてProtocol Buffersをサポートするようになり、gRPCスタイルのレスポンスの統合がより容易になりました ([#4423](https://github.com/gin-gonic/gin/pull/4423))。

- **ロガーでの色付きレイテンシ:** デフォルトロガーがレイテンシをカラー表示するようになり、遅いリクエストを一目で見つけやすくなりました ([#4146](https://github.com/gin-gonic/gin/pull/4146))。

### パフォーマンスと機能強化

- **ルーターツリーの最適化:** 基数木への複数の改善により、アロケーションが削減され、パス解析が高速化されました：
  - `findCaseInsensitivePath`でのアロケーション削減 ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - 効率化のための`strings.Count`を使用したパス解析 ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - `redirectTrailingSlash`での正規表現をカスタム関数に置き換え ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **リカバリの最適化:** スタックトレースの読み取りがより効率的になりました ([#4466](https://github.com/gin-gonic/gin/pull/4466))。
- **ロガーの改善:** 設定によりクエリ文字列の出力をスキップできるようになりました ([#4547](https://github.com/gin-gonic/gin/pull/4547))。
- **Unixソケットの信頼:** リクエストがUnixソケット経由で到着した場合、`X-Forwarded-For`ヘッダーが常に信頼されるようになりました ([#3359](https://github.com/gin-gonic/gin/pull/3359))。
- **Flushの安全性:** 基盤となる`http.ResponseWriter`が`http.Flusher`を実装していない場合でも、`Flush()`がpanicを起こさなくなりました ([#4479](https://github.com/gin-gonic/gin/pull/4479))。
- **コード品質のリファクタリング:** `maps.Copy`と`maps.Clone`によるよりクリーンなマップ処理、マジックナンバーを名前付き定数に置き換え、モダンなrange-over-intループなど ([#4352](https://github.com/gin-gonic/gin/pull/4352)、[#4333](https://github.com/gin-gonic/gin/pull/4333)、[#4529](https://github.com/gin-gonic/gin/pull/4529)、[#4392](https://github.com/gin-gonic/gin/pull/4392))。

### バグ修正

- **ルーターのpanic修正:** `RedirectFixedPath`が有効な場合の`findCaseInsensitivePathRec`でのpanicを解決しました ([#4535](https://github.com/gin-gonic/gin/pull/4535))。
- **DataレンダリングのContent-Length:** `Data.Render`が`Content-Length`ヘッダーを正しく書き込むようになりました ([#4206](https://github.com/gin-gonic/gin/pull/4206))。
- **複数ヘッダーでのClientIP:** `ClientIP`が複数の`X-Forwarded-For`ヘッダー値を含むリクエストを正しく処理するようになりました ([#4472](https://github.com/gin-gonic/gin/pull/4472))。
- **バインディングのエッジケース:** バインディングでの空値エラーを修正し ([#2169](https://github.com/gin-gonic/gin/pull/2169))、フォームバインディングでの空のスライス/配列の処理を改善しました ([#4380](https://github.com/gin-gonic/gin/pull/4380))。
- **リテラルコロンルート:** リテラルコロンを含むルートが`engine.Handler()`で正しく動作するようになりました ([#4415](https://github.com/gin-gonic/gin/pull/4415))。
- **ファイルディスクリプタのリーク:** `RunFd`が`os.File`ハンドルを適切にクローズし、リソースリークを防止するようになりました ([#4422](https://github.com/gin-gonic/gin/pull/4422))。
- **Hijackの動作:** レスポンスのライフサイクルを正しくモデル化するためにhijackの動作を改善しました ([#4373](https://github.com/gin-gonic/gin/pull/4373))。
- **リカバリ:** リカバリミドルウェアで`http.ErrAbortHandler`が意図通りに抑制されるようになりました ([#4336](https://github.com/gin-gonic/gin/pull/4336))。
- **デバッグのバージョン不一致:** デバッグモードで報告される不正なバージョン文字列を修正しました ([#4403](https://github.com/gin-gonic/gin/pull/4403))。

### ビルド、依存関係、CIの更新

- **Go 1.25が最低バージョン:** サポートされるGoの最低バージョンが**1.25**になり、CIワークフローもそれに合わせて更新されました ([#4550](https://github.com/gin-gonic/gin/pull/4550))。
- **BSON依存関係のアップグレード:** BSONバインディングの依存関係が`mongo-driver` v2にアップグレードされました ([#4549](https://github.com/gin-gonic/gin/pull/4549))。

---

Gin 1.12.0は、コントリビューター、レビュアー、ユーザーの皆様を含むコミュニティの献身を反映しています。リリースのたびにGinをより良くしてくださり、ありがとうございます。

Gin 1.12.0を試してみませんか？[GitHubでアップグレード](https://github.com/gin-gonic/gin/releases/tag/v1.12.0)して、ご感想をお聞かせください！

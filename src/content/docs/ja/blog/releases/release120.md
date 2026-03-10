---
title: "Gin 1.12.0 がリリースされました"
linkTitle: "Gin 1.12.0 がリリースされました"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### 機能

* feat(binding): uri/query バインディングで encoding.UnmarshalText のサポートを追加 ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): エラー取得用の GetError と GetErrorSlice メソッドを追加 ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): コンテンツネゴシエーションに Protocol Buffers サポートを追加 ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): Delete メソッドを実装 ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): エスケープパスを使用するオプションを追加 ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): レイテンシーのカラー化 ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): bson プロトコルを追加 ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### バグ修正

* fix(binding): 空の値エラーを修正 ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): フォームバインディングの空のスライス/配列処理を改善 ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): 複数の X-Forwarded-For ヘッダー値に対する ClientIP 処理を修正 ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): バージョン不一致を修正 ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): リソースリークを防ぐため RunFd で os.File をクローズ ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): engine.Handler() で機能しないリテラルコロンルートを修正 ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): recover で http.ErrAbortHandler を抑制 ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): Data.Render にコンテンツ長を記述 ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): レスポンスライフサイクルの hijack 動作を改善 ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): RedirectFixedPath を使用した findCaseInsensitivePathRec のパニックを修正 ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: タイプミスを修正し、ドキュメント明確さを改善し、デッドコードを削除 ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### 拡張機能

* chore(binding): bson 依存関係を mongo-driver v2 にアップグレード ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): unix ソケットからの xff ヘッダーを常に信頼 ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): golang.org/x/crypto を v0.45.0 にアップグレード ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): quic-go を v0.57.1 にアップグレード ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): クエリ文字列出力のスキップを許可 ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): http.Flusher がある場合の Flush() パニックを防止 ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### リファクター

* refactor(binding): マップ処理を簡潔にするため maps.Copy を使用 ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): 戻り値の名前を省略 ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): ハードコーディングされた localhost IP をコンスタントに置き換え ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): maps.Clone を使用 ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): エンジン関数を簡素化するため sync.OnceValue を使用 ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): スマートなエラー比較 ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): ユーティリティ関数を utils.go に移動 ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: for ループを int の range を使用して最新化できます ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: bodyAllowedForStatus のマジックナンバーを名前付きコンスタントに置き換え ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: b.Loop() を使用してコードを簡素化しパフォーマンスを向上 ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### ビルドプロセス更新 / CI

* ci(bot): 依存関係の更新の頻度を上げ、グループ化 ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): テストアサーションとリンター設定をリファクター ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): HTTP ミドルウェアのタイプセーフティーとサーバー構成を改善 ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): Trivy セキュリティスキャンを毎日 UTC 午前 0 時に実行するようスケジュール ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: 脆弱性スキャンワークフローを Trivy 統合に置き換え ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: CI ワークフローを更新し Trivy 設定のクォーティングを標準化 ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: CI とドキュメント全体で Go バージョンサポートを 1.25+ に更新 ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### ドキュメント更新

* docs(README): Trivy セキュリティスキャンバッジを追加 ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): ShouldBind\* メソッドのサンプルコメントを追加 ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): いくつかのコメントを修正 ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): コメント内の間違った関数名を修正 ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): ドキュメントを一新し、明確さと完全性を向上 ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: Gin 1.11.0 リリースをブログリンク付きで発表 ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: Gin v1.12.0 リリースをドキュメント化し完成 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: GitHub コントリビューションおよびサポートテンプレートを一新 ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: コントリビューティングガイドラインを包括的な指示で一新 ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: Go バージョン変更を反映するようドキュメントを更新 ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: 破損したドキュメントリンク用の機能ドキュメント指示を更新 ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### パフォーマンス

* perf(path): redirectTrailingSlash で正規表現をカスタム関数に置き換え ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): スタック関数のライン読み込みを最適化 ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): strings.Count を使用してパス解析を最適化 ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): findCaseInsensitivePath のアロケーションを削減 ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### テスト

* test(benchmarks): 不正な関数名を修正 ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): 空/nil ケースのテストを追加 ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): マジックナンバー 100 の代わりに http.StatusContinue コンスタントを使用 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): debug.go のテストカバレッジを 100% に改善 ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): ginS パッケージの包括的なテストカバレッジを追加 ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): 統合テストのレース条件を解決 ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): 包括的なエラーハンドリングテストを追加 ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): MsgPack レンダーの包括的なテストを追加 ([#4537](https://github.com/gin-gonic/gin/pull/4537))

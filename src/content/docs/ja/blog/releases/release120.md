---
title: "Gin 1.12.0 がリリースされました"
linkTitle: "Gin 1.12.0 がリリースされました"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### 機能

* feat(binding): uri/queryバインディングでencoding.UnmarshalTextのサポートを追加 ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): エラー取得のためのGetErrorとGetErrorSliceメソッドを追加 ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): コンテンツネゴシエーションにProtocol Buffersサポートを追加 ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): Deleteメソッドを実装 ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): エスケープパスを使用するオプションを追加 ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): レイテンシのカラー表示 ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): BSONプロトコルを追加 ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### バグ修正

* fix(binding): 空値エラー ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): フォームバインディングでの空スライス/配列の処理を改善 ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): 複数のX-Forwarded-Forヘッダー値に対するClientIPの処理 ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): バージョン不一致 ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): リソースリークを防止するためRunFdでos.Fileをクローズ ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): engine.Handler()でリテラルコロンルートが動作しない問題 ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): recoverでhttp.ErrAbortHandlerを抑制 ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): Data.RenderでContent-Lengthを書き込み ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): レスポンスライフサイクルのためhijack動作を改善 ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): RedirectFixedPath使用時のfindCaseInsensitivePathRecでのpanic ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: タイポの修正、ドキュメントの明確性改善、デッドコードの削除 ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### 機能強化

* chore(binding): BSON依存関係をmongo-driver v2にアップグレード ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): Unixソケットからのxffヘッダーを常に信頼 ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): golang.org/x/cryptoをv0.45.0にアップグレード ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): quic-goをv0.57.1にアップグレード ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): クエリ文字列出力のスキップを許可 ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): `http.Flusher`未実装時のFlush()のpanicを防止 ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### リファクタリング

* refactor(binding): よりクリーンなマップ処理のためmaps.Copyを使用 ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): 戻り値名を省略 ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): ハードコードされたlocalhostのIPを定数に置き換え ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): maps.Cloneを使用 ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): sync.OnceValueを使用してengine関数を簡素化 ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): スマートなエラー比較 ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): ユーティリティ関数をutils.goに移動 ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: range over intを使用してforループをモダン化 ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: bodyAllowedForStatusでマジックナンバーを名前付き定数に置き換え ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: b.Loop()を使用してコードを簡素化しパフォーマンスを改善 ([#4389](https://github.com/gin-gonic/gin/pull/4389)、[#4432](https://github.com/gin-gonic/gin/pull/4432))

### ビルドプロセスの更新 / CI

* ci(bot): 依存関係の更新頻度を増やしグループ化 ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): テストアサーションとリンター設定をリファクタリング ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): HTTPミドルウェアの型安全性とサーバー構成を改善 ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): Trivyセキュリティスキャンを毎日UTC午前0時に実行するようスケジュール ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: 脆弱性スキャンワークフローをTrivy統合に置き換え ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: CIワークフローを更新しTrivy設定の引用を標準化 ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: CIとドキュメント全体でGoバージョンサポートを1.25+に更新 ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### ドキュメントの更新

* docs(README): Trivyセキュリティスキャンバッジを追加 ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): ShouldBind\*メソッドのサンプルコメントを追加 ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): コメントを修正 ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): コメント内の誤った関数名を修正 ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): 明確性と完全性のためドキュメントを刷新・拡充 ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: ブログリンク付きでGin 1.11.0リリースを告知 ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: Gin v1.12.0リリースのドキュメントを作成・確定 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: GitHubのコントリビューションとサポートテンプレートを刷新 ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: コントリビューティングガイドラインを包括的な指示で刷新 ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: Goバージョンの変更を反映するためドキュメントを更新 ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: 壊れたドキュメントリンクの機能ドキュメント指示を更新 ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### パフォーマンス

* perf(path): redirectTrailingSlashで正規表現をカスタム関数に置き換え ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): stack関数での行読み取りを最適化 ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): strings.Countを使用してパス解析を最適化 ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): findCaseInsensitivePathでのアロケーションを削減 ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### テスト

* test(benchmarks): 誤った関数名を修正 ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): 空/nilケースのテストを追加 ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): マジックナンバー100の代わりにhttp.StatusContinue定数を使用 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): debug.goのテストカバレッジを100%に改善 ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): ginSパッケージの包括的なテストカバレッジを追加 ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): 統合テストの競合状態を解決 ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): 包括的なエラーハンドリングテストを追加 ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): MsgPackレンダリングの包括的なテストを追加 ([#4537](https://github.com/gin-gonic/gin/pull/4537))

---
title: "Gin 1.11.0 がリリースされました"
linkTitle: "Gin 1.11.0 がリリースされました"
lastUpdated: 2025-09-20
---

## Gin v1.11.0

### 機能

* feat(gin): quic-go/quic-goを使用したHTTP/3の実験的サポート ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): フォームバインディングに配列コレクションフォーマットを追加 ([#3986](https://github.com/gin-gonic/gin/pull/3986))、フォームタグアンマーシャル用のカスタム文字列スライスを追加 ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): BindPlainを追加 ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): OnlyFilesFSをエクスポート、テスト、ドキュメント化 ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): unixMilliとunixMicroのサポートを追加 ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): フォームバインディングでコレクションのデフォルト値をサポート ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): GetXxxがより多くのGoネイティブ型をサポート ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### 機能強化

* perf(context): getMapFromFormDataのパフォーマンスを最適化 ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): node.insertChildでstring(/)を"/"に置き換え ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): writeHeaderからheadersパラメータを削除 ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): "GetType()"関数を簡素化 ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): SliceValidationErrorのErrorメソッドを簡素化 ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context): SaveUploadedFileでfilepath.Dirの二重使用を回避 ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): コンテキスト処理をリファクタリングしテストの堅牢性を改善 ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): strings.Indexの代わりにstrings.Cutを使用 ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): SaveUploadedFileにオプションのパーミッションパラメータを追加 ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): initQueryCache()でURLがNon-nilであることを確認 ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): NegotiateでのYAML判定ロジック ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: 自己定義の'min'を公式のものに置き換え ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: 冗長なfilepath.Dirの使用を削除 ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### バグ修正

* fix: HandleContextでのミドルウェア再入問題を防止 ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): decodeTomlでの重複デコーディングを防止しバリデーションを追加 ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): 空のツリーでmethod not allowedを処理する際にpanicしないように修正 ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): ginモードのデータ競合警告 ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): initQueryCache()でURLがNon-nilであることを確認 ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): NegotiateでのYAML判定ロジック ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): ハンドラがnilかチェック ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): 英語ドキュメントへの壊れたリンクを修正 ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): ワイルドカードタイプのビルド失敗時にpanic情報の一貫性を保持 ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### ビルドプロセスの更新 / CI

* ci: CIワークフローにTrivy脆弱性スキャンを統合 ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: CI/CDでGo 1.25をサポート ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): github.com/bytedance/sonicをv1.13.2からv1.14.0にアップグレード ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: GitHub ActionsにGoバージョン1.24を追加 ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: Ginの最低Goバージョンを1.21に更新 ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): 新しいリンターを有効化 (testifylint、usestdlibvars、perfsprintなど) ([#4010](https://github.com/gin-gonic/gin/pull/4010)、[#4091](https://github.com/gin-gonic/gin/pull/4091)、[#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): ワークフローを更新しテストリクエストの一貫性を改善 ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### 依存関係の更新

* chore(deps): google.golang.org/protobufを1.36.6から1.36.9にバンプ ([#4346](https://github.com/gin-gonic/gin/pull/4346)、[#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): github.com/stretchr/testifyを1.10.0から1.11.1にバンプ ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): actions/setup-goを5から6にバンプ ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): github.com/quic-go/quic-goを0.53.0から0.54.0にバンプ ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): golang.org/x/netを0.33.0から0.38.0にバンプ ([#4178](https://github.com/gin-gonic/gin/pull/4178)、[#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): github.com/go-playground/validator/v10を10.20.0から10.22.1にバンプ ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### ドキュメントの更新

* docs(changelog): Gin v1.10.1のリリースノートを更新 ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: doc/doc.mdの英語文法の誤りと不自然な文構造を修正 ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: Gin v1.10.0のドキュメントとリリースノートを更新 ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: Ginクイックスタートのタイポを修正 ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: コメントとリンクの問題を修正 ([#4205](https://github.com/gin-gonic/gin/pull/4205)、[#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: ルートグループのサンプルコードを修正 ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): ポルトガル語ドキュメントを追加 ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): コメント内の関数名を修正 ([#4079](https://github.com/gin-gonic/gin/pull/4079))

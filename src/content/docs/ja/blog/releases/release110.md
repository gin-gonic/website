---
title: "Gin 1.10.0 がリリースされました"
linkTitle: "Gin 1.10.0 がリリースされました"
lastUpdated: 2024-05-07
---

### 変更履歴

#### 機能

  * [`5f458dd`](https://github.com/gin-gonic/gin/commit/5f458dd1a6d631f324e4af9a4f5429ffdf199342): feat(auth): プロキシサーバー認証を追加 ([#3877](https://github.com/gin-gonic/gin/pull/3877)) ([@EndlessParadox1](https://github.com/EndlessParadox1))
  * [`7a865dc`](https://github.com/gin-gonic/gin/commit/7a865dc): feat(bind): ShouldBindBodyWithのショートカットとドキュメント変更 ([#3871](https://github.com/gin-gonic/gin/pull/3871)) ([@RedCrazyGhost](https://github.com/RedCrazyGhost))
  * [`a182195`](https://github.com/gin-gonic/gin/commit/a182195): feat(binding): バインディングのカスタムBindUnmarshalerをサポート ([#3933](https://github.com/gin-gonic/gin/pull/3933)) ([@dkkb](https://github.com/dkkb))
  * [`fd1faad`](https://github.com/gin-gonic/gin/commit/fd1faad): feat(binding): デフォルトバインディング実装のオーバーライドをサポート ([#3514](https://github.com/gin-gonic/gin/pull/3514)) ([@ssfyn](https://github.com/ssfyn))
  * [`ac5e84d`](https://github.com/gin-gonic/gin/commit/ac5e84d): feat(engine): `OptionFunc`と`With`を追加 ([#3572](https://github.com/gin-gonic/gin/pull/3572)) ([@flc1125](https://github.com/flc1125))
  * [`c6ae2e6`](https://github.com/gin-gonic/gin/commit/c6ae2e6): feat(logger): ユーザー定義ロジックに基づくログスキップ機能 ([#3593](https://github.com/gin-gonic/gin/pull/3593)) ([@palvaneh](https://github.com/palvaneh))


#### バグ修正
  * [`d4e4136`](https://github.com/gin-gonic/gin/commit/d4e4136): "fix(uri): query binding bug ([#3236](https://github.com/gin-gonic/gin/pull/3236))"を取り消し ([#3899](https://github.com/gin-gonic/gin/pull/3899)) ([@appleboy](https://github.com/appleboy))
  * [`3dc1cd6`](https://github.com/gin-gonic/gin/commit/3dc1cd6): fix(binding): ファイル未アップロード時のバインディングエラー ([#3819](https://github.com/gin-gonic/gin/pull/3819)) ([#3820](https://github.com/gin-gonic/gin/pull/3820)) ([@clearcodecn](https://github.com/clearcodecn))
  * [`82bcd6d`](https://github.com/gin-gonic/gin/commit/82bcd6d): fix(binding): 構造体へのポインタのデリファレンス ([#3199](https://github.com/gin-gonic/gin/pull/3199)) ([@echovl](https://github.com/echovl))
  * [`2b1da2b`](https://github.com/gin-gonic/gin/commit/2b1da2b): fix(context): contextのValueメソッドをGo標準に準拠 ([#3897](https://github.com/gin-gonic/gin/pull/3897)) ([@FarmerChillax](https://github.com/FarmerChillax))
  * [`f70dd00`](https://github.com/gin-gonic/gin/commit/f70dd00): fix(engine): ユニットテストの修正 ([#3878](https://github.com/gin-gonic/gin/pull/3878)) ([@flc1125](https://github.com/flc1125))
  * [`86ff4a6`](https://github.com/gin-gonic/gin/commit/86ff4a6): fix(header): RFC 7231に準拠したヘッダーを許可 (HTTP 405) ([#3759](https://github.com/gin-gonic/gin/pull/3759)) ([@Crocmagnon](https://github.com/Crocmagnon))
  * [`09f8224`](https://github.com/gin-gonic/gin/commit/09f8224): fix(route): コンテキストコピーにfullPathを追加 ([#3784](https://github.com/gin-gonic/gin/pull/3784)) ([@KarthikReddyPuli](https://github.com/KarthikReddyPuli))
  * [`9f598a3`](https://github.com/gin-gonic/gin/commit/9f598a3): fix(router): catch-allの競合するワイルドカード ([#3812](https://github.com/gin-gonic/gin/pull/3812)) ([@FirePing32](https://github.com/FirePing32))
  * [`4a40f8f`](https://github.com/gin-gonic/gin/commit/4a40f8f): fix(sec): golang.org/x/cryptoを0.17.0にアップグレード ([#3832](https://github.com/gin-gonic/gin/pull/3832)) ([@chncaption](https://github.com/chncaption))
  * [`386d244`](https://github.com/gin-gonic/gin/commit/386d244): fix(tree): paramsの容量を正しく拡張 ([#3502](https://github.com/gin-gonic/gin/pull/3502)) ([@georgijd-form3](https://github.com/georgijd-form3))
  * [`8790d08`](https://github.com/gin-gonic/gin/commit/8790d08): fix(uri): クエリバインディングのバグ ([#3236](https://github.com/gin-gonic/gin/pull/3236)) ([@illiafox](https://github.com/illiafox))
  * [`44d0dd7`](https://github.com/gin-gonic/gin/commit/44d0dd7): fix: URLクエリパラメータのポインタサポートを追加 ([#3659](https://github.com/gin-gonic/gin/pull/3659)) ([#3666](https://github.com/gin-gonic/gin/pull/3666)) ([@omkar-foss](https://github.com/omkar-foss))
  * [`646312a`](https://github.com/gin-gonic/gin/commit/646312a): fix: Copyメソッド呼び出し時のContext.Keysマップを保護 ([#3873](https://github.com/gin-gonic/gin/pull/3873)) ([@kingcanfish](https://github.com/kingcanfish))


#### 機能強化
  * [`d4a6426`](https://github.com/gin-gonic/gin/commit/d4a6426): chore(CI): リリース引数を更新 ([#3595](https://github.com/gin-gonic/gin/pull/3595)) ([@qloog](https://github.com/qloog))
  * [`bb3519d`](https://github.com/gin-gonic/gin/commit/bb3519d): chore(IP): Fly.io用のTrustedPlatform定数を追加 ([#3839](https://github.com/gin-gonic/gin/pull/3839)) ([@ab](https://github.com/ab))
  * [`1b3c085`](https://github.com/gin-gonic/gin/commit/1b3c085): chore(debug): debugPrint文のオーバーライド機能を追加 ([#2337](https://github.com/gin-gonic/gin/pull/2337)) ([@josegonzalez](https://github.com/josegonzalez))
  * [`a64286a`](https://github.com/gin-gonic/gin/commit/a64286a): chore(deps): 依存関係を最新バージョンに更新 ([#3835](https://github.com/gin-gonic/gin/pull/3835)) ([@appleboy](https://github.com/appleboy))
  * [`9c61295`](https://github.com/gin-gonic/gin/commit/9c61295): chore(header): RFC 9512: application/yamlのサポートを追加 ([#3851](https://github.com/gin-gonic/gin/pull/3851)) ([@vincentbernat](https://github.com/vincentbernat))
  * [`a481ee2`](https://github.com/gin-gonic/gin/commit/a481ee2): chore(http): HTTP 1XXに白色を使用 ([#3741](https://github.com/gin-gonic/gin/pull/3741)) ([@viralparmarme](https://github.com/viralparmarme))
  * [`c964ad3`](https://github.com/gin-gonic/gin/commit/c964ad3): chore(optimize): Context構造体のShouldBindUriメソッドを最適化 ([#3911](https://github.com/gin-gonic/gin/pull/3911)) ([@1911860538](https://github.com/1911860538))
  * [`739d2d9`](https://github.com/gin-gonic/gin/commit/739d2d9): chore(perf): Context構造体のCopyメソッドを最適化 ([#3859](https://github.com/gin-gonic/gin/pull/3859)) ([@1911860538](https://github.com/1911860538))
  * [`3ea8bd9`](https://github.com/gin-gonic/gin/commit/3ea8bd9): chore(refactor): インターフェースチェック方法を変更 ([#3855](https://github.com/gin-gonic/gin/pull/3855)) ([@demoManito](https://github.com/demoManito))
  * [`ab8042e`](https://github.com/gin-gonic/gin/commit/ab8042e): chore(request): 読み取り前にリーダーがnilかチェック ([#3419](https://github.com/gin-gonic/gin/pull/3419)) ([@noahyao1024](https://github.com/noahyao1024))
  * [`0d9dbbb`](https://github.com/gin-gonic/gin/commit/0d9dbbb): chore(security): CVE-2024-24786のためProtobufをアップグレード ([#3893](https://github.com/gin-gonic/gin/pull/3893)) ([@Fotkurz](https://github.com/Fotkurz))
  * [`ecdbbbe`](https://github.com/gin-gonic/gin/commit/ecdbbbe): chore: CIをリファクタリングし依存関係を更新 ([#3848](https://github.com/gin-gonic/gin/pull/3848)) ([@appleboy](https://github.com/appleboy))
  * [`39089af`](https://github.com/gin-gonic/gin/commit/39089af): chore: 可読性のため設定ファイルをリファクタリング ([#3951](https://github.com/gin-gonic/gin/pull/3951)) ([@appleboy](https://github.com/appleboy))
  * [`160c173`](https://github.com/gin-gonic/gin/commit/160c173): chore: GitHub Actions設定を更新 ([#3792](https://github.com/gin-gonic/gin/pull/3792)) ([@appleboy](https://github.com/appleboy))
  * [`0397e5e`](https://github.com/gin-gonic/gin/commit/0397e5e): chore: 変更ログカテゴリの更新とドキュメント改善 ([#3917](https://github.com/gin-gonic/gin/pull/3917)) ([@appleboy](https://github.com/appleboy))
  * [`62b50cf`](https://github.com/gin-gonic/gin/commit/62b50cf): chore: 依存関係を最新バージョンに更新 ([#3694](https://github.com/gin-gonic/gin/pull/3694)) ([@appleboy](https://github.com/appleboy))
  * [`638aa19`](https://github.com/gin-gonic/gin/commit/638aa19): chore: 外部依存関係を最新バージョンに更新 ([#3950](https://github.com/gin-gonic/gin/pull/3950)) ([@appleboy](https://github.com/appleboy))
  * [`c6f90df`](https://github.com/gin-gonic/gin/commit/c6f90df): chore: 各種Go依存関係を最新バージョンに更新 ([#3901](https://github.com/gin-gonic/gin/pull/3901)) ([@appleboy](https://github.com/appleboy))

#### ビルドプロセスの更新
  * [`78f4687`](https://github.com/gin-gonic/gin/commit/78f4687): build(codecov): codecov設定を追加 ([#3891](https://github.com/gin-gonic/gin/pull/3891)) ([@flc1125](https://github.com/flc1125))
  * [`56dc72c`](https://github.com/gin-gonic/gin/commit/56dc72c): ci(Makefile): vetコマンドに.PHONYを追加 ([#3915](https://github.com/gin-gonic/gin/pull/3915)) ([@imalasong](https://github.com/imalasong))
  * [`8ab47c6`](https://github.com/gin-gonic/gin/commit/8ab47c6): ci(lint): 一貫性のためツールとワークフローを更新 ([#3834](https://github.com/gin-gonic/gin/pull/3834)) ([@appleboy](https://github.com/appleboy))
  * [`8acbe65`](https://github.com/gin-gonic/gin/commit/8acbe65): ci(release): 変更ログの正規表現パターンと除外をリファクタリング ([#3914](https://github.com/gin-gonic/gin/pull/3914)) ([@appleboy](https://github.com/appleboy))
  * [`000fdb3`](https://github.com/gin-gonic/gin/commit/000fdb3): ci(testing): go1.22バージョンを追加 ([#3842](https://github.com/gin-gonic/gin/pull/3842)) ([@appleboy](https://github.com/appleboy))


#### ドキュメントの更新
  * [`990c44a`](https://github.com/gin-gonic/gin/commit/990c44aebf20f0796d99051e53d6ee75b7ed52fb): docs(context): BindWithに非推奨コメントを追加 ([#3880](https://github.com/gin-gonic/gin/pull/3880)) ([@flc1125](https://github.com/flc1125))
  * [`861ffb9`](https://github.com/gin-gonic/gin/commit/861ffb9181dc811dc5d76fc450b36d3e68850b95): docs(middleware): `BasicAuthForProxy`関数のコメント ([#3881](https://github.com/gin-gonic/gin/pull/3881)) ([@EndlessParadox1](https://github.com/EndlessParadox1))
  * [`ee70b30`](https://github.com/gin-gonic/gin/commit/ee70b30a97205ac1f32889f41d8a494b3b2c81a5): docs: 定数`AuthProxyUserKey`と`BasicAuthForProxy`のドキュメントを追加 ([#3887](https://github.com/gin-gonic/gin/pull/3887)) ([@EndlessParadox1](https://github.com/EndlessParadox1))
  * [`f75144a`](https://github.com/gin-gonic/gin/commit/f75144a356e57c95bd21a048f0a40492dcdb33c5): docs: コメントのタイポを修正 ([#3868](https://github.com/gin-gonic/gin/pull/3868)) ([@testwill](https://github.com/testwill))
  * [`83fc767`](https://github.com/gin-gonic/gin/commit/83fc7673f9797b4c7d8d1c41b94e9922303e6275): docs: 関数ドキュメントのタイポを修正 ([#3872](https://github.com/gin-gonic/gin/pull/3872)) ([@TotomiEcio](https://github.com/TotomiEcio))
  * [`49f45a5`](https://github.com/gin-gonic/gin/commit/49f45a542719df661bd71dd48f1595f0bc1ff6f7): docs: 冗長なコメントを削除 ([#3765](https://github.com/gin-gonic/gin/pull/3765)) ([@WeiTheShinobi](https://github.com/WeiTheShinobi))
  * [`75ccf94`](https://github.com/gin-gonic/gin/commit/75ccf94d605a05fe24817fc2f166f6f2959d5cea): feat: バージョン定数をv1.10.0に更新 ([#3952](https://github.com/gin-gonic/gin/pull/3952)) ([@appleboy](https://github.com/appleboy))

#### その他
  * [`02e754b`](https://github.com/gin-gonic/gin/commit/02e754be9c4889f7ee56db0660cc611eb82b61d6): golang.org/x/netをv0.13.0にアップグレード ([#3684](https://github.com/gin-gonic/gin/pull/3684)) ([@cpcf](https://github.com/cpcf))
  * [`97eab7d`](https://github.com/gin-gonic/gin/commit/97eab7d09a8b048cab4a3d8ebd6c0ea78284c716): test(git): gitignoreに開発ツールを追加 ([#3370](https://github.com/gin-gonic/gin/pull/3370)) ([@demoManito](https://github.com/demoManito))
  * [`ae15646`](https://github.com/gin-gonic/gin/commit/ae15646aba14cd8245fbebd263cc7740c6789ef3): test(http): 数値リテラルの代わりに定数を使用 ([#3863](https://github.com/gin-gonic/gin/pull/3863)) ([@testwill](https://github.com/testwill))
  * [`fd60a24`](https://github.com/gin-gonic/gin/commit/fd60a24ab76c3c92955ba253c1f7eda9e4981c3c): test(path): ユニットテスト実行結果を最適化 ([#3883](https://github.com/gin-gonic/gin/pull/3883)) ([@flc1125](https://github.com/flc1125))
  * [`bb2d8cf`](https://github.com/gin-gonic/gin/commit/bb2d8cf486bde2dc69bf05ea917095260ac13723): test(render): ユニットテストカバレッジを拡大 ([#3691](https://github.com/gin-gonic/gin/pull/3691)) ([@araujo88](https://github.com/araujo88))

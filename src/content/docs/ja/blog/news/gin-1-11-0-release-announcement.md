---
title: "Gin 1.11.0リリース！HTTP/3、フォーム機能改善、パフォーマンス向上など"
linkTitle: "Gin 1.11.0リリース発表"
lastUpdated: 2025-09-21
---

## Gin v1.11.0が登場

人気のGo WebフレームワークGinの新バージョン1.11.0が、数々の新機能、パフォーマンス改善、バグ修正を携えてリリースされました。今回のリリースも、Ginの高速性・柔軟性・モダン開発の追求が反映されています。

### 🌟 主な新機能

- **実験的HTTP/3対応:** Ginは[quic-go](https://github.com/quic-go/quic-go)経由で実験的にHTTP/3をサポート！最新のWebプロトコルを試したい方はぜひ。([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **フォームバインディングの強化:**
  - フォームでの配列コレクション形式に対応 ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - フォームタグの文字列sliceカスタムアンマーシャル対応 ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - コレクションのデフォルト値対応 ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **バインディング型の拡張:** 新たに`BindPlain`でプレーンテキストを簡単にバインディング ([#3904](https://github.com/gin-gonic/gin/pull/3904))、unixMilli・unixMicro形式もサポート ([#4190](https://github.com/gin-gonic/gin/pull/4190))。

- **Context APIの改善:** `GetXxx`がGoネイティブ型の取得にさらに対応し、型安全なデータ取り扱いが容易に ([#3633](https://github.com/gin-gonic/gin/pull/3633))。

- **ファイルシステム拡張:** 新しい `OnlyFilesFS` がエクスポートされ、テスト・ドキュメントも充実 ([#3939](https://github.com/gin-gonic/gin/pull/3939))。

### 🚀 パフォーマンス＆強化

- **フォームデータのより高速な処理:** フォーム解析が内部で最適化され、処理性能が向上 ([#4339](https://github.com/gin-gonic/gin/pull/4339))。
- コア・レンダリング・Contextロジックのリファクタリング、堅牢性と明瞭さ向上（[PR一覧はchangelog参照](../releases/release111.md)）。

### 🐛 バグ修正

- **ミドルウェアの信頼性向上:** まれなミドルウェア再エントリ問題が修正されました ([#3987](https://github.com/gin-gonic/gin/pull/3987))。
- TOMLフォームバインディングの安定性向上 ([#4193](https://github.com/gin-gonic/gin/pull/4193))。
- 空のツリー上での“method not allowed”リクエストでpanicしなくなりました ([#4003](https://github.com/gin-gonic/gin/pull/4003))。
- Context競合や各種安定性も着実に改善。

### 🔧 ビルド・依存関係・CIの更新

- CI/CDで**Go 1.25**サポート、より厳格なコード品質lintersの追加 ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010))。
- CIにTrivy脆弱性スキャンを統合 ([#4359](https://github.com/gin-gonic/gin/pull/4359))。
- sonic、setup-go、quic-goなど依存パッケージのアップデートも多数。

### 📖 ドキュメント更新

- ドキュメント拡充、changelog更新、サンプルや文法改善、新たにポルトガル語版も追加 ([#4078](https://github.com/gin-gonic/gin/pull/4078))。

---

Gin 1.11.0はコミュニティの活力と継続的な開発の証です。全てのコントリビューター、バグ報告者、そしてユーザーの皆さまに感謝します。Ginを現代Web開発の最前線で活かしてくださり、ありがとうございます。

Gin 1.11.0をぜひお試しください！[GitHubでアップグレード](https://github.com/gin-gonic/gin/releases/tag/v1.11.0)。フィードバックもお待ちしています。

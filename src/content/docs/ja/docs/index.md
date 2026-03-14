---
title: "ドキュメント"
sidebar:
  order: 20
---

Ginは[Go](https://go.dev/)で書かれた高性能HTTPウェブフレームワークです。Martiniに似たAPIを提供しますが、[httprouter](https://github.com/julienschmidt/httprouter)のおかげで最大40倍高速という大幅なパフォーマンス向上を実現しています。GinはREST API、Webアプリケーション、マイクロサービスなど、速度と開発者の生産性が重要な場面向けに設計されています。

**なぜGinを選ぶのか？**

GinはExpress.jsスタイルのルーティングのシンプルさとGoのパフォーマンス特性を組み合わせており、以下の用途に最適です：

- 高スループットのREST APIの構築
- 多数の同時リクエストを処理するマイクロサービスの開発
- 高速な応答時間が求められるWebアプリケーションの作成
- 最小限のボイラープレートでWebサービスを素早くプロトタイピング

**Ginの主な機能：**

- **ゼロアロケーションルーター** - ヒープアロケーションなしの極めてメモリ効率の良いルーティング
- **高性能** - ベンチマークで他のGoウェブフレームワークを上回る速度を実証
- **ミドルウェアサポート** - 認証、ロギング、CORSなどの拡張可能なミドルウェアシステム
- **クラッシュフリー** - 組み込みのリカバリミドルウェアがpanicによるサーバーのクラッシュを防止
- **JSONバリデーション** - リクエスト/レスポンスの自動JSONバインディングとバリデーション
- **ルートグルーピング** - 関連するルートの整理と共通ミドルウェアの適用
- **エラー管理** - 一元的なエラーハンドリングとロギング
- **組み込みレンダリング** - JSON、XML、HTMLテンプレートなどのサポート
- **拡張可能** - コミュニティミドルウェアとプラグインの豊富なエコシステム

## はじめに

### 前提条件

- **Goバージョン**: Ginには[Go](https://go.dev/)バージョン[1.25](https://go.dev/doc/devel/release#go1.25)以上が必要です
- **基本的なGoの知識**: Goの構文とパッケージ管理に精通していると役立ちます

### インストール

[Goのモジュールサポート](https://go.dev/wiki/Modules#how-to-use-modules)を使用して、コード内でGinをインポートするだけで、ビルド時にGoが自動的にフェッチします：

```go
import "github.com/gin-gonic/gin"
```

### 最初のGinアプリケーション

Ginのシンプルさを示す完全な例を紹介します：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // デフォルトミドルウェア（loggerとrecovery）を含むGinルーターを作成
  r := gin.Default()

  // シンプルなGETエンドポイントを定義
  r.GET("/ping", func(c *gin.Context) {
    // JSONレスポンスを返す
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  // ポート8080でサーバーを起動（デフォルト）
  // サーバーは0.0.0.0:8080でリッスンします（Windowsではlocalhost:8080）
  r.Run()
}
```

**アプリケーションの実行：**

1. 上記のコードを`main.go`として保存します
2. アプリケーションを実行します：

   ```sh
   go run main.go
   ```

3. ブラウザを開いて[`http://localhost:8080/ping`](http://localhost:8080/ping)にアクセスします
4. `{"message":"pong"}`と表示されるはずです

**この例で示していること：**

- デフォルトミドルウェアを含むGinルーターの作成
- シンプルなハンドラ関数によるHTTPエンドポイントの定義
- JSONレスポンスの返却
- HTTPサーバーの起動

### 次のステップ

最初のGinアプリケーションを実行した後、以下のリソースでさらに学びましょう：

#### 学習リソース

- **[Ginクイックスタートガイド](./quickstart/)** - APIの例とビルド設定を含む包括的なチュートリアル
- **[サンプルリポジトリ](https://github.com/gin-gonic/examples)** - さまざまなGinのユースケースを示すすぐに実行できる例：
  - REST API開発
  - 認証とミドルウェア
  - ファイルのアップロードとダウンロード
  - WebSocket接続
  - テンプレートレンダリング

### 公式チュートリアル

- [Go.devチュートリアル：GoとGinでRESTful APIを開発する](https://go.dev/doc/tutorial/web-service-gin)

## ミドルウェアエコシステム

Ginには、一般的なWeb開発ニーズに対応するミドルウェアの豊富なエコシステムがあります。コミュニティが提供するミドルウェアをご覧ください：

- **[gin-contrib](https://github.com/gin-contrib)** - 公式ミドルウェアコレクション：
  - 認証（JWT、Basic Auth、セッション）
  - CORS、レート制限、圧縮
  - ロギング、メトリクス、トレーシング
  - 静的ファイル配信、テンプレートエンジン

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - その他のコミュニティミドルウェア

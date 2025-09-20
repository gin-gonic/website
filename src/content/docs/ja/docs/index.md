---
title: "ドキュメント"
sidebar:
  order: 20
---

Ginは [Go](https://go.dev/) で書かれた高性能なHTTP Webフレームワークです。[httprouter](https://github.com/julienschmidt/httprouter) の採用により、Martiniに似たAPIを提供しながら、パフォーマンスは最大40倍高速です。GinはREST API、ウェブアプリケーション、マイクロサービスの開発で、高速性と開発効率を重視するシナリオに最適です。

**Ginを選ぶ理由**

GinはExpress.js風ルーティングのシンプルさとGoの高性能を組み合わせ、次の用途に理想的です：

- 高スループットなREST API構築
- 多数の同時リクエストを捌くマイクロサービス開発
- 高速レスポンスが要求されるウェブアプリ
- 最小限のボイラープレートで素早くサービスを試作

**Ginの主な特徴：**

- **メモリ割り当てゼロのルーター** - ヒープ割り当てなしで極めてメモリ効率の良いルーティング
- **高パフォーマンス** - Go製他フレームワークと比較したベンチマークで圧倒的な速度
- **ミドルウェア対応** - 認証、ログ、CORSなど拡張可能なミドルウェアシステム
- **クラッシュ防止** - 内蔵リカバリーによる安全な運用
- **JSONバリデーション** - リクエスト／レスポンスの自動バインディングと検証
- **ルートグループ化** - 関連するルートの整理と共通ミドルウェア適用
- **エラー管理** - 集中管理によるエラーロギングとハンドリング
- **レンダリング機能** - JSON, XML, HTMLテンプレート等対応
- **拡張性** - 豊富なコミュニティミドルウェア・プラグイン

## はじめに

### 必要条件

- **Goバージョン:** Ginは [Go](https://go.dev/) バージョン [1.23](https://go.dev/doc/devel/release#go1.23.0) 以上が必要です
- **Goの基本知識:** Goの文法とパッケージ管理に慣れていると役立ちます

### インストール

[Goモジュール](https://go.dev/wiki/Modules#how-to-use-modules)対応環境なら、コードでGinをimportすればビルド時に自動取得されます：

```go
import "github.com/gin-gonic/gin"
```

### Ginアプリを作ってみる

下記はGinのシンプルさを示すサンプルです：

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // loggerとrecoveryミドルウェア付きGinルーター作成
  r := gin.Default()
  
  // 簡単なGETエンドポイント定義
  r.GET("/ping", func(c *gin.Context) {
    // JSONレスポンスを返す
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // ポート8080でサーバー起動（デフォルト）
  // 0.0.0.0:8080（Windowsではlocalhost:8080）で待機
  r.Run()
}
```

**アプリケーションの実行方法：**

1. 上記コードを `main.go` として保存
2. アプリケーションを起動：

   ```sh
   go run main.go
   ```

3. ブラウザで [`http://localhost:8080/ping`](http://localhost:8080/ping) を開く
4. 次の表示が出ます： `{"message":"pong"}`

**このサンプルで学べること：**

- デフォルトミドルウェア付きGinルーターの作成
- シンプルなハンドラ関数でHTTPエンドポイントを定義
- JSONレスポンスの返却
- HTTPサーバーの起動

### 次のステップ

Ginでアプリを動かした後は、以下のリソースで学びを深めましょう：

#### 📚 学習リソース

- **[Ginクイックスタートガイド](./quickstart/)** – API例やビルド設定など網羅的なチュートリアル
- **[サンプルリポジトリ](https://github.com/gin-gonic/examples)** – 様々なGinユースケースを示す実行例が多数：
  - REST API開発
  - 認証&ミドルウェア
  - ファイルアップ／ダウンロード
  - WebSocket通信
  - テンプレートレンダリング

### 公式チュートリアル

- [Go.dev: GinでRESTful APIを開発するチュートリアル](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 ミドルウェアエコシステム

Ginには充実したコミュニティ製ミドルウェアが揃っています。主なミドルウェアは下記で探せます：

- **[gin-contrib](https://github.com/gin-contrib)** – 公式のミドルウェアコレクション。内容例：
  - 認証（JWT, Basic認証, セッション）
  - CORS, レート制限, 圧縮
  - ログ, メトリクス, トレーシング
  - 静的ファイル配信, テンプレートエンジン

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** – 追加のコミュニティ製ミドルウェア

---
title: "FAQ"
sidebar:
  order: 9
---

## 一般的な質問

### 開発中にライブリロードを有効にするには？

[Air](https://github.com/cosmtrek/air) を使用して、開発中の自動ライブリロードを実現します。Air はファイルを監視し、変更が検出されるとアプリケーションを自動的に再ビルド/再起動します。

**インストール：**

```sh
# Air をグローバルにインストール
go install github.com/cosmtrek/air@latest
```

**セットアップ：**

プロジェクトルートに `.air.toml` 設定ファイルを作成します：

```sh
air init
```

これによりデフォルト設定が生成されます。Gin プロジェクト用にカスタマイズできます：

```toml
# .air.toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
  keep_scroll = true
```

**使用方法：**

プロジェクトディレクトリで `go run` の代わりに `air` を実行します：

```sh
air
```

Air は `.go` ファイルを監視し、変更時に Gin アプリケーションを自動的に再ビルド/再起動します。

### Gin で CORS を処理するには？

公式の [gin-contrib/cors](https://github.com/gin-contrib/cors) ミドルウェアを使用します：

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // デフォルトの CORS 設定
  r.Use(cors.Default())

  // または CORS 設定をカスタマイズ
  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

### 静的ファイルを提供するには？

`Static()` または `StaticFS()` を使用して静的ファイルを提供します：

```go
func main() {
  r := gin.Default()

  // /assets/* パスで ./assets ディレクトリのファイルを提供
  r.Static("/assets", "./assets")

  // 単一ファイルを提供
  r.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // 埋め込みファイルシステムから提供（Go 1.16+）
  r.StaticFS("/public", http.FS(embedFS))

  r.Run()
}
```

詳細は[静的ファイル提供の例](../examples/serving-static-files/)を参照してください。

### ファイルアップロードを処理するには？

単一ファイルには `FormFile()` を、複数ファイルには `MultipartForm()` を使用します：

```go
// 単一ファイルアップロード
r.POST("/upload", func(c *gin.Context) {
  file, _ := c.FormFile("file")

  // ファイルを保存
  c.SaveUploadedFile(file, "./uploads/"+file.Filename)

  c.String(200, "ファイル %s が正常にアップロードされました", file.Filename)
})

// 複数ファイルアップロード
r.POST("/upload-multiple", func(c *gin.Context) {
  form, _ := c.MultipartForm()
  files := form.File["files"]

  for _, file := range files {
    c.SaveUploadedFile(file, "./uploads/"+file.Filename)
  }

  c.String(200, "%d 個のファイルがアップロードされました", len(files))
})
```

詳細は[ファイルアップロードの例](../examples/upload-file/)を参照してください。

### JWT で認証を実装するには？

[gin-contrib/jwt](https://github.com/gin-contrib/jwt) を使用するか、カスタムミドルウェアを実装します：

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key")

type Claims struct {
  Username string `json:"username"`
  jwt.RegisteredClaims
}

func GenerateToken(username string) (string, error) {
  claims := Claims{
    Username: username,
    RegisteredClaims: jwt.RegisteredClaims{
      ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
      IssuedAt:  jwt.NewNumericDate(time.Now()),
    },
  }

  token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
  return token.SignedString(jwtSecret)
}

func AuthMiddleware() gin.HandlerFunc {
  return func(c *gin.Context) {
    tokenString := c.GetHeader("Authorization")
    if tokenString == "" {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "認証トークンがありません"})
      c.Abort()
      return
    }

    // "Bearer " プレフィックスを削除（存在する場合）
    if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
      tokenString = tokenString[7:]
    }

    token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
      return jwtSecret, nil
    })

    if err != nil || !token.Valid {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "無効なトークン"})
      c.Abort()
      return
    }

    if claims, ok := token.Claims.(*Claims); ok {
      c.Set("username", claims.Username)
      c.Next()
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "無効なトークンクレーム"})
      c.Abort()
    }
  }
}

func main() {
  r := gin.Default()

  r.POST("/login", func(c *gin.Context) {
    var credentials struct {
      Username string `json:"username"`
      Password string `json:"password"`
    }

    if err := c.BindJSON(&credentials); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    // 認証情報を検証（独自のロジックを実装）
    if credentials.Username == "admin" && credentials.Password == "password" {
      token, _ := GenerateToken(credentials.Username)
      c.JSON(http.StatusOK, gin.H{"token": token})
    } else {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "無効な認証情報"})
    }
  })

  // 保護されたルート
  authorized := r.Group("/")
  authorized.Use(AuthMiddleware())
  {
    authorized.GET("/profile", func(c *gin.Context) {
      username := c.MustGet("username").(string)
      c.JSON(http.StatusOK, gin.H{"username": username})
    })
  }

  r.Run()
}
```

### リクエストログを設定するには？

Gin にはデフォルトのロガーミドルウェアが含まれています。カスタマイズするか、構造化ロギングを使用します：

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

// カスタムロガーミドルウェア
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()
    path := c.Request.URL.Path

    c.Next()

    latency := time.Since(start)
    statusCode := c.Writer.Status()
    clientIP := c.ClientIP()
    method := c.Request.Method

    log.Printf("[GIN] %s | %3d | %13v | %15s | %-7s %s",
      time.Now().Format("2006/01/02 - 15:04:05"),
      statusCode,
      latency,
      clientIP,
      method,
      path,
    )
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())
  r.Use(gin.Recovery())

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })

  r.Run()
}
```

より高度なロギングについては、[カスタムログフォーマットの例](../examples/custom-log-format/)を参照してください。

### グレースフルシャットダウンを処理するには？

接続を適切に閉じるためにグレースフルシャットダウンを実装します：

```go
package main

import (
  "context"
  "log"
  "net/http"
  "os"
  "os/signal"
  "syscall"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    time.Sleep(5 * time.Second)
    c.String(http.StatusOK, "ようこそ！")
  })

  srv := &http.Server{
    Addr:    ":8080",
    Handler: r,
  }

  // goroutine でサーバーを実行
  go func() {
    if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
      log.Fatalf("リッスン: %s\n", err)
    }
  }()

  // サーバーをグレースフルにシャットダウンするための割り込みシグナルを待機
  quit := make(chan os.Signal, 1)
  signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
  <-quit
  log.Println("サーバーをシャットダウンしています...")

  // 未完了のリクエストに 5 秒間の猶予を与える
  ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
  defer cancel()

  if err := srv.Shutdown(ctx); err != nil {
    log.Fatal("サーバーの強制シャットダウン:", err)
  }

  log.Println("サーバーが終了しました")
}
```

詳細は[グレースフルリスタートまたは停止の例](../examples/graceful-restart-or-stop/)を参照してください。

### なぜ「405 Method Not Allowed」ではなく「404 Not Found」が返されるのですか？

デフォルトでは、Gin はリクエストされた HTTP メソッドをサポートしていないルートに対して 404 を返します。405 Method Not Allowed を返すには、`HandleMethodNotAllowed` オプションを有効にします。

詳細は [Method Not Allowed FAQ](./method-not-allowed/) を参照してください。

### クエリパラメータと POST データを同時にバインドするには？

`ShouldBind()` を使用します。コンテンツタイプに基づいて自動的にバインディングを選択します：

```go
type User struct {
  Name  string `form:"name" json:"name"`
  Email string `form:"email" json:"email"`
  Page  int    `form:"page"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  // クエリパラメータとリクエストボディ（JSON/フォーム）をバインド
  if err := c.ShouldBind(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, user)
})
```

より詳細な制御については、[クエリまたは POST のバインドの例](../examples/bind-query-or-post/)を参照してください。

### リクエストデータを検証するには？

Gin は検証に [go-playground/validator](https://github.com/go-playground/validator) を使用します。構造体にバリデーションタグを追加します：

```go
type User struct {
  Name  string `json:"name" binding:"required,min=3,max=50"`
  Email string `json:"email" binding:"required,email"`
  Age   int    `json:"age" binding:"gte=0,lte=130"`
}

r.POST("/user", func(c *gin.Context) {
  var user User
  if err := c.ShouldBindJSON(&user); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  c.JSON(200, gin.H{"message": "ユーザーは有効です"})
})
```

カスタムバリデータについては、[カスタムバリデータの例](../examples/custom-validators/)を参照してください。

### 本番モードで Gin を実行するには？

`GIN_MODE` 環境変数を `release` に設定します：

```sh
export GIN_MODE=release
# または
GIN_MODE=release ./your-app
```

またはプログラムで設定します：

```go
gin.SetMode(gin.ReleaseMode)
```

リリースモード：

- デバッグログを無効化
- パフォーマンスを向上
- バイナリサイズをわずかに削減

### Gin でデータベース接続を処理するには？

依存性注入またはコンテキストを使用してデータベース接続を共有します：

```go
package main

import (
  "database/sql"

  "github.com/gin-gonic/gin"
  _ "github.com/lib/pq"
)

func main() {
  db, err := sql.Open("postgres", "postgres://user:pass@localhost/dbname")
  if err != nil {
    panic(err)
  }
  defer db.Close()

  r := gin.Default()

  // 方法 1：db をハンドラに渡す
  r.GET("/users", func(c *gin.Context) {
    var users []string
    rows, _ := db.Query("SELECT name FROM users")
    defer rows.Close()

    for rows.Next() {
      var name string
      rows.Scan(&name)
      users = append(users, name)
    }

    c.JSON(200, users)
  })

  // 方法 2：ミドルウェアを使用して db を注入
  r.Use(func(c *gin.Context) {
    c.Set("db", db)
    c.Next()
  })

  r.Run()
}
```

ORM については、Gin と [GORM](https://gorm.io/) の併用を検討してください。

### Gin ハンドラをテストするには？

`net/http/httptest` を使用してルートをテストします：

```go
package main

import (
  "net/http"
  "net/http/httptest"
  "testing"

  "github.com/gin-gonic/gin"
  "github.com/stretchr/testify/assert"
)

func SetupRouter() *gin.Engine {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "pong"})
  })
  return r
}

func TestPingRoute(t *testing.T) {
  router := SetupRouter()

  w := httptest.NewRecorder()
  req, _ := http.NewRequest("GET", "/ping", nil)
  router.ServeHTTP(w, req)

  assert.Equal(t, 200, w.Code)
  assert.Contains(t, w.Body.String(), "pong")
}
```

その他の例については、[テストドキュメント](../testing/)を参照してください。

## パフォーマンスに関する質問

### 高トラフィック向けに Gin を最適化するには？

1. **リリースモードを使用**：`GIN_MODE=release` を設定
2. **不要なミドルウェアを無効化**：必要なものだけを使用
3. **ミドルウェアを手動で制御したい場合は `gin.Default()` の代わりに `gin.New()` を使用**
4. **コネクションプーリング**：データベースコネクションプールを適切に設定
5. **キャッシュ**：頻繁にアクセスされるデータのキャッシュを実装
6. **ロードバランシング**：リバースプロキシ（nginx、HAProxy）を使用
7. **プロファイリング**：Go の pprof を使用してボトルネックを特定

```go
r := gin.New()
r.Use(gin.Recovery()) // recovery ミドルウェアのみ使用

// コネクションプールの制限を設定
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
```

### Gin は本番環境で使用できますか？

はい！Gin は多くの企業で本番環境で使用されており、大規模で実戦テストされています。最も人気のある Go Web フレームワークの 1 つであり、以下の特徴があります：

- アクティブなメンテナンスとコミュニティ
- 豊富なミドルウェアエコシステム
- 優れたパフォーマンスベンチマーク
- 強力な後方互換性

## トラブルシューティング

### ルートパラメータが機能しないのはなぜですか？

ルートパラメータが `:` 構文を使用し、正しく抽出されていることを確認します：

```go
// 正しい
r.GET("/user/:id", func(c *gin.Context) {
  id := c.Param("id")
  c.String(200, "ユーザー ID: %s", id)
})

// 間違い：/user/{id} または /user/<id>
```

### ミドルウェアが実行されないのはなぜですか？

ミドルウェアはルートまたはルートグループの前に登録する必要があります：

```go
// 正しい順序
r := gin.New()
r.Use(MyMiddleware()) // 最初にミドルウェアを登録
r.GET("/ping", handler) // 次にルート

// ルートグループの場合
auth := r.Group("/admin")
auth.Use(AuthMiddleware()) // このグループのミドルウェア
{
  auth.GET("/dashboard", handler)
}
```

### リクエストバインディングが失敗するのはなぜですか？

一般的な理由：

1. **バインディングタグの欠落**：`json:"field"` または `form:"field"` タグを追加
2. **Content-Type の不一致**：クライアントが正しい Content-Type ヘッダーを送信していることを確認
3. **バリデーションエラー**：バリデーションタグと要件を確認
4. **エクスポートされていないフィールド**：エクスポートされた（大文字で始まる）構造体フィールドのみがバインドされます

```go
type User struct {
  Name  string `json:"name" binding:"required"` // ✓ 正しい
  Email string `json:"email"`                    // ✓ 正しい
  age   int    `json:"age"`                      // ✗ バインドされない（エクスポートされていない）
}
```

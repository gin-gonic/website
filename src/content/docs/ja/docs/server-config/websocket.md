---
title: "WebSocketサポート"
sidebar:
  order: 9
---

Ginには組み込みのWebSocket実装はありませんが、[gorilla/websocket](https://github.com/gorilla/websocket)パッケージとシームレスに統合できます。Ginハンドラは基盤となる`http.ResponseWriter`と`*http.Request`を受け取るため、最小限の労力でGinのルートをWebSocket接続にアップグレードできます。

## インストール

`gorilla/websocket`パッケージをインストールします：

```bash
go get github.com/gorilla/websocket
```

## 基本的なエコーサーバー

最もシンプルなWebSocketサーバーは、クライアントからメッセージを読み取ってエコーバックします。これはアップグレードプロセスを理解するための良い出発点です。

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
  // Allow all origins for development; restrict this in production.
  CheckOrigin: func(r *http.Request) bool {
    return true
  },
}

func handleWebSocket(c *gin.Context) {
  conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
  if err != nil {
    log.Printf("WebSocket upgrade error: %v", err)
    return
  }
  defer conn.Close()

  for {
    messageType, message, err := conn.ReadMessage()
    if err != nil {
      log.Printf("Read error: %v", err)
      break
    }
    log.Printf("Received: %s", message)

    if err := conn.WriteMessage(messageType, message); err != nil {
      log.Printf("Write error: %v", err)
      break
    }
  }
}

func main() {
  router := gin.Default()
  router.GET("/ws", handleWebSocket)
  router.Run(":8080")
}
```

## チャットブロードキャストの例

より実践的な例：すべての接続クライアントに受信メッセージをブロードキャストするシンプルなチャットサーバー。

```go
package main

import (
  "log"
  "net/http"
  "sync"

  "github.com/gin-gonic/gin"
  "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
  CheckOrigin: func(r *http.Request) bool {
    return true
  },
}

type Hub struct {
  mu      sync.RWMutex
  clients map[*websocket.Conn]bool
}

func newHub() *Hub {
  return &Hub{
    clients: make(map[*websocket.Conn]bool),
  }
}

func (h *Hub) addClient(conn *websocket.Conn) {
  h.mu.Lock()
  defer h.mu.Unlock()
  h.clients[conn] = true
}

func (h *Hub) removeClient(conn *websocket.Conn) {
  h.mu.Lock()
  defer h.mu.Unlock()
  delete(h.clients, conn)
  conn.Close()
}

func (h *Hub) broadcast(messageType int, message []byte) {
  h.mu.RLock()
  defer h.mu.RUnlock()
  for conn := range h.clients {
    if err := conn.WriteMessage(messageType, message); err != nil {
      log.Printf("Broadcast error: %v", err)
    }
  }
}

func main() {
  hub := newHub()
  router := gin.Default()

  router.GET("/ws", func(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
      log.Printf("Upgrade error: %v", err)
      return
    }
    hub.addClient(conn)
    defer hub.removeClient(conn)

    for {
      messageType, message, err := conn.ReadMessage()
      if err != nil {
        log.Printf("Read error: %v", err)
        break
      }
      hub.broadcast(messageType, message)
    }
  })

  router.Run(":8080")
}
```

> **Note:** The broadcast example above writes to multiple connections while holding a read lock. For production use, consider sending messages through a channel per client to avoid blocking the broadcast loop on a slow connection. See the [gorilla/websocket chat example](https://github.com/gorilla/websocket/tree/main/examples/chat) for a production-ready pattern.

## 接続アップグレードと設定

`websocket.Upgrader`はHTTP接続がWebSocketにアップグレードされる方法を制御します。主要なフィールド：

```go
var upgrader = websocket.Upgrader{
  // ReadBufferSize and WriteBufferSize specify the I/O buffer sizes in bytes.
  // The default (4096) works for most use cases. Increase them for large messages.
  ReadBufferSize:  1024,
  WriteBufferSize: 1024,

  // CheckOrigin controls whether the request Origin header is acceptable.
  // By default it rejects cross-origin requests. Override it for CORS support.
  CheckOrigin: func(r *http.Request) bool {
    origin := r.Header.Get("Origin")
    return origin == "https://your-app.example.com"
  },

  // Subprotocols specifies the server's supported protocols in order of preference.
  Subprotocols: []string{"graphql-ws", "graphql-transport-ws"},
}
```

You can also set response headers during the upgrade:

```go
func handleWebSocket(c *gin.Context) {
  responseHeader := http.Header{}
  responseHeader.Set("X-Custom-Header", "value")

  conn, err := upgrader.Upgrade(c.Writer, c.Request, responseHeader)
  if err != nil {
    log.Printf("Upgrade error: %v", err)
    return
  }
  defer conn.Close()
  // ...
}
```

## ベストプラクティス

### 接続ヘルスのためのPing/Pong

WebSocket接続はサイレントに古くなることがあります。ping/pongフレームを使用して切断された接続を検出します：

```go
import "time"

const (
  pongWait   = 60 * time.Second
  pingPeriod = (pongWait * 9) / 10 // must be less than pongWait
)

func handleWebSocket(c *gin.Context) {
  conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
  if err != nil {
    return
  }
  defer conn.Close()

  conn.SetReadDeadline(time.Now().Add(pongWait))
  conn.SetPongHandler(func(string) error {
    conn.SetReadDeadline(time.Now().Add(pongWait))
    return nil
  })

  // Start a goroutine to send pings.
  go func() {
    ticker := time.NewTicker(pingPeriod)
    defer ticker.Stop()
    for range ticker.C {
      if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
        return
      }
    }
  }()

  // Read loop
  for {
    _, message, err := conn.ReadMessage()
    if err != nil {
      break
    }
    log.Printf("Received: %s", message)
  }
}
```

### 接続のクリーンアップ

完了時に常に接続を閉じてリソースを解放してください：

- アップグレード成功後すぐに`defer conn.Close()`を使用します。
- 読み取りループが終了したら、共有データ構造（チャットの例のhubなど）から接続を削除します。
- アイドル接続からのゴルーチンリークを防ぐため、読み取りと書き込みのデッドラインを設定します。

### 並行書き込み

`gorilla/websocket`パッケージは単一の接続への並行書き込みをサポート**していません**。複数のゴルーチンが書き込む必要がある場合、以下のアプローチのいずれかでアクセスをシリアライズします：

- **Mutex：** `sync.Mutex`で書き込みを保護します。
- **チャネル：** すべての送信メッセージを1つのライターゴルーチンが消費する単一のチャネルに集約します。

チャネルアプローチは、バックプレッシャーを自然に処理し、書き込みロジックを一箇所に保つため、一般的に好まれます。

## テスト

### wscatの使用

[wscat](https://github.com/websockets/wscat)はコマンドラインWebSocketクライアントです。npmでインストールします：

```bash
npm install -g wscat
```

サーバーに接続します：

```bash
wscat -c ws://localhost:8080/ws
```

メッセージを入力してEnterを押してください。エコーサーバーがそれを返送します。

### curlの使用

curl 7.86以降はWebSocketをサポートしています。エコーサーバーにメッセージを送信します：

```bash
curl --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Version: 13" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://localhost:8080/ws
```

> インタラクティブなテストには、WebSocketフレーミングプロトコルを自動的に処理するため、curlよりも`wscat`の方が便利です。

## 関連項目

- [gorilla/websocket documentation](https://pkg.go.dev/github.com/gorilla/websocket)
- [gorilla/websocket chat example](https://github.com/gorilla/websocket/tree/main/examples/chat) -- production-ready chat with per-client write goroutines
- [RFC 6455 -- The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [Custom HTTP configuration](/docs/en/docs/server-config/custom-http-config/) -- customizing the underlying HTTP server used with Gin

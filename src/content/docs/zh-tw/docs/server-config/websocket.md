---
title: "WebSocket 支援"
sidebar:
  order: 9
---

Gin 不包含內建的 WebSocket 實作，但可以與 [gorilla/websocket](https://github.com/gorilla/websocket) 套件無縫整合。由於 Gin 處理函式接收底層的 `http.ResponseWriter` 和 `*http.Request`，你可以用最少的程式碼將任何 Gin 路由升級為 WebSocket 連線。

## 安裝

安裝 `gorilla/websocket` 套件：

```bash
go get github.com/gorilla/websocket
```

## 基本回聲伺服器

最簡單的 WebSocket 伺服器從客戶端讀取訊息並將其回傳。這是了解升級過程的良好起點。

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

## 聊天廣播範例

一個更實用的範例：一個簡單的聊天伺服器，將每個傳入的訊息廣播給所有已連線的客戶端。

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

> **注意：** 上面的廣播範例在持有讀鎖的同時寫入多個連線。在正式環境中，考慮透過每個客戶端的 channel 傳送訊息，以避免慢速連線阻塞廣播迴圈。請參閱 [gorilla/websocket 聊天範例](https://github.com/gorilla/websocket/tree/main/examples/chat) 以獲取適用於正式環境的模式。

## 連線升級與配置

`websocket.Upgrader` 控制 HTTP 連線如何升級為 WebSocket。關鍵欄位：

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

你也可以在升級過程中設定回應標頭：

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

## 最佳實務

### Ping/Pong 連線健康檢測

WebSocket 連線可能會無聲地變得過時。使用 ping/pong 幀來偵測失效的連線：

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

### 連線清理

完成後務必關閉連線並釋放資源：

- 在成功升級後立即使用 `defer conn.Close()`。
- 當讀取迴圈結束時，從任何共享的資料結構（如聊天範例中的 hub）中移除連線。
- 設定讀取和寫入截止時間，以防止閒置連線造成 goroutine 洩露。

### 並發寫入

`gorilla/websocket` 套件**不**支援對單一連線的並發寫入。如果多個 goroutine 需要寫入，請使用以下方式之一序列化存取：

- **Mutex：** 使用 `sync.Mutex` 保護寫入操作。
- **Channel：** 將所有傳出的訊息透過單一 channel 傳送，由一個寫入器 goroutine 消費。

Channel 方式通常是首選，因為它自然地處理背壓並將寫入邏輯集中在一處。

## 測試

### 使用 wscat

[wscat](https://github.com/websockets/wscat) 是一個命令列 WebSocket 客戶端。使用 npm 安裝：

```bash
npm install -g wscat
```

連線到你的伺服器：

```bash
wscat -c ws://localhost:8080/ws
```

輸入訊息並按 Enter。回聲伺服器會將其回傳。

### 使用 curl

curl 7.86+ 支援 WebSocket。向回聲伺服器傳送訊息：

```bash
curl --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Version: 13" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://localhost:8080/ws
```

> 對於互動式測試，`wscat` 比 curl 更方便，因為它會自動處理 WebSocket 幀協定。

## 另請參閱

- [gorilla/websocket 文件](https://pkg.go.dev/github.com/gorilla/websocket)
- [gorilla/websocket 聊天範例](https://github.com/gorilla/websocket/tree/main/examples/chat) -- 適用於正式環境的聊天，使用每個客戶端獨立的寫入 goroutine
- [RFC 6455 -- WebSocket 協定](https://datatracker.ietf.org/doc/html/rfc6455)
- [自訂 HTTP 配置](/zh-tw/docs/server-config/custom-http-config/) -- 自訂與 Gin 搭配使用的底層 HTTP 伺服器

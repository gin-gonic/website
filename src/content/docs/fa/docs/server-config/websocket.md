---
title: "پشتیبانی WebSocket"
sidebar:
  order: 9
---

Gin شامل پیاده‌سازی داخلی WebSocket نیست، اما به صورت یکپارچه با پکیج [gorilla/websocket](https://github.com/gorilla/websocket) کار می‌کند. از آنجا که handlerهای Gin `http.ResponseWriter` و `*http.Request` زیربنایی را دریافت می‌کنند، می‌توانید هر مسیر Gin را با حداقل تلاش به یک اتصال WebSocket ارتقا دهید.

## نصب

پکیج `gorilla/websocket` را نصب کنید:

```bash
go get github.com/gorilla/websocket
```

## سرور Echo پایه

ساده‌ترین سرور WebSocket یک پیام را از کلاینت می‌خواند و آن را بازمی‌گرداند. این نقطه شروع خوبی برای درک فرآیند ارتقا است.

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

## مثال پخش چت

یک مثال عملی‌تر: یک سرور چت ساده که هر پیام ورودی را به تمام کلاینت‌های متصل پخش می‌کند.

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

> **توجه:** مثال پخش بالا هنگام نگه داشتن read lock به چندین اتصال می‌نویسد. برای استفاده تولیدی، ارسال پیام‌ها از طریق یک channel به ازای هر کلاینت را در نظر بگیرید تا از مسدود شدن حلقه پخش روی اتصال کند جلوگیری شود. [مثال چت gorilla/websocket](https://github.com/gorilla/websocket/tree/main/examples/chat) را برای الگوی آماده تولید ببینید.

## ارتقا و پیکربندی اتصال

`websocket.Upgrader` نحوه ارتقای اتصالات HTTP به WebSocket را کنترل می‌کند. فیلدهای کلیدی:

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

همچنین می‌توانید هدرهای پاسخ را در حین ارتقا تنظیم کنید:

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

## بهترین روش‌ها

### Ping/Pong برای سلامت اتصال

اتصالات WebSocket می‌توانند بی‌صدا قطع شوند. از فریم‌های ping/pong برای تشخیص اتصالات مرده استفاده کنید:

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

### پاکسازی اتصال

همیشه اتصالات را ببندید و منابع را آزاد کنید:

- بلافاصله پس از ارتقای موفق از `defer conn.Close()` استفاده کنید.
- اتصالات را از ساختارهای داده مشترک (مانند hub در مثال چت) هنگام خروج از حلقه خواندن حذف کنید.
- مهلت‌های خواندن و نوشتن را تنظیم کنید تا از نشت گوروتین از اتصالات بیکار جلوگیری شود.

### نوشتن همزمان

پکیج `gorilla/websocket` از نوشتن همزمان به یک اتصال واحد پشتیبانی **نمی‌کند**. اگر چندین گوروتین نیاز به نوشتن دارند، دسترسی را با یکی از این روش‌ها سریال‌سازی کنید:

- **Mutex:** نوشتن‌ها را با `sync.Mutex` محافظت کنید.
- **Channel:** تمام پیام‌های خروجی را از طریق یک channel واحد که توسط یک گوروتین نویسنده مصرف می‌شود هدایت کنید.

رویکرد channel معمولاً ترجیح داده می‌شود زیرا به طور طبیعی فشار برگشتی را مدیریت کرده و منطق نوشتن را در یک مکان نگه می‌دارد.

## تست

### استفاده از wscat

[wscat](https://github.com/websockets/wscat) یک کلاینت WebSocket خط فرمان است. آن را با npm نصب کنید:

```bash
npm install -g wscat
```

به سرور خود متصل شوید:

```bash
wscat -c ws://localhost:8080/ws
```

یک پیام تایپ کنید و Enter بزنید. سرور echo آن را بازمی‌گرداند.

### استفاده از curl

curl نسخه 7.86+ از WebSocket پشتیبانی می‌کند. یک پیام به سرور echo ارسال کنید:

```bash
curl --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Version: 13" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://localhost:8080/ws
```

> برای تست تعاملی، `wscat` از curl راحت‌تر است زیرا پروتکل framing WebSocket را به طور خودکار مدیریت می‌کند.

## همچنین ببینید

- [مستندات gorilla/websocket](https://pkg.go.dev/github.com/gorilla/websocket)
- [مثال چت gorilla/websocket](https://github.com/gorilla/websocket/tree/main/examples/chat) -- چت آماده تولید با گوروتین‌های نوشتن به ازای هر کلاینت
- [RFC 6455 -- پروتکل WebSocket](https://datatracker.ietf.org/doc/html/rfc6455)
- [پیکربندی HTTP سفارشی](/fa/docs/server-config/custom-http-config/) -- سفارشی‌سازی سرور HTTP زیربنایی استفاده شده با Gin

---
title: "دعم WebSocket"
sidebar:
  order: 9
---

لا يتضمن Gin تنفيذ WebSocket مدمج، لكنه يتكامل بسلاسة مع حزمة [gorilla/websocket](https://github.com/gorilla/websocket). نظراً لأن معالجات Gin تستقبل `http.ResponseWriter` و`*http.Request` الأساسيين، يمكنك ترقية أي مسار Gin إلى اتصال WebSocket بأقل جهد.

## التثبيت

ثبّت حزمة `gorilla/websocket`:

```bash
go get github.com/gorilla/websocket
```

## خادم صدى أساسي

أبسط خادم WebSocket يقرأ رسالة من العميل ويعيد إرسالها. هذه نقطة بداية جيدة لفهم عملية الترقية.

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

## مثال بث الدردشة

مثال أكثر عملية: خادم دردشة بسيط يبث كل رسالة واردة إلى جميع العملاء المتصلين.

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

> **ملاحظة:** مثال البث أعلاه يكتب إلى اتصالات متعددة أثناء الاحتفاظ بقفل قراءة. للاستخدام في الإنتاج، فكر في إرسال الرسائل عبر قناة لكل عميل لتجنب حظر حلقة البث على اتصال بطيء. راجع [مثال دردشة gorilla/websocket](https://github.com/gorilla/websocket/tree/main/examples/chat) لنمط جاهز للإنتاج.

## ترقية الاتصال والتكوين

يتحكم `websocket.Upgrader` في كيفية ترقية اتصالات HTTP إلى WebSocket. الحقول الرئيسية:

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

يمكنك أيضاً تعيين ترويسات الاستجابة أثناء الترقية:

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

## أفضل الممارسات

### Ping/Pong لصحة الاتصال

يمكن أن تصبح اتصالات WebSocket قديمة بصمت. استخدم إطارات ping/pong لاكتشاف الاتصالات الميتة:

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

### تنظيف الاتصال

أغلق الاتصالات دائماً وحرر الموارد عند الانتهاء:

- استخدم `defer conn.Close()` فوراً بعد ترقية ناجحة.
- أزل الاتصالات من أي هياكل بيانات مشتركة (مثل المحور في مثال الدردشة) عند خروج حلقة القراءة.
- عيّن مهلاً زمنية للقراءة والكتابة لمنع تسرب goroutines من الاتصالات الخاملة.

### الكتابة المتزامنة

حزمة `gorilla/websocket` **لا تدعم** الكتابة المتزامنة إلى اتصال واحد. إذا احتاجت goroutines متعددة للكتابة، رتّب الوصول بأحد هذه الأساليب:

- **Mutex:** احمِ الكتابة بـ `sync.Mutex`.
- **القناة:** وجّه جميع الرسائل الصادرة عبر قناة واحدة يستهلكها goroutine كاتب واحد.

نهج القناة مفضّل عموماً لأنه يتعامل بشكل طبيعي مع الضغط العكسي ويبقي منطق الكتابة في مكان واحد.

## الاختبار

### استخدام wscat

[wscat](https://github.com/websockets/wscat) هو عميل WebSocket لسطر الأوامر. ثبّته باستخدام npm:

```bash
npm install -g wscat
```

اتصل بخادمك:

```bash
wscat -c ws://localhost:8080/ws
```

اكتب رسالة واضغط Enter. سيعيد خادم الصدى إرسالها.

### استخدام curl

curl 7.86+ يدعم WebSocket. أرسل رسالة إلى خادم الصدى:

```bash
curl --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Version: 13" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://localhost:8080/ws
```

> للاختبار التفاعلي، `wscat` أكثر ملاءمة من curl لأنه يتعامل مع بروتوكول إطارات WebSocket تلقائياً.

## انظر أيضاً

- [توثيق gorilla/websocket](https://pkg.go.dev/github.com/gorilla/websocket)
- [مثال دردشة gorilla/websocket](https://github.com/gorilla/websocket/tree/main/examples/chat) -- دردشة جاهزة للإنتاج مع goroutines كتابة لكل عميل
- [RFC 6455 -- بروتوكول WebSocket](https://datatracker.ietf.org/doc/html/rfc6455)
- [تكوين HTTP مخصص](/ar/docs/server-config/custom-http-config/) -- تخصيص خادم HTTP الأساسي المستخدم مع Gin

---
title: "WebSocket Desteği"
sidebar:
  order: 9
---

Gin yerleşik bir WebSocket uygulaması içermez, ancak [gorilla/websocket](https://github.com/gorilla/websocket) paketiyle sorunsuz entegre olur. Gin işleyicileri temel `http.ResponseWriter` ve `*http.Request`'i aldığından, herhangi bir Gin rotasını minimum çabayla bir WebSocket bağlantısına yükseltebilirsiniz.

## Kurulum

`gorilla/websocket` paketini kurun:

```bash
go get github.com/gorilla/websocket
```

## Temel Echo Sunucusu

En basit WebSocket sunucusu istemciden bir mesaj okur ve geri gönderir. Bu, yükseltme sürecini anlamak için iyi bir başlangıç noktasıdır.

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

## Sohbet Yayını Örneği

Daha pratik bir örnek: gelen her mesajı tüm bağlı istemcilere yayınlayan basit bir sohbet sunucusu.

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

> **Not:** Yukarıdaki yayın örneği, okuma kilidi tutarken birden fazla bağlantıya yazar. Üretim kullanımı için, yayın döngüsünü yavaş bir bağlantıda engellememek üzere istemci başına bir kanal aracılığıyla mesaj göndermeyi düşünün. Üretime hazır bir kalıp için [gorilla/websocket sohbet örneğine](https://github.com/gorilla/websocket/tree/main/examples/chat) bakın.

## En İyi Uygulamalar

### Bağlantı Sağlığı için Ping/Pong

WebSocket bağlantıları sessizce bayatlayabilir. Ölü bağlantıları tespit etmek için ping/pong çerçeveleri kullanın. Ayrıntılar için kaynak koda bakın.

### Bağlantı Temizliği

Her zaman bağlantıları kapatın ve işiniz bittiğinde kaynakları serbest bırakın:

- Başarılı bir yükseltmeden hemen sonra `defer conn.Close()` kullanın.
- Okuma döngüsü çıktığında paylaşılan veri yapılarından (sohbet örneğindeki hub gibi) bağlantıları kaldırın.
- Boşta bağlantılardan goroutine sızıntılarını önlemek için okuma ve yazma son tarihleri ayarlayın.

### Eşzamanlı Yazmalar

`gorilla/websocket` paketi tek bir bağlantıya eşzamanlı yazmaları **desteklemez**. Birden fazla goroutine'in yazması gerekiyorsa, erişimi bir `sync.Mutex` veya tek bir yazıcı goroutine tarafından tüketilen bir kanal ile serileştirin.

## Test Etme

### wscat kullanımı

[wscat](https://github.com/websockets/wscat), komut satırı WebSocket istemcisidir:

```bash
npm install -g wscat
wscat -c ws://localhost:8080/ws
```

Bir mesaj yazın ve Enter'a basın. Echo sunucusu geri gönderecektir.

## Ayrıca Bakınız

- [gorilla/websocket belgelendirmesi](https://pkg.go.dev/github.com/gorilla/websocket)
- [gorilla/websocket sohbet örneği](https://github.com/gorilla/websocket/tree/main/examples/chat)
- [RFC 6455 -- WebSocket Protokolü](https://datatracker.ietf.org/doc/html/rfc6455)

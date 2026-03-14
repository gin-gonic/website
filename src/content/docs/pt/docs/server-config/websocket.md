---
title: "Suporte a WebSocket"
sidebar:
  order: 9
---

O Gin não inclui uma implementação WebSocket integrada, mas se integra perfeitamente com o pacote [gorilla/websocket](https://github.com/gorilla/websocket). Como os handlers do Gin recebem o `http.ResponseWriter` e `*http.Request` subjacentes, você pode atualizar qualquer rota Gin para uma conexão WebSocket com esforço mínimo.

## Instalação

Instale o pacote `gorilla/websocket`:

```bash
go get github.com/gorilla/websocket
```

## Servidor Echo Básico

O servidor WebSocket mais simples lê uma mensagem do cliente e a ecoa de volta. Este é um bom ponto de partida para entender o processo de upgrade.

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

## Exemplo de Chat com Broadcast

Um exemplo mais prático: um servidor de chat simples que transmite cada mensagem recebida para todos os clientes conectados.

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

## Upgrade e Configuração de Conexão

O `websocket.Upgrader` controla como conexões HTTP são atualizadas para WebSocket. Campos principais:

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

## Melhores Práticas

### Ping/Pong para Saúde da Conexão

Conexões WebSocket podem ficar obsoletas silenciosamente. Use frames ping/pong para detectar conexões mortas:

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

### Limpeza de Conexão

Sempre feche conexões e libere recursos quando terminar:

- Use `defer conn.Close()` immediately after a successful upgrade.
- Remove connections from any shared data structures (such as the hub in the chat example) when the read loop exits.
- Set read and write deadlines to prevent goroutine leaks from idle connections.

### Escritas Concorrentes

O pacote `gorilla/websocket` **não** suporta escritas concorrentes em uma única conexão. Se múltiplas goroutines precisam escrever, serialize o acesso com uma dessas abordagens:

- **Mutex:** Protect writes with a `sync.Mutex`.
- **Channel:** Funnel all outgoing messages through a single channel consumed by one writer goroutine.

A abordagem por canal é geralmente preferida porque lida naturalmente com back-pressure e mantém a lógica de escrita em um único lugar.

## Testes

### Usando wscat

[wscat](https://github.com/websockets/wscat) é um cliente WebSocket de linha de comando. Instale-o com npm:

```bash
npm install -g wscat
```

Conecte-se ao seu servidor:

```bash
wscat -c ws://localhost:8080/ws
```

Digite uma mensagem e pressione Enter. O servidor echo a enviará de volta.

### Usando curl

curl 7.86+ suporta WebSocket. Envie uma mensagem ao servidor echo:

```bash
curl --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Version: 13" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://localhost:8080/ws
```

> For interactive testing, `wscat` is more convenient than curl because it handles the WebSocket framing protocol automatically.

## Veja Também

- [gorilla/websocket documentation](https://pkg.go.dev/github.com/gorilla/websocket)
- [gorilla/websocket chat example](https://github.com/gorilla/websocket/tree/main/examples/chat) -- production-ready chat with per-client write goroutines
- [RFC 6455 -- The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [Custom HTTP configuration](/docs/en/docs/server-config/custom-http-config/) -- customizing the underlying HTTP server used with Gin

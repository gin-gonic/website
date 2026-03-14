---
title: "Soporte WebSocket"
sidebar:
  order: 9
---

Gin no incluye una implementación WebSocket integrada, pero se integra perfectamente con el paquete [gorilla/websocket](https://github.com/gorilla/websocket). Dado que los handlers de Gin reciben el `http.ResponseWriter` y `*http.Request` subyacentes, puedes actualizar cualquier ruta de Gin a una conexión WebSocket con un esfuerzo mínimo.

## Instalación

Instala el paquete `gorilla/websocket`:

```bash
go get github.com/gorilla/websocket
```

## Servidor Echo básico

El servidor WebSocket más simple lee un mensaje del cliente y lo devuelve. Este es un buen punto de partida para entender el proceso de actualización.

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

## Ejemplo de chat con broadcast

Un ejemplo más práctico: un servidor de chat simple que transmite cada mensaje entrante a todos los clientes conectados.

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

> **Nota:** El ejemplo de broadcast anterior escribe a múltiples conexiones mientras mantiene un lock de lectura. Para uso en producción, considera enviar mensajes a través de un canal por cliente para evitar bloquear el bucle de broadcast con una conexión lenta. Consulta el [ejemplo de chat de gorilla/websocket](https://github.com/gorilla/websocket/tree/main/examples/chat) para un patrón listo para producción.

## Actualización de conexión y configuración

El `websocket.Upgrader` controla cómo se actualizan las conexiones HTTP a WebSocket. Campos clave:

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

También puedes establecer encabezados de respuesta durante la actualización:

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

## Mejores prácticas

### Ping/Pong para salud de la conexión

Las conexiones WebSocket pueden volverse obsoletas silenciosamente. Usa frames ping/pong para detectar conexiones muertas:

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

### Limpieza de conexiones

Siempre cierra las conexiones y libera recursos cuando termines:

- Usa `defer conn.Close()` inmediatamente después de una actualización exitosa.
- Elimina las conexiones de cualquier estructura de datos compartida (como el hub en el ejemplo de chat) cuando el bucle de lectura termina.
- Establece tiempos límite de lectura y escritura para prevenir fugas de goroutines de conexiones inactivas.

### Escrituras concurrentes

El paquete `gorilla/websocket` **no** soporta escrituras concurrentes a una sola conexión. Si múltiples goroutines necesitan escribir, serializa el acceso con uno de estos enfoques:

- **Mutex:** Protege las escrituras con un `sync.Mutex`.
- **Canal:** Canaliza todos los mensajes salientes a través de un solo canal consumido por una goroutine escritora.

El enfoque de canal generalmente se prefiere porque maneja naturalmente la contrapresión y mantiene la lógica de escritura en un solo lugar.

## Pruebas

### Usando wscat

[wscat](https://github.com/websockets/wscat) es un cliente WebSocket de línea de comandos. Instálalo con npm:

```bash
npm install -g wscat
```

Conéctate a tu servidor:

```bash
wscat -c ws://localhost:8080/ws
```

Escribe un mensaje y presiona Enter. El servidor echo lo enviará de vuelta.

### Usando curl

curl 7.86+ soporta WebSocket. Envía un mensaje al servidor echo:

```bash
curl --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Version: 13" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://localhost:8080/ws
```

> Para pruebas interactivas, `wscat` es más conveniente que curl porque maneja el protocolo de enmarcado WebSocket automáticamente.

## Ver también

- [Documentación de gorilla/websocket](https://pkg.go.dev/github.com/gorilla/websocket)
- [Ejemplo de chat de gorilla/websocket](https://github.com/gorilla/websocket/tree/main/examples/chat) -- chat listo para producción con goroutines de escritura por cliente
- [RFC 6455 -- El protocolo WebSocket](https://datatracker.ietf.org/doc/html/rfc6455)
- [Configuración HTTP personalizada](/es/docs/server-config/custom-http-config/) -- personalizar el servidor HTTP subyacente usado con Gin

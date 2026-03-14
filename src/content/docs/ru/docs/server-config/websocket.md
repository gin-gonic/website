---
title: "Поддержка WebSocket"
sidebar:
  order: 9
---

Gin не включает встроенную реализацию WebSocket, но легко интегрируется с пакетом [gorilla/websocket](https://github.com/gorilla/websocket). Поскольку обработчики Gin получают базовые `http.ResponseWriter` и `*http.Request`, вы можете обновить любой маршрут Gin до WebSocket-соединения с минимальными усилиями.

## Установка

Установите пакет `gorilla/websocket`:

```bash
go get github.com/gorilla/websocket
```

## Базовый эхо-сервер

Простейший WebSocket-сервер читает сообщение от клиента и отправляет его обратно. Это хорошая отправная точка для понимания процесса обновления соединения.

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

## Пример чат-рассылки

Более практичный пример: простой чат-сервер, который рассылает каждое входящее сообщение всем подключённым клиентам.

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

> **Примечание:** В примере рассылки выше запись в несколько соединений происходит при удержании блокировки на чтение. Для продакшена рассмотрите отправку сообщений через канал для каждого клиента, чтобы избежать блокировки цикла рассылки медленным соединением. Смотрите [пример чата gorilla/websocket](https://github.com/gorilla/websocket/tree/main/examples/chat) для паттерна, готового к продакшену.

## Обновление соединения и настройка

`websocket.Upgrader` контролирует, как HTTP-соединения обновляются до WebSocket. Ключевые поля:

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

Вы также можете установить заголовки ответа при обновлении соединения:

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

## Лучшие практики

### Ping/Pong для проверки состояния соединения

WebSocket-соединения могут незаметно становиться неактивными. Используйте фреймы ping/pong для обнаружения мёртвых соединений:

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

### Очистка соединений

Всегда закрывайте соединения и освобождайте ресурсы по завершении:

- Используйте `defer conn.Close()` сразу после успешного обновления.
- Удаляйте соединения из любых общих структур данных (таких как hub в примере чата), когда цикл чтения завершается.
- Устанавливайте дедлайны чтения и записи, чтобы предотвратить утечки горутин от неактивных соединений.

### Конкурентная запись

Пакет `gorilla/websocket` **не** поддерживает конкурентную запись в одно соединение. Если нескольким горутинам нужно писать, сериализуйте доступ одним из следующих способов:

- **Мьютекс:** Защитите запись с помощью `sync.Mutex`.
- **Канал:** Направьте все исходящие сообщения через один канал, обслуживаемый одной горутиной-писателем.

Подход с каналом обычно предпочтительнее, так как он естественным образом обрабатывает обратное давление и сохраняет логику записи в одном месте.

## Тестирование

### Использование wscat

[wscat](https://github.com/websockets/wscat) — это клиент WebSocket для командной строки. Установите его через npm:

```bash
npm install -g wscat
```

Подключитесь к вашему серверу:

```bash
wscat -c ws://localhost:8080/ws
```

Введите сообщение и нажмите Enter. Эхо-сервер отправит его обратно.

### Использование curl

curl 7.86+ поддерживает WebSocket. Отправьте сообщение эхо-серверу:

```bash
curl --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Version: 13" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://localhost:8080/ws
```

> Для интерактивного тестирования `wscat` удобнее, чем curl, поскольку он автоматически обрабатывает протокол фреймирования WebSocket.

## Смотрите также

- [Документация gorilla/websocket](https://pkg.go.dev/github.com/gorilla/websocket)
- [Пример чата gorilla/websocket](https://github.com/gorilla/websocket/tree/main/examples/chat) -- готовый к продакшену чат с горутинами записи для каждого клиента
- [RFC 6455 -- Протокол WebSocket](https://datatracker.ietf.org/doc/html/rfc6455)
- [Пользовательская конфигурация HTTP](/ru/docs/server-config/custom-http-config/) -- настройка базового HTTP-сервера, используемого с Gin

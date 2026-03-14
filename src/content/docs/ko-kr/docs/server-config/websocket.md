---
title: "WebSocket 지원"
sidebar:
  order: 9
---

Gin은 내장 WebSocket 구현을 포함하지 않지만, [gorilla/websocket](https://github.com/gorilla/websocket) 패키지와 원활하게 통합됩니다. Gin 핸들러는 기본 `http.ResponseWriter`와 `*http.Request`를 받으므로, 최소한의 노력으로 모든 Gin 라우트를 WebSocket 연결로 업그레이드할 수 있습니다.

## 설치

`gorilla/websocket` 패키지를 설치합니다:

```bash
go get github.com/gorilla/websocket
```

## 기본 에코 서버

가장 간단한 WebSocket 서버는 클라이언트로부터 메시지를 읽고 다시 에코합니다. 이는 업그레이드 프로세스를 이해하기 위한 좋은 출발점입니다.

```go
package main

import (
  "log"
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
  // 개발 시 모든 출처 허용; 프로덕션에서는 이를 제한하세요.
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

## 채팅 브로드캐스트 예제

더 실용적인 예제: 들어오는 모든 메시지를 연결된 모든 클라이언트에게 브로드캐스트하는 간단한 채팅 서버입니다.

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

> **참고:** 위 브로드캐스트 예제는 읽기 잠금을 유지한 상태로 여러 연결에 쓰기를 합니다. 프로덕션에서는 느린 연결에서 브로드캐스트 루프가 차단되는 것을 방지하기 위해 클라이언트별 채널을 통해 메시지를 보내는 것을 고려하세요. 프로덕션 수준의 패턴은 [gorilla/websocket 채팅 예제](https://github.com/gorilla/websocket/tree/main/examples/chat)를 참조하세요.

## 연결 업그레이드 및 설정

`websocket.Upgrader`는 HTTP 연결이 WebSocket으로 업그레이드되는 방식을 제어합니다. 주요 필드:

```go
var upgrader = websocket.Upgrader{
  // ReadBufferSize와 WriteBufferSize는 I/O 버퍼 크기를 바이트로 지정합니다.
  // 기본값(4096)은 대부분의 사용 사례에 적합합니다. 큰 메시지의 경우 늘리세요.
  ReadBufferSize:  1024,
  WriteBufferSize: 1024,

  // CheckOrigin은 요청 Origin 헤더가 허용 가능한지 제어합니다.
  // 기본적으로 크로스 오리진 요청을 거부합니다. CORS 지원을 위해 재정의하세요.
  CheckOrigin: func(r *http.Request) bool {
    origin := r.Header.Get("Origin")
    return origin == "https://your-app.example.com"
  },

  // Subprotocols는 서버가 지원하는 프로토콜을 선호도 순으로 지정합니다.
  Subprotocols: []string{"graphql-ws", "graphql-transport-ws"},
}
```

업그레이드 시 응답 헤더를 설정할 수도 있습니다:

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

## 모범 사례

### 연결 상태 확인을 위한 Ping/Pong

WebSocket 연결은 조용히 끊어질 수 있습니다. ping/pong 프레임을 사용하여 끊어진 연결을 감지합니다:

```go
import "time"

const (
  pongWait   = 60 * time.Second
  pingPeriod = (pongWait * 9) / 10 // pongWait보다 작아야 합니다
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

  // ping을 보내는 고루틴 시작.
  go func() {
    ticker := time.NewTicker(pingPeriod)
    defer ticker.Stop()
    for range ticker.C {
      if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
        return
      }
    }
  }()

  // 읽기 루프
  for {
    _, message, err := conn.ReadMessage()
    if err != nil {
      break
    }
    log.Printf("Received: %s", message)
  }
}
```

### 연결 정리

완료 시 항상 연결을 닫고 리소스를 해제하세요:

- 성공적인 업그레이드 직후에 `defer conn.Close()`를 사용하세요.
- 읽기 루프가 종료될 때 공유 데이터 구조(채팅 예제의 hub 등)에서 연결을 제거하세요.
- 유휴 연결에서의 고루틴 누수를 방지하기 위해 읽기 및 쓰기 데드라인을 설정하세요.

### 동시 쓰기

`gorilla/websocket` 패키지는 단일 연결에 대한 동시 쓰기를 **지원하지 않습니다**. 여러 고루틴이 쓰기를 해야 하는 경우, 다음 접근 방식 중 하나로 접근을 직렬화하세요:

- **Mutex:** `sync.Mutex`로 쓰기를 보호합니다.
- **Channel:** 모든 발신 메시지를 하나의 쓰기 고루틴이 소비하는 단일 채널을 통해 전달합니다.

채널 접근 방식은 자연스럽게 백프레셔를 처리하고 쓰기 로직을 한 곳에 유지하므로 일반적으로 선호됩니다.

## 테스트

### wscat 사용하기

[wscat](https://github.com/websockets/wscat)은 명령줄 WebSocket 클라이언트입니다. npm으로 설치합니다:

```bash
npm install -g wscat
```

서버에 연결합니다:

```bash
wscat -c ws://localhost:8080/ws
```

메시지를 입력하고 Enter를 누르세요. 에코 서버가 메시지를 다시 보내줍니다.

### curl 사용하기

curl 7.86+는 WebSocket을 지원합니다. 에코 서버에 메시지를 보냅니다:

```bash
curl --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Version: 13" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  http://localhost:8080/ws
```

> 대화형 테스트의 경우, `wscat`이 WebSocket 프레이밍 프로토콜을 자동으로 처리하므로 curl보다 더 편리합니다.

## 참고

- [gorilla/websocket 문서](https://pkg.go.dev/github.com/gorilla/websocket)
- [gorilla/websocket 채팅 예제](https://github.com/gorilla/websocket/tree/main/examples/chat) -- 클라이언트별 쓰기 고루틴을 갖춘 프로덕션 수준의 채팅
- [RFC 6455 -- The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [커스텀 HTTP 설정](/ko-kr/docs/server-config/custom-http-config/) -- Gin과 함께 사용되는 기본 HTTP 서버 커스터마이즈

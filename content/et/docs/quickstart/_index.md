---
title: "Kiirstart"
draft: false
weight: 2
---

Selles lühijuhendis kogume teavet koodisegmentidest ja õpime, kuidas:

## Nõuded

- Go 1.16 või üle selle

## Paigaldamine

Gin-i paketi installimiseks peate installima Go ja määrama kõigepealt oma Go tööruumi.

1. Laadige alla ja installige:

```sh
$ go get -u github.com/gin-gonic/gin
```
Või installi:
```sh
$ go install github.com/gin-gonic/gin@latest
```

2. Importige see oma koodi:

```go
import "github.com/gin-gonic/gin"
```

3. (Valikuline) Importi `net/http`. See on näiteks vajalik selliste konstantide kasutamisel nagu `http.StatusOK`.

```go
import "net/http"
```

1. Looge oma projekti kaust ja `cd` sellesse

```sh
$ mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

2. Kopeerige algusmall oma projekti

```sh
$ curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```

3. Käivitage oma projekt

```sh
$ go run main.go
```

## Alustamine

> Pole kindel, kuidas Go-koodi kirjutada ja käivitada? [Click here](https://golang.org/doc/code.html).

Esiteks looge fail nimega `example.go`:

```sh
# oletame, et järgmised koodid on example.go failis
$ touch example.go
```

Järgmiseks sisestage antud kood `example.go`:

```go
package main

import "github.com/gin-gonic/gin"

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run() // kuula ja serveeri 0.0.0.0:8080
}
```

Ja saate koodi käivitada `go run example.go` kaudu:

```sh
# käivita example.go ja külasta 0.0.0.0:8080/ping brauseris
$ go run example.go
```

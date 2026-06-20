---
title: "Goroutines dentro de um middleware"
sidebar:
  order: 6
---

Ao iniciar novas Goroutines dentro de um middleware ou handler, você **NÃO DEVE** usar o contexto original dentro delas, você deve usar uma cópia somente leitura.

### Por que `c.Copy()` é essencial

O Gin usa um **sync.Pool** para reutilizar objetos `gin.Context` entre requisições para melhor desempenho. Uma vez que um handler retorna, o `gin.Context` é devolvido ao pool e pode ser atribuído a uma requisição completamente diferente. Se uma goroutine ainda mantiver uma referência ao contexto original nesse momento, ela lerá ou escreverá campos que agora pertencem a outra requisição. Isso leva a **condições de corrida**, **corrupção de dados** ou **panics**.

Chamar `c.Copy()` cria um snapshot do contexto que é seguro para usar após o handler retornar. A cópia inclui a requisição, URL, chaves e outros dados somente leitura, mas está desvinculada do ciclo de vida do pool.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // create copy to be used inside the goroutine
    cCp := c.Copy()
    go func() {
      // simulate a long task with time.Sleep(). 5 seconds
      time.Sleep(5 * time.Second)

      // note that you are using the copied context "cCp", IMPORTANT
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // simulate a long task with time.Sleep(). 5 seconds
    time.Sleep(5 * time.Second)

    // since we are NOT using a goroutine, we do not have to copy the context
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

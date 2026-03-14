---
title: "Servindo dados de reader"
sidebar:
  order: 8
---

`DataFromReader` permite fazer streaming de dados de qualquer `io.Reader` diretamente para a resposta HTTP sem armazenar todo o conteúdo em buffer na memória primeiro. Isso é essencial para construir endpoints proxy ou servir arquivos grandes de fontes remotas de forma eficiente.

**Casos de uso comuns:**

- **Proxy de recursos remotos** -- Buscar um arquivo de um serviço externo (como uma API de armazenamento em nuvem ou CDN) e encaminhá-lo ao cliente. Os dados fluem pelo seu servidor sem serem totalmente carregados na memória.
- **Servindo conteúdo gerado** -- Fazer streaming de dados gerados dinamicamente (como exportações CSV ou arquivos de relatório) conforme são produzidos.
- **Downloads de arquivos grandes** -- Servir arquivos grandes demais para manter na memória, lendo-os em pedaços do disco ou de uma fonte remota.

A assinatura do método é `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`. Você fornece o código de status HTTP, o comprimento do conteúdo (para que o cliente saiba o tamanho total), o tipo MIME, o `io.Reader` de onde fazer streaming, e um mapa opcional de headers de resposta extras (como `Content-Disposition` para downloads de arquivo).

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

Neste exemplo, o Gin busca uma imagem do GitHub e faz streaming diretamente para o cliente como um anexo para download. Os bytes da imagem fluem do corpo da resposta HTTP upstream para a resposta do cliente sem serem acumulados em um buffer. Note que `response.Body` é automaticamente fechado pelo servidor HTTP após o handler retornar, já que `DataFromReader` o lê completamente durante a escrita da resposta.

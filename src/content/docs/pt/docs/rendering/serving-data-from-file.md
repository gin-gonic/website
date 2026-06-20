---
title: "Servindo dados de arquivo"
sidebar:
  order: 7
---

O Gin fornece vários métodos para servir arquivos aos clientes. Cada método é adequado para um caso de uso diferente:

- **`c.File(path)`** -- Serve um arquivo do sistema de arquivos local. O tipo de conteúdo é detectado automaticamente. Use quando você conhece o caminho exato do arquivo em tempo de compilação ou já o validou.
- **`c.FileFromFS(path, fs)`** -- Serve um arquivo de uma interface `http.FileSystem`. Útil ao servir arquivos de sistemas de arquivos incorporados (`embed.FS`), backends de armazenamento personalizados ou quando você quer restringir o acesso a uma árvore de diretórios específica.
- **`c.FileAttachment(path, filename)`** -- Serve um arquivo como download definindo o header `Content-Disposition: attachment`. O navegador solicitará ao usuário que salve o arquivo usando o nome que você fornecer, independentemente do nome original do arquivo no disco.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

Você pode testar o endpoint de download com curl:

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

Para fazer streaming de dados a partir de um `io.Reader` (como uma URL remota ou conteúdo gerado dinamicamente), use `c.DataFromReader()` em vez disso. Veja [Servindo dados de reader](/pt/docs/rendering/serving-data-from-reader/) para detalhes.

:::caution[Segurança: travessia de caminho]
Nunca passe entrada do usuário diretamente para `c.File()` ou `c.FileAttachment()`. Um atacante poderia fornecer um caminho como `../../etc/passwd` para ler arquivos arbitrários no seu servidor. Sempre valide e sanitize caminhos de arquivo, ou use `c.FileFromFS()` com um `http.FileSystem` restrito que confine o acesso a um diretório específico.

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::

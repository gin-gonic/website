---
title: "Servindo arquivos estáticos"
sidebar:
  order: 6
---

O Gin fornece três métodos para servir conteúdo estático:

- **`router.Static(relativePath, root)`** -- Serve um diretório inteiro. Requisições para `relativePath` são mapeadas para arquivos sob `root`. Por exemplo, `router.Static("/assets", "./assets")` serve `./assets/style.css` em `/assets/style.css`.
- **`router.StaticFS(relativePath, fs)`** -- Como `Static`, mas aceita uma interface `http.FileSystem`, dando mais controle sobre como os arquivos são resolvidos. Use quando precisar servir arquivos de um sistema de arquivos incorporado ou quiser personalizar o comportamento de listagem de diretórios.
- **`router.StaticFile(relativePath, filePath)`** -- Serve um único arquivo. Útil para endpoints como `/favicon.ico` ou `/robots.txt`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::caution[Segurança: travessia de caminho]
O diretório que você passa para `Static()` ou `http.Dir()` será totalmente acessível a qualquer cliente. Certifique-se de que ele não contém arquivos sensíveis como arquivos de configuração, arquivos `.env`, chaves privadas ou arquivos de banco de dados.

Como boa prática:

- Use um diretório dedicado que contenha apenas os arquivos que você pretende servir publicamente.
- Evite passar caminhos como `"."` ou `"/"` que poderiam expor todo o seu projeto ou sistema de arquivos.
- Se precisar de controle mais fino (por exemplo, desabilitar listagem de diretórios), use `StaticFS` com uma implementação personalizada de `http.FileSystem`. O `http.Dir` padrão habilita listagem de diretórios por padrão.
:::

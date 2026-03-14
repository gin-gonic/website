---
title: "Como escrever arquivo de log"
sidebar:
  order: 1
---

Escrever logs em arquivo é essencial para aplicações em produção onde você precisa reter o histórico de requisições para debugging, auditoria ou monitoramento. Por padrão, o Gin escreve toda a saída de log em `os.Stdout`. Você pode redirecionar isso definindo `gin.DefaultWriter` antes de criar o roteador.

```go
package main

import (
  "io"
  "os"

  "github.com/gin-gonic/gin"
)

func main() {
    // Disable Console Color, you don't need console color when writing the logs to file.
    gin.DisableConsoleColor()

    // Logging to a file.
    f, _ := os.Create("gin.log")
    gin.DefaultWriter = io.MultiWriter(f)

    // Use the following code if you need to write the logs to file and console at the same time.
    // gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### Escrevendo para arquivo e console

A função `io.MultiWriter` da biblioteca padrão do Go aceita múltiplos valores `io.Writer` e duplica as escritas para todos eles. Isso é útil durante o desenvolvimento quando você quer ver os logs no terminal enquanto também os persiste no disco:

```go
f, _ := os.Create("gin.log")
gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
```

Com essa configuração, cada entrada de log é escrita tanto em `gin.log` quanto no console simultaneamente.

### Rotação de log em produção

O exemplo acima usa `os.Create`, que trunca o arquivo de log cada vez que a aplicação inicia. Em produção, você tipicamente quer adicionar aos logs existentes e rotacionar arquivos baseado em tamanho ou tempo. Considere usar uma biblioteca de rotação de logs como [lumberjack](https://github.com/natefinch/lumberjack):

```go
import "gopkg.in/natefinch/lumberjack.v2"

func main() {
    gin.DisableConsoleColor()

    gin.DefaultWriter = &lumberjack.Logger{
        Filename:   "gin.log",
        MaxSize:    100, // megabytes
        MaxBackups: 3,
        MaxAge:     28, // days
    }

    router := gin.Default()
    router.GET("/ping", func(c *gin.Context) {
        c.String(200, "pong")
    })

    router.Run(":8080")
}
```

### Veja também

- [Formato de log customizado](../custom-log-format/) -- Defina seu próprio formato de linha de log.
- [Controlando coloração da saída de log](../controlling-log-output-coloring/) -- Desabilite ou force a saída colorizada.
- [Pular logging](../skip-logging/) -- Exclua rotas específicas do logging.

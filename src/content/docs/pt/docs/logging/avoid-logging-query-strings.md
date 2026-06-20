---
title: "Evitar logging de query strings"
sidebar:
  order: 5
---

Query strings frequentemente contêm informações sensíveis como tokens de API, senhas, IDs de sessão ou informações pessoais identificáveis (PII). Registrar esses valores pode criar riscos de segurança e pode violar regulamentações de privacidade como GDPR ou LGPD. Ao remover query strings dos seus logs, você reduz a chance de vazar dados sensíveis através de arquivos de log, sistemas de monitoramento ou ferramentas de relatório de erros.

Use a opção `SkipQueryString` em `LoggerConfig` para evitar que query strings apareçam nos logs. Quando habilitada, uma requisição para `/path?token=secret&user=alice` será registrada simplesmente como `/path`.

```go
func main() {
  router := gin.New()

  // SkipQueryString indicates that the logger should not log the query string.
  // For example, /path?q=1 will be logged as /path
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

Você pode testar a diferença com `curl`:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

Sem `SkipQueryString`, a entrada de log inclui a query string completa:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

Com `SkipQueryString: true`, a query string é removida:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

Isso é particularmente útil em ambientes sensíveis a conformidade onde a saída de log é encaminhada para serviços de terceiros ou armazenada a longo prazo. Sua aplicação ainda tem acesso total aos parâmetros de query através de `c.Query()` -- apenas a saída de log é afetada.

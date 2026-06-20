---
title: "Logging"
sidebar:
  order: 7
---

O Gin inclui um middleware de logger integrado que registra detalhes sobre cada requisição HTTP, incluindo o código de status, método HTTP, caminho e latência.

Quando você cria um roteador com `gin.Default()`, o middleware de logger é automaticamente anexado junto com o middleware de recovery:

```go
// Logger and Recovery middleware are already attached
router := gin.Default()
```

Se você precisa de controle total sobre quais middlewares usar, crie um roteador com `gin.New()` e adicione o logger manualmente:

```go
// No middleware attached
router := gin.New()

// Attach the logger middleware
router.Use(gin.Logger())
```

O logger padrão escreve em `os.Stdout` e produz uma saída como esta para cada requisição:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     512.345µs |       127.0.0.1 | GET      "/ping"
```

Cada entrada inclui um timestamp, código de status HTTP, latência da requisição, IP do cliente, método HTTP e o caminho requisitado.

## Nesta seção

- [**Escrevendo logs em arquivo**](./write-log/) -- Redirecione a saída de logs para um arquivo, para o console ou para ambos ao mesmo tempo.
- [**Formato de log customizado**](./custom-log-format/) -- Defina seu próprio formato de log usando `LoggerWithFormatter`.
- [**Pular logging**](./skip-logging/) -- Pule o logging para caminhos ou condições específicas.
- [**Controlando coloração da saída de log**](./controlling-log-output-coloring/) -- Habilite ou desabilite a saída de log colorizada.
- [**Evitar logging de query strings**](./avoid-logging-query-strings/) -- Remova parâmetros de query da saída de log por segurança e privacidade.
- [**Definir formato para o log de rotas**](./define-format-for-the-log-of-routes/) -- Personalize como as rotas registradas são impressas na inicialização.

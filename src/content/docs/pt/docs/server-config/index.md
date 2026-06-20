---
title: "Configuração do Servidor"
sidebar:
  order: 8
---

O Gin oferece opções flexíveis de configuração de servidor. Como `gin.Engine` implementa a interface `http.Handler`, você pode usá-lo com o `net/http.Server` padrão do Go para controlar timeouts, TLS e outras configurações diretamente.

## Usando um http.Server customizado

Por padrão, `router.Run()` inicia um servidor HTTP básico. Para uso em produção, crie seu próprio `http.Server` para definir timeouts e outras opções:

```go
func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.String(200, "ok")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

Isso dá acesso completo à configuração do servidor Go, mantendo todas as capacidades de roteamento e middleware do Gin.

## Nesta seção

- [**Configuração HTTP customizada**](./custom-http-config/) -- Ajuste fino do servidor HTTP subjacente
- [**Codec JSON customizado**](./custom-json-codec/) -- Use bibliotecas alternativas de serialização JSON
- [**Let's Encrypt**](./lets-encrypt/) -- Certificados TLS automáticos com Let's Encrypt
- [**Executando múltiplos serviços**](./multiple-service/) -- Sirva múltiplos engines Gin em portas diferentes
- [**Reinicialização ou parada graciosa**](./graceful-restart-or-stop/) -- Desligue sem descartar conexões ativas
- [**HTTP/2 server push**](./http2-server-push/) -- Envie recursos ao cliente proativamente
- [**Manipulação de cookies**](./cookie/) -- Leia e escreva cookies HTTP
- [**Proxies confiáveis**](./trusted-proxies/) -- Configure quais proxies o Gin confia para resolução de IP do cliente

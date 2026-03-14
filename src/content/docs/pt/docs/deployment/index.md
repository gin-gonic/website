---
title: "Implantação"
sidebar:
  order: 10
---

Projetos Gin podem ser implantados facilmente em qualquer provedor de nuvem.

## [Railway](https://www.railway.com)

Railway é uma plataforma de desenvolvimento em nuvem de ponta para implantar, gerenciar e escalar aplicações e serviços. Ela simplifica sua pilha de infraestrutura, desde servidores até observabilidade, com uma plataforma única, escalável e fácil de usar.

Siga o [guia do Railway para implantar seus projetos Gin](https://docs.railway.com/guides/gin).

## [Seenode](https://seenode.com)

Seenode é uma plataforma de nuvem moderna projetada especificamente para desenvolvedores que desejam implantar aplicações de forma rápida e eficiente. Oferece implantação baseada em git, certificados SSL automáticos, bancos de dados integrados e uma interface simplificada que coloca suas aplicações Gin no ar em minutos.

Siga o [guia do Seenode para implantar seus projetos Gin](https://seenode.com/docs/frameworks/go/gin).

## [Koyeb](https://www.koyeb.com)

Koyeb é uma plataforma serverless amigável para desenvolvedores, para implantar aplicações globalmente com implantação baseada em git, criptografia TLS, autoescalonamento nativo, uma rede de borda global e service mesh e descoberta integrados.

Siga o [guia do Koyeb para implantar seus projetos Gin](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb).

## [Qovery](https://www.qovery.com)

Qovery oferece hospedagem em nuvem gratuita com bancos de dados, SSL, CDN global e implantações automáticas com Git.

Veja [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/) para mais informações.

## [Render](https://render.com)

Render é uma plataforma de nuvem moderna que oferece suporte nativo para Go, SSL totalmente gerenciado, bancos de dados, implantações sem downtime, HTTP/2 e suporte a websocket.

Siga o [guia do Render para implantar projetos Gin](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

O GAE possui duas formas de implantar aplicações Go. O ambiente padrão é mais fácil de usar, mas menos customizável e impede [syscalls](https://github.com/gin-gonic/gin/issues/1639) por motivos de segurança. O ambiente flexível pode executar qualquer framework ou biblioteca.

Saiba mais e escolha seu ambiente preferido em [Go no Google App Engine](https://cloud.google.com/appengine/docs/go/).

## Auto-hospedado

Projetos Gin também podem ser implantados de forma auto-hospedada. A arquitetura de implantação e considerações de segurança variam dependendo do ambiente de destino. A seção a seguir apresenta apenas uma visão geral de alto nível das opções de configuração a considerar ao planejar a implantação.

## Opções de Configuração

Implantações de projetos Gin podem ser ajustadas usando variáveis de ambiente ou diretamente no código.

As seguintes variáveis de ambiente estão disponíveis para configurar o Gin:

| Variável de Ambiente | Descrição                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | A porta TCP para escutar ao iniciar o servidor Gin com `router.Run()` (ou seja, sem nenhum argumento).                                                                                                      |
| GIN_MODE             | Defina como `debug`, `release` ou `test`. Gerencia os modos do Gin, como quando emitir saídas de debug. Também pode ser definido no código usando `gin.SetMode(gin.ReleaseMode)` ou `gin.SetMode(gin.TestMode)` |

O seguinte código pode ser usado para configurar o Gin.

```go
// Don't specify the bind address or port for Gin. Defaults to binding on all interfaces on port 8080.
// Can use the `PORT` environment variable to change the listen port when using `Run()` without any arguments.
router := gin.Default()
router.Run()

// Specify the bind address and port for Gin.
router := gin.Default()
router.Run("192.168.1.100:8080")

// Specify only the listen port. Will bind on all interfaces.
router := gin.Default()
router.Run(":8080")

// Set which IP addresses or CIDRs, are considered to be trusted for setting headers to document real client IP addresses.
// See the documentation for additional details.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

Para informações sobre a configuração de proxies confiáveis, veja [Proxies Confiáveis](/pt/docs/server-config/trusted-proxies/).

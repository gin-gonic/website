---
title: "Introdução"
sidebar:
  order: 1
---

Gin é um framework web escrito em Go (Golang). Possui uma API semelhante ao Martini com desempenho muito melhor, até 40 vezes mais rápido graças ao [httprouter](https://github.com/julienschmidt/httprouter). Se você precisa de desempenho e boa produtividade, vai adorar o Gin.

Nesta seção, vamos apresentar o que é o Gin, quais problemas ele resolve e como ele pode ajudar o seu projeto.

Ou, se você já está pronto para usar o Gin no seu projeto, visite o [Início Rápido](https://gin-gonic.com/pt/docs/quickstart/).

## Recursos

### Rápido

Roteamento baseado em árvore radix, baixo consumo de memória. Sem reflection. Desempenho de API previsível.

### Suporte a middleware

Uma requisição HTTP recebida pode ser tratada por uma cadeia de middlewares e pela ação final.
Por exemplo: Logger, Autorização, GZIP e, por fim, publicar uma mensagem no banco de dados.

### À prova de falhas

O Gin pode capturar um panic ocorrido durante uma requisição HTTP e recuperá-lo. Dessa forma, seu servidor estará sempre disponível. Como exemplo — também é possível reportar esse panic para o Sentry!

### Validação de JSON

O Gin pode analisar e validar o JSON de uma requisição — por exemplo, verificando a existência de valores obrigatórios.

### Agrupamento de rotas

Organize suas rotas de forma melhor. Com ou sem autorização, diferentes versões de API... Além disso, os grupos podem ser aninhados infinitamente sem degradar o desempenho.

### Gerenciamento de erros

O Gin oferece uma maneira conveniente de coletar todos os erros ocorridos durante uma requisição HTTP. Eventualmente, um middleware pode gravá-los em um arquivo de log, em um banco de dados ou enviá-los pela rede.

### Renderização integrada

O Gin fornece uma API fácil de usar para renderização de JSON, XML e HTML.

### Extensível

Criar um novo middleware é muito fácil, basta conferir o código de exemplo.

## Gin v1. Estável

- Roteador sem alocação.
- Ainda o roteador e framework HTTP mais rápido. Do roteamento à escrita.
- Suíte completa de testes unitários.
- Testado em batalha.
- API congelada, novas versões não quebrarão seu código.

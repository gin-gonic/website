---
title: "Introdução"
weight: 1
---

A Gin é uma abstração de web escrita em Go (Golang). Ela apresenta uma API parecida com a Martini com desempenho muito melhor, acima de 40 vezes mais rápida graças ao [`httprouter`](https://github.com/julienschmidt/httprouter). Se precisares de desempenho e excelente produtividade, amarás a Gin.

Nesta seção introduziremos o que a Gin é, quais problemas soluciona, e como pode ajudar o teu projeto.

Ou, se estiveres pronto para usar a Gin no teu projeto, visite a [Introdução rápida](https://gin-gonic.com/docs/quickstart/).

## Características

### Rápida

Roteamento baseado na árvore de Radix, pegada de memória pequena. Sem reflexão. Desempenho de API previsível.

### Suporte à Intermediário

Uma requisição de HTTP de chegada pode ser manipulada por uma série de intermediários e a ação final. Por exemplo: Registador, Autorização, GZIP e finalmente publicar uma mensagem na Base de Dados.

### Livre de Avaria

A Gin pode capturar um pânico ocorrido durante uma requisição de HTTP e recuperá-lo. Desta maneira, o teu servidor sempre estará disponível. Como exemplo - também é possível reportar este pânico para a Sentry!

### Validação de JSON

A Gin pode analisar e validar o JSON de uma requisição - por exemplo, verificando a existência de valores obrigatórios.

### Agrupamento de Rotas

Organiza melhor as tuas rotas. Autorização obrigatória vs não obrigatória, diferentes versões de API... Além destes, os grupos podem ser encaixados ilimitadamente sem degradar o desempenho.

### Gestão de Erro

A Gin fornece uma maneira conveniente de reunir todos os erros ocorridos durante uma requisição de HTTP. Eventualmente, um intermediário pode escrevê-los para um ficheiro de registo, para uma base de dados e envia-los através da rede.

### Interpretação Embutida

A Gin fornece uma API fácil de usar para interpretação de JSON, XML e HTML.

### Extensível

A criação de um intermediário é tão fácil, apenas consulte os códigos de exemplo.


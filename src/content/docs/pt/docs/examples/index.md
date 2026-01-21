---
title: "🍳 Receitas Gin (Livro de Receitas)"
sidebar:
  order: 6
---

## Introdução

Esta seção mostra **como usar o Gin no seu código** através de pequenas receitas práticas.
Cada receita foca em um **único conceito** para que você possa aprender rápido e aplicar imediatamente.

Use estes exemplos como referência para estruturar APIs do mundo real usando Gin.

---

## 🧭 O que você aprenderá

Nesta seção, você encontrará exemplos cobrindo:

- **Fundamentos do Servidor**: Executar um servidor, roteamento e configuração.
- **Manipulação de Requisições**: Vincular dados JSON, XML e de formulários.
- **Middleware**: Usar middleware integrado e personalizado.
- **Renderização**: Servir HTML, JSON, XML e mais.
- **Segurança**: Lidar com SSL, cabeçalhos e autenticação.

---

## 🥇 Receita 1: Servidor Gin Mínimo

**Objetivo:** Iniciar um servidor Gin e lidar com uma requisição básica.

### Passos

1. Criar um roteador
2. Definir uma rota
3. Iniciar o servidor

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  r := gin.Default()

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run(":8080") // http://localhost:8080
}
```

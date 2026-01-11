---
title: "🍳 Gin Recipes (Cookbook)"
sidebar:
  order: 6
---

## Introduction

This section shows **how to use Gin in your code** through small, practical recipes.
Each recipe focuses on a **single concept** so you can learn fast and apply it immediately.

Use these examples as a reference to structure real-world APIs using Gin.

---

## 🧭 What you’ll learn

In this section, you will find examples covering:
- **Server Basics**: Running a server, routing, and configuration.
- **Request Handling**: Binding JSON, XML, and form data.
- **Middleware**: Using built-in and custom middleware.
- **Rendering**: Serving HTML, JSON, XML, and more.
- **Security**: Handling SSL, headers, and authentication.

---

## 🥇 Recipe 1: Minimal Gin Server

**Goal:** Start a Gin server and handle a basic request.

### Steps
1. Create a router
2. Define a route
3. Start the server

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
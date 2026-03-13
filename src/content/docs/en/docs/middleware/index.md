---
title: "Middleware"
sidebar:
  order: 6
---

Middleware in Gin provides a way to process HTTP requests before they reach route handlers. You can chain multiple middleware functions to handle cross-cutting concerns like logging, authentication, error handling, and more.

This section covers:

- Using Gin without default middleware
- Attaching middleware to routes and groups
- Writing custom middleware
- Error handling in middleware
- HTTP Basic Authentication
- Running goroutines inside middleware
- Setting security headers

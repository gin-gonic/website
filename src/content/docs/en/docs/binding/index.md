---
title: "Binding"
sidebar:
  order: 4
---

Gin provides a powerful binding system for parsing and validating request data from JSON, XML, YAML, form data, query strings, URIs, and headers. The binding system supports struct tags for mapping request fields and integrates with the [go-playground/validator](https://github.com/go-playground/validator) package for validation.

This section covers:

- Model binding and validation
- Custom validators
- Binding query strings, post data, URIs, and headers
- Default values for bindings
- Collection format for array parameters
- Custom unmarshalers
- HTML checkbox binding
- Multipart/urlencoded binding
- Custom struct tags for binding
- Reading the request body into different structs

---
title: "Upload de arquivos"
sidebar:
  order: 7
---

O Gin torna simples o gerenciamento de uploads de arquivos multipart. O framework fornece métodos integrados no `gin.Context` para receber arquivos enviados:

- **`c.FormFile(name)`** -- Recupera um único arquivo da requisição pelo nome do campo do formulário.
- **`c.MultipartForm()`** -- Analisa todo o formulário multipart, dando acesso a todos os arquivos enviados e valores dos campos.
- **`c.SaveUploadedFile(file, dst)`** -- Um método de conveniência que salva um arquivo recebido em um caminho de destino no disco.

### Limite de memória

O Gin define um limite de memória padrão de **32 MiB** para análise de formulários multipart via `router.MaxMultipartMemory`. Arquivos dentro desse limite são armazenados em buffer na memória; qualquer coisa além disso é gravada em arquivos temporários no disco. Você pode ajustar esse valor conforme as necessidades da sua aplicação:

```go
router := gin.Default()
// Lower the limit to 8 MiB
router.MaxMultipartMemory = 8 << 20 // 8 MiB
```

### Nota de segurança

O nome do arquivo reportado pelo cliente (`file.Filename`) **não deve** ser considerado confiável. Sempre sanitize ou substitua-o antes de usá-lo em operações do sistema de arquivos. Veja a [documentação sobre Content-Disposition no MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) para detalhes.

### Subpáginas

- [**Arquivo único**](./single-file/) -- Envie e salve um único arquivo por requisição.
- [**Múltiplos arquivos**](./multiple-file/) -- Envie e salve múltiplos arquivos em uma requisição.
- [**Limitar tamanho do upload**](./limit-bytes/) -- Restrinja o tamanho do upload usando `http.MaxBytesReader`.

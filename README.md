# website
Official website for gin.

# Contribute and test

- Fork

- Get themes

```shell
git submodule update --init
```

- Update and check

```
$ hugo server -D
```

- Commit pull request

### Adding New Pages

See [Hugo's Documentation](https://gohugo.io/getting-started/directory-structure/) for more information. 

```bash
hugo new documentation/middleware/error-handling.md
```

### Content Organization

```bash
    content
    ├── documentation
    │   ├── binding
    │   │   ├── checkboxes.md
    │   │   ├── custom_struct.md
    │   │   ├── custom_validators.md
    │   │   ├── _index.md
    │   │   ├── multipart.md
    │   │   ├── multiple_binding.md
    │   │   ├── query.md
    │   │   └── query_post.md
    │   ├── extra
    │   │   ├── custom_config.md
    │   │   ├── graceful.md
    │   │   ├── _index.md
    │   │   ├── lets_encrypt.md
    │   │   ├── log_routes.md
    │   │   ├── multiple_servers.md
    │   │   ├── server_push.md
    │   │   └── single_binary.md
    │   ├── getting-started
    │   │   ├── _index.md
    │   │   ├── installation.md
    │   │   ├── jsoninter.md
    │   │   ├── quick_start.md
    │   │   └── vendor.md
    │   ├── _index.md
    │   ├── middleware
    │   │   ├── basic_auth.md
    │   │   ├── error-handling
    │   │   ├── error-handling.md
    │   │   ├── goroutines.md
    │   │   └── _index.md
    │   ├── response
    │   │   ├── different_formats.md
    │   │   ├── html.md
    │   │   ├── _index.md
    │   │   ├── json.md
    │   │   ├── multitemplate.md
    │   │   ├── reader.md
    │   │   └── static.md
    │   ├── router
    │   │   ├── grouping_routes.md
    │   │   ├── _index.md
    │   │   ├── log_file.md
    │   │   ├── middleware.md
    │   │   ├── multipart_form.md
    │   │   ├── parameters_path.md
    │   │   ├── query_form.md
    │   │   ├── query_params.md
    │   │   ├── query_post_map.md
    │   │   ├── redirect.md
    │   │   ├── requests.md
    │   │   └── uploading_files.md
    │   └── testing
    │       └── _index.md
    └── posts
        └── hello-gin.md
```

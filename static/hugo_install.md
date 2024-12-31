How to install Hugo v0.75.1:

```sh
go install github.com/jmooring/hvm@latest
```

Add this to your `.bashrc` or `.zshrc`:

```sh
export PATH=$PATH:$HOME/.cache/hvm/default
export PATH=/usr/bin:/bin:$PATH
```

Then run:

```sh
source ~/.bashrc  # Replace with ~/.zshrc for Zsh
hvm install 0.75.1
```

[Source](https://github.com/jmooring/hvm)

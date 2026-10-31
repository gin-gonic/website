GO ?= go
TOOLS_MOD := -modfile=go.tools.mod

## lint: run golangci-lint to check for issues
lint:
	$(GO) tool $(TOOLS_MOD) golangci-lint config verify
	@packages=$$($(GO) list ./...) || exit $$?; if [ -n "$$packages" ]; then $(GO) tool $(TOOLS_MOD) golangci-lint run; else echo "No Go packages to lint"; fi

## fmt: format go files using golangci-lint
fmt:
	$(GO) tool $(TOOLS_MOD) golangci-lint fmt

## test: run tests
test:
	@packages=$$($(GO) list ./...) || exit $$?; if [ -n "$$packages" ]; then $(GO) test -v -covermode=atomic -coverprofile=coverage.txt ./...; else echo "No Go packages to test"; fi

## coverage: view test coverage in browser
coverage: test
	@if [ -f coverage.txt ]; then $(GO) tool cover -html=coverage.txt; else echo "No Go coverage to display"; fi

## mod-download: download go module dependencies
mod-download:
	$(GO) mod download

## mod-tidy: tidy go module dependencies
mod-tidy:
	$(GO) mod tidy

## mod-verify: verify go module dependencies
mod-verify:
	$(GO) mod verify

## install-tools: download tool dependencies
install-tools:
	$(GO) mod download $(TOOLS_MOD)

## help: print this help message
help:
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^/ /'

.PHONY: lint fmt test coverage mod-download mod-tidy mod-verify install-tools help

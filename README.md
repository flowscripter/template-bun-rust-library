# template-bun-rust-library

[![version](https://img.shields.io/github/v/release/flowscripter/template-bun-rust-library?sort=semver)](https://github.com/flowscripter/template-bun-rust-library/releases)
[![build](https://img.shields.io/github/actions/workflow/status/flowscripter/template-bun-rust-library/release-bun-rust-library.yml)](https://github.com/flowscripter/template-bun-rust-library/actions/workflows/release-bun-rust-library.yml)
[![docs](https://img.shields.io/badge/docs-API-blue)](https://flowscripter.github.io/template-bun-rust-library/index.html)
[![rust doc](https://img.shields.io/docsrs/flowscripter_template_bun_rust_library)](https://docs.rs/flowscripter_template_bun_rust_library)
[![coverage](https://codecov.io/gh/flowscripter/template-bun-rust-library/branch/main/graph/badge.svg?token=D4ISqIOY1p)](https://codecov.io/gh/flowscripter/template-bun-rust-library)
[![license: MIT](https://img.shields.io/github/license/flowscripter/template-bun-rust-library)](https://github.com/flowscripter/template-bun-rust-library/blob/main/LICENSE)

> Project template for a Rust library with Bun FFI bindings.

## Template Usage

Create a new Bun project using this as a template:

`bun create @flowscripter/template-bun-rust-library`

## Bun Module Usage

Add the module:

`bun add @flowscripter/template-bun-rust-library`

Use the module:

```typescript
import { world } from "@flowscripter/template-bun-rust-library";

world();
```

## Development

Install dependencies:

`bun install`

Test:

`cargo test`

`cargo build --release && bun test`

**NOTE**: The following tasks use Deno as it excels at these and Bun does not
currently provide such functionality:

Format:

`deno fmt`

Lint:

`cargo fmt && deno lint index.ts src/ tests/`

Generate HTML API Documentation:

`deno doc --html --name=template-bun-rust-library index.ts`

## Documentation

### Overview

Sample mermaid diagram to test rendering in markdown:

```mermaid
classDiagram
    Foo <|-- Bar
```

### API

Link to auto-generated API docs:

[API Documentation](https://flowscripter.github.io/template-bun-rust-library/index.html)

## License

MIT © Flowscripter

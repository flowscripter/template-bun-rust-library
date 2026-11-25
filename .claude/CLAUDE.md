# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Project template for a Rust library with Bun FFI bindings (`@flowscripter/template-bun-rust-library`). Demonstrates how to build a native Rust library and expose it to TypeScript/Bun via FFI.

## Commands

```bash
# Install
bun install

# Test
cargo test
cargo build --release && bun test

# Format
bunx oxfmt
cargo fmt

# Lint
bunx oxlint index.ts src/ tests/

# Generate HTML API Documentation
bunx typedoc --readme none index.ts
```

## Architecture

- `index.ts` -- public entry point, re-exports from `src/lib.ts`
- `src/lib.ts` -- TypeScript bindings; uses `bun:ffi` and `dlopen` to load the compiled Rust shared library
- `lib-path.ts` -- resolves the platform-specific path to the compiled `.so`/`.dylib`/`.dll`
- `src/lib.rs` -- Rust library source; exposes `add` via `#[no_mangle]` for FFI
- `tests/world_test.ts` -- Bun test suite for the TypeScript bindings
- `tests/integration_test.rs` -- Rust integration tests
- `Cargo.toml` -- Rust crate definition (crate-type = `cdylib` for FFI)
- `tsconfig.json` -- TypeScript config; includes `"types": ["bun", "node"]` in compilerOptions

The Rust library must be built with `cargo build --release` before running `bun test`, as the FFI binding loads the compiled artifact at runtime.

import { dlopen, FFIType } from "bun:ffi";
import { getLibPath } from "./lib-path.ts";

const {
  symbols: {
    add,
  },
} = dlopen(
  await getLibPath("libflowscripter_template_bun_rust_library"),
  {
    add: {
      args: [
        FFIType.i32,
        FFIType.i32,
      ],
      returns: FFIType.i32,
    },
  },
);

/**
 * Adds 2 and 2 and logs the result as "World 4"
 */
export function world(): void {
  console.info(`World ${add(2, 2)}`);
}

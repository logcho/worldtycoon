import { fileURLToPath } from "node:url";

import { createJiti } from "jiti";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

const jiti = createJiti(fileURLToPath(import.meta.url));
await jiti.import("./lib/env.ts");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // ...
};

export default nextConfig;

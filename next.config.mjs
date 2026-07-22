/** @type {import('next').NextConfig} */
const nextConfig = {
  // @wasmer/sdk + Pyodide use SharedArrayBuffer, which requires cross-origin
  // isolation. "credentialless" (not "require-corp") lets cross-origin CDN
  // resources (Monaco, Pyodide, Wasmer registry) load without CORP headers.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
  // Keep native mongoose out of the client/server bundle transforms.
  serverExternalPackages: ["mongoose"],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

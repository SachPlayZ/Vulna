import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://o6lrfhdwxeh525g5.public.blob.vercel-storage.com; worker-src 'self' blob:; manifest-src 'self'" },
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
      ],
    }];
  },
  webpack(config) {
    config.experiments = { ...(config.experiments ?? {}), asyncWebAssembly: true, syncWebAssembly: true, topLevelAwait: true };
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'isomorphic-ws': require.resolve('./src/web/browser-websocket.ts'),
    };
    config.resolve.fallback = { ...(config.resolve.fallback ?? {}), fs: false, net: false, tls: false, child_process: false };
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias ?? {}),
      '.js': ['.ts', '.tsx', '.js'],
    };
    return config;
  },
};

export default nextConfig;

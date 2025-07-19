/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'challenge-api-production-c89a.up.railway.app'], // ou seu domínio real
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'challenge-api-production-c89a.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
    // Permitir data URLs
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  eslint: {
    // Ignorar erros de ESLint durante o build para produção
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar erros de TypeScript durante o build para produção
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

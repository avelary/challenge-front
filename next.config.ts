/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // ou seu domínio real
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

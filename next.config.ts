import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   experimental: {
    serverComponentsExternalPackages: ['pdf-lib', '@pdf-lib/fontkit'],
  },
};

module.exports = {
  async redirects() {
    return [
      {
        source: '/certificate/',
        destination: '/certificate',
        permanent: true,
        has: [
          {
            type: 'query',
            key: 'id',
          }
        ]
      }
    ]
  }
}

export default nextConfig;

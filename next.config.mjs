/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/backend/:path*',
        destination: `${serverUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

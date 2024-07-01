/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*', // Замените на адрес вашего бэкенда
      },
    ];
  },
};


export default nextConfig;

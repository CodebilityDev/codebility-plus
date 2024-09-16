/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
    ]
    // domains: ["https://images.unsplash.com", "i.redd.it"],
  },
}

export default nextConfig
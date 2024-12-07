/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      dangerouslyAllowSVG: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'img.shields.io',
        },
        {
            protocol: 'https',
            hostname: 'contrib.rocks',
        }
      ],
    }
}
  
export default nextConfig;

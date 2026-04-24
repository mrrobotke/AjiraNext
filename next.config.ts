import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "**.gravatar.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
  async redirects() {
    return [
      // Epic 0 PR-1: the canonical employers surface is now /for-employers.
      // Keep a permanent redirect so any outbound links to /employers
      // continue to resolve (and sitemap.xml can only advertise the
      // canonical URL).
      {
        source: "/employers",
        destination: "/for-employers",
        permanent: true,
      },
      {
        source: "/employers/:path*",
        destination: "/for-employers/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

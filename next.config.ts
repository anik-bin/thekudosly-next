import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "*.googleusercontent.com",
          port: "",
          pathname: "**",
        },
        {
          protocol: "https",
          hostname: "i.ytimg.com",
          port: "",
          pathname: "**",
        },
        {
          protocol: "https",
          hostname: "img.icons8.com",
          port: "",
          pathname: "**",
        }
      ],
    },
};

export default nextConfig;

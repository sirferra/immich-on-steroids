import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images:{
    remotePatterns:[],
    localPatterns: [
      { pathname: "/api/assets/**" },
      { pathname: "/api/assets/**", search: "?size=thumbnail" },
      { pathname: "/api/assets/**", search: "?size=preview" },
    ],
  }
};

export default nextConfig;

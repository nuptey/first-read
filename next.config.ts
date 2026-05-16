import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow PDF uploads up to the 10 MB client-side cap. The proxy buffers the
    // request body for re-reads; the default 10 MB ceiling can truncate a
    // 10 MB file once multipart envelope overhead is added.
    proxyClientMaxBodySize: "12mb",
  },
};

export default nextConfig;

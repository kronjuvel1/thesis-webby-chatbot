const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const withPWA = require('next-pwa')({
  dest: 'public', // The directory where service worker files will be generated
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  register: true, // Auto-register the service worker
  skipWaiting: true, // Update the service worker immediately on install
});

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost"
        },
        {
          protocol: "http",
          hostname: "127.0.0.1"
        },
        {
          protocol: "https",
          hostname: "**"
        }
      ]
    },
    experimental: {
      serverComponentsExternalPackages: ["sharp", "onnxruntime-node"]
    }
  })
)

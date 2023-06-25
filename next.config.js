/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/auth",
      },
    ];
  },
};

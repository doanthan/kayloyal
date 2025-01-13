/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['i.pinimg.com', 'upload.wikimedia.org'],
    imageSizes: [48, 64, 88, 96, 128, 256, 384, 416],
  }
}

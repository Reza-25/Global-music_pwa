import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // PWA aktif hanya saat production
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);
/** Proxy DEV: API e uploads para o backend local. */
module.exports = [
  {
    context: ['/api'],
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  {
    context: ['/uploads'],
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true,
  },
];

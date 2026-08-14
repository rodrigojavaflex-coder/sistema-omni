/** Proxy DEV: rota SSE sem buffer; demais APIs seguem para o backend local. */
module.exports = [
  {
    context: ['/api/irregularidades/fluxo/events'],
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyRes(proxyRes) {
      const contentType = proxyRes.headers['content-type'] ?? '';
      if (contentType.includes('text/event-stream')) {
        proxyRes.headers['cache-control'] = 'no-cache, no-transform';
        proxyRes.headers['connection'] = 'keep-alive';
        proxyRes.headers['x-accel-buffering'] = 'no';
      }
    },
  },
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

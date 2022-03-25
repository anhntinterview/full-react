const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/v1/h5p/core',
    createProxyMiddleware({
      target: 'https://cdn.ooolab.edu.vn/public/dev',
      changeOrigin: true,
    })
  );
  app.use(
    '/v1/h5p/editor',
    createProxyMiddleware({
      target: 'https://cdn.ooolab.edu.vn/public/dev',
      changeOrigin: true,
    })
  );
  app.use(
    '/v1/h5p/libraries',
    createProxyMiddleware({
      target: 'https://cdn.ooolab.edu.vn/public/dev',
      changeOrigin: true,
    })
  );
  app.use(
    '/v1/h5p/temp',
    createProxyMiddleware({
      target: 'https://cdn.ooolab.edu.vn/public/dev',
      changeOrigin: true,
    })
  );
  app.use(
    '/v1/h5p/content',
    createProxyMiddleware({
      target: 'https://cdn.ooolab.edu.vn/public/dev',
      changeOrigin: true,
    })
  );
  app.use(
    '/v1/h5p/cached',
    createProxyMiddleware({
      target: 'https://cdn.ooolab.edu.vn/public/dev',
      changeOrigin: true,
    })
  );
  app.use(
    '/v1/h5p',
    createProxyMiddleware({
      target: 'https://api-dev.ooolab.edu.vn',
      changeOrigin: true,
    })
  );
};
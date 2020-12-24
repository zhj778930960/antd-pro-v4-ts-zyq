/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api': {
      target: 'http://10.30.20.160:17001/api/v1', //http://dev.do.xmfunny.com/api/v1
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  test: {
    '/api/': {
      target: 'http://pre.do.xmfunny.com/api/v1',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'http://pre.do.xmfunny.com/api/v1',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};

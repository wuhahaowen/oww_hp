module.exports = {
  webpack: {
    configure: {
      ignoreWarnings: [
        {
          module: /node_modules\/@antv/,
        },
      ],
      
    },
  },
  devServer: {
    proxy: {
      '/go2rtc/api/onvif': {
        target: 'http://localhost:5123',
       // target: 'http://localhost:5128',
       // target: 'http://1.116.114.238:5128',
        changeOrigin: true,
        pathRewrite : { '^/go2rtc': '' } // 移除代理路径前缀
      },
      '/api': {
        target: 'http://localhost:5124',
       //  target: 'http://1.116.114.238:5129',
        changeOrigin: true
      },
      '/config/hass-panel/upload': {
        target: 'http://localhost:80',
        changeOrigin: true
      }
    }
    // ...
  }
}; 
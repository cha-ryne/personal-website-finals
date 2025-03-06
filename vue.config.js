// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // Set base URL for production deployment
  publicPath: process.env.NODE_ENV === 'production' 
    ? '/' 
    : '/',
  
  // Output directory (Vercel looks for dist by default)
  outputDir: 'dist',
  
  // Generate sourcemaps for production build
  productionSourceMap: false,
  
  // Configure webpack for better performance
  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
      }
    }
  },
  
  // CSS configuration
  css: {
    // Extract CSS into separate files
    extract: process.env.NODE_ENV === 'production',
    // Enable source maps
    sourceMap: false
  },
  
  // Dev server configuration
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
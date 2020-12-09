module.exports = [
  {
    input: './src/core/observer.js',
    output: {
      file: './dist/main.js',
      format: 'umd',
      name: 'Observer'
    }
  },
  {
    input: './src/platform/weapp/wrap.js',
    output: {
      file: './example/weapp/core/weapp.js',
      format: 'cjs',
    }
  },
  {
    input: './src/platform/weapp/wrap.js',
    output: {
      file: './dist/weapp.js',
      format: 'cjs',
    }
  }
];
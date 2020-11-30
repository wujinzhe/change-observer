const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  // collectCoverage: true, // 是否收集测试时的覆盖率信息
  // collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,mjs}'], // 哪些文件需要收集覆盖率信息
  testMatch: [ // 匹配的测试文件
    '<rootDir>/__test__/?(*.)(spec|test).{js,jsx,mjs}'
  ],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest'
  },
};
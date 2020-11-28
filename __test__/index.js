const { deepCopy } = require('../src/utils')
const deepCopy1 = require('deepcopy')

var a = {
  a: 1,
  b: 2,
  f: () => {},
  s: Symbol(),
  dd: new Date()
}

console.log(deepCopy(a))
console.log(deepCopy1(a))
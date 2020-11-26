const { deepCopy, isPrimitiveObject, isPrimitiveValue, isValidProperty } = require('../src/utils.js')

test('deepCopy object', () => {
  var obj = {
    a: 1,
    b: 2,
    c: 3,
    d: [1, 2, 3, 4],
    f: {
      a: 1,
      d: [1, 2, 3, 4]
    }
  }
  expect(deepCopy(obj)).toEqual(obj)
})

test('deepCopy number', () => {

  var obj1 = 1
  expect(deepCopy(obj1)).toEqual(obj1)
})

test('deepCopy array', () => {
  var obj2 = [1, 2, {
    a: 1,
    b: 2,
    c: [1, 2, 3]
  }]
  expect(deepCopy(obj2)).toEqual(obj2)
})

test('isPrimitiveObject object', () => {
  var obj2 = {
    a: 1
  }
  expect(isPrimitiveObject(obj2)).toEqual(true)
})

test('isPrimitiveObject array', () => {
  var obj2 = [1, 2]
  expect(isPrimitiveObject(obj2)).toEqual(true)
})


test('isPrimitiveObject number', () => {
  var obj2 = 123
  expect(isPrimitiveObject(obj2)).toEqual(false)
})

test('isPrimitiveObject symbol', () => {
  var obj2 = Symbol()
  expect(isPrimitiveObject(obj2)).toEqual(false)
})

test('isPrimitiveObject function', () => {
  var obj2 = () => {}
  expect(isPrimitiveObject(obj2)).toEqual(false)
})

test('isPrimitiveObject date', () => {
  var obj2 = new Date()
  expect(isPrimitiveObject(obj2)).toEqual(false)
})

test('isPrimitiveValue number', () => {
  var obj2 = 123
  expect(isPrimitiveValue(obj2)).toEqual(true)
})

test('isPrimitiveValue object', () => {
  var obj2 = {}
  expect(isPrimitiveValue(obj2)).toEqual(false)
})

test('isPrimitiveValue array', () => {
  var obj2 = []
  expect(isPrimitiveValue(obj2)).toEqual(false)
})
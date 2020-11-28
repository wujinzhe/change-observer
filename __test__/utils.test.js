const { isPrimitiveObject, isPrimitiveValue, isValidProperty } = require('../src/utils.js')

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
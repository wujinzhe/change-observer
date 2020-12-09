import { isPrimitiveObject, isPrimitiveValue, compareValue } from '../src/core/utils.js'

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

test('compareValue1 number equal', () => {
  var value1 = 1
  var value2 = 1

  expect(compareValue(value1, value2)).toEqual(true)
})

test('compareValue1 number unequal', () => {
  var value1 = 1
  var value2 = 2

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 string unequal', () => {
  var value1 = '1'
  var value2 = '2'

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 string equal', () => {
  var value1 = '1'
  var value2 = '1'

  expect(compareValue(value1, value2)).toEqual(true)
})

test('compareValue1 unequal', () => {
  var value1 = '1'
  var value2 = 1

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 date1', () => {
  var value1 = new Date('2020-10-10')
  var value2 = new Date('2020-10-10')

  expect(compareValue(value1, value2)).toEqual(true)
})

test('compareValue1 date2', () => {
  var value1 = new Date('2020-10-10')
  var value2 = new Date('2020-10-10 10:00:00')

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 RegExp equal', () => {
  var value1 = /.*/gi
  var value2 = /.*/gi

  expect(compareValue(value1, value2)).toEqual(true)
})

test('compareValue1 RegExp unequal', () => {
  var value1 = /.*/gi
  var value2 = /1.*/gi

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 Array unequal', () => {
  var value1 = [1]
  var value2 = [2]

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 Array unequal', () => {
  var value1 = [{name: 11}]
  var value2 = [{name: 22}]

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 Array unequal', () => {
  var value1 = [{name: 11}, [1,2]]
  var value2 = [{name: 11}, [1,2]]

  expect(compareValue(value1, value2)).toEqual(true)
})

test('compareValue1 Object unequal', () => {
  var value1 = {
    name: 111
  }
  var value2 = {
    obj: 111
  }

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 Object equal', () => {
  var value1 = {
    a: 1,
    b: 2,
    c: [1,2,3,{name: 11}]
  }
  var value2 = {
    a: 1,
    b: 2,
    c: [1,2,3,{name: 11}]
  }

  expect(compareValue(value1, value2)).toEqual(true)
})

test('compareValue1 function unequal', () => {
  var value1 = () => {}
  var value2 = () => {}

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 function equal', () => {
  var value1 = () => {}
  var value2 = value1

  expect(compareValue(value1, value2)).toEqual(true)
})

test('compareValue1 promise unequal', () => {
  var value1 = Promise.resolve()
  var value2 = value1.then()

  expect(compareValue(value1, value2)).toEqual(false)
})

test('compareValue1 function equal', () => {
  var value1 = Promise.resolve()
  var value2 = value1

  expect(compareValue(value1, value2)).toEqual(true)
})

test('compareValue1 new String equal', () => {
  var value1 = new String('11')
  var value2 = new String('11')

  expect(compareValue(value1, value2)).toEqual(false)
})
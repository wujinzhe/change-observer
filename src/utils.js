
/** 是否为原始对象 */
function isPrimitiveObject(value) {
  return toString.call(value) === '[object Object]' || toString.call(value) === '[object Array]'
}

/** 是否为基本类型 */
function isPrimitiveValue(value) {
  return !(value instanceof Object)
}

/** 是否为有效属性 */
function isValidProperty(target, props) {
  return (
    target.hasOwnProperty(props) &&
    Object.getOwnPropertyDescriptor(target, props).enumerable &&
    Object.getOwnPropertyDescriptor(target, props).configurable
  )
}

module.exports = {
  isPrimitiveValue,
  isPrimitiveObject,
  isValidProperty
}
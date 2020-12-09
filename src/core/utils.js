/** 深拷贝 目前只支持基本数据类型 Object Array */
/** 获取值的类型 */
function getType(value) {
  const type = typeof value
  if (type !== 'object') {
    /**
     * Symbol
     * Number
     * BigInt
     * String
     * Undefined
     * Boolean
     * Function
     */

     return type
  } else {
    /**
     * Array
     * Object
     * new Number()
     * new String()
     * new Boolean()
     * null
     * Promise
     * Set
     * Map
     * RegExp
     */
    if (Array.isArray(value)) return 'Array'

    if (value === null) return 'null'

    return toString.call(value).slice(8, -1)
  }
}

/** 深拷贝 */
function deepCopy(data) {
  // 如果data为原始类型，则直接返回
  if (isPrimitiveValue(data)) return data

  let cloneData

  switch(getType(data)) {
    case 'symbol':
    case 'number':
    case 'string':
    case 'undefined':
    case 'null':
    case 'boolean':
    case 'bigint':
      return data
    case 'Number':
      return new Number(data.valueOf())
    case 'String':
      return new String(data.toString())
    case 'Boolean':
      return new Boolean(data.valueOf())
    case 'Date':
      return new Date(data.getTime())
    case 'RegExp':
      return new RegExp(value.source, value.flags)
    case 'Array':
      cloneData = []
      break
    case 'Object': 
      cloneData = {}
      break;
    case 'Function':
      return data
    case 'Promise':
      return data
    default:
      return data
  }
  
  for (let i in data) {
    const item = data[i]
    const subType = getType(item)

    cloneData[i] = (subType === 'Array' || subType === 'Object')
      ? deepCopy(item) : item
  }

  return cloneData
}

/** 是否为原始对象 */
function isPrimitiveObject(value) {
  const type = getType(value)
  return type === 'Object' || type === 'Array'
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

/** 比较两个值是否相等
 * @param {Any} value1
 * @param {Any} value2
 * 
 * TODO: 是否需要添加强比较的标识
 */
function compareValue(value1, value2) {
  const type1 = getType(value1)
  const type2 = getType(value2)

  if (type1 !== type2) return false
  
  // 下面的两个值的类型一定都是相等的
  // 两个值都为基础类型
  if (
    isPrimitiveValue(value1)
  ) return value1 === value2

  // 如果两个值都是对象类型Object Array
  if (isPrimitiveObject(value2)) {
    const keys1 = Object.keys(value1)
    const keys2 = Object.keys(value2)

    // 先比两个对象所拥有的属性的个数
    if (keys1.length !== keys2.length) return false

    for (let i in value1) {
      return compareValue(value1[i], value2[i])
    }
  }

  // 如果两个都为Date，需要比较两个的时间戳
  if (type1 === 'Date') {
    return value1.getTime() === value2.getTime()
  }

  // 如果两个值都为RegExp，则只要source 和 flag相等即为相等
  if (type1 === 'RegExp') {
    return (
      value1.source === value2.source &&
      value1.flags === value2.flags
    )
  }

  // 其他类型都为浅比较, 如果值为new Number()  new String() 都会只进行浅比较，并且值为false
  return value1 === value2
}


export {
  deepCopy,
  isPrimitiveValue,
  isPrimitiveObject,
  isValidProperty,
  compareValue
}

import { IMPORTANT, MEDIA_QUERYS, BASE_MEDIA_QUERY } from './constant'
import { groupBy } from './utils/index'
import { getConfig } from './config'
let preArry = []
const queryObj = { }
export function pushPreObj (obj) {
  return preArry.push(obj)
}

export function getPreArray () {
  return preArry
}

export function clearPreArray () {
  preArry = []
}

export function pushQuery (key, obj) {
  // if queryObj has key then push else set key is Array
  if (Object.prototype.hasOwnProperty.call(queryObj, key)) {
    queryObj[key].push(obj)
  } else {
    queryObj[key] = [obj]
  }
}

const isImportant = () => { getConfig(IMPORTANT) }
function getCssSingle ({ classStr, css, pseudo }) {
  classStr = classStr.replace(/(@|:|#)/g, '\\$1')
  if (pseudo) {
    classStr = classStr + `:${pseudo}`
  }
  return css.reduce((t, c, i) => t + (isImportant ? `${c} !important; ` : `${c}; `), `.${classStr}{ `) + '}'
}

function sortCss (a, b) {
  if (a !== undefined && b !== undefined) {
    return parseInt(a.num) - parseInt(b.num)
  } else {
    return 0
  }
}

function renderArray (array) {
  let cssStr = ''
  const cssObject = groupBy(array.sort((a, b) => a.order - b.order), 'name')
  for (const key in cssObject) {
    if (Object.prototype.hasOwnProperty.call(cssObject, key)) {
      cssStr += `/* ${cssObject[key][0].name || 'unknow name'} order ${cssObject[key][0].order} */\n`
      cssStr += cssObject[key]
        .sort(sortCss)
        .map(getCssSingle)
        .join('\n')
      cssStr += '\n\n'
    }
  }
  return cssStr
}

export function renderCss () {
  let cssStr = ''
  cssStr += renderArray(preArry)
  const queryConfigObj = { ...BASE_MEDIA_QUERY, ...getConfig(MEDIA_QUERYS) }
  for (const key in queryObj) {
    if (Object.prototype.hasOwnProperty.call(queryObj, key)) {
      cssStr += `@media ${queryConfigObj[key]}{\n`
      cssStr += renderArray(queryObj[key])
      cssStr += '}'
    }
  }
  return cssStr
}

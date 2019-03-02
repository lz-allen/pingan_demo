

import XLSX from 'xlsx'

const debounce = (fn, wait) => {
  let timeout = null;
  return function () {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}
const importExcel = (id) => {
  let promise = new Promise((resolve, reject) => {
    let wb // 读取完成的数据
    let rABS = false // 是否将文件读取为二进制字符串
    let obj = document.getElementById(id)
    if (!obj.files) {
      return
    }
    let f = obj.files[0]
    let reader = new FileReader()
    if (rABS) {
      reader.readAsArrayBuffer(f)
    } else {
      reader.readAsBinaryString(f)
    }
    let arr = []
    reader.onload = function (e) {
      try {
        let data = e.target.result
        if (rABS) {
          wb = XLSX.read(btoa(fixdata(data)), {
            type: 'base64'
          })
        } else {
          wb = XLSX.read(data, {
            type: 'binary'
          })
        }
        arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        resolve({
          name: f.name,
          list: arr
        })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = function (e) {
      reject(e)
    }
  })
  return promise
}
const fixdata = (data) => { // 文件流转BinaryString
  let o = ''
  let l = 0
  let w = 10240
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}
export { debounce, importExcel }

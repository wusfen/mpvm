Page.vm = Page.data = function (data) {
  var options = {
    data: data
  }

  // methods, computed
  for (var key in data) {
    !function (value) {
      if (typeOf(value) == 'function') {
        options[key] = data[key] = injectFunction(value, data)
      }
    }(data[key])
  }

  // toJSON
  injectObject(data)

  // Page
  Page(options)
  Page.$data = data

  // vm
  return data
}

function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

// bind this, render, computed, id="value"
function injectFunction(fn, data) {
  var $fn = function (e) {
    // e.id
    if (e && e.target && e.target.id) {
      var idData = JSON.parse(e.target.id)
      e.id = idData
      Object.assign(e, idData)
    }

    // handler
    var rs = fn.apply(data, arguments)
    injectObject(data)

    // render
    var fnCode = fn.toString()
    var newData = {}
    for (var key in data) {
      var value = data[key]
      // !!return: computed
      if (typeOf(value) == 'function' && value.toString().match('return')) {
        fnCode += value.fn || value
      }
    }
    for (var key in data) {
      if(fnCode.match(key)){
        newData[key] = data[key]
      }
    }
    this.setData(newData)

    // old
    $fn.fn = fn

    // result
    return rs
  }
  // coumputed
  if (fn.toString().match('return')) {
    $fn.toJSON = $fn.toString = $fn.valueOf = function () {
      return fn.apply(data, arguments)
    }
  }
  return $fn
}

// xxx: !{{obj.value}}
// toJSON
function injectObject(obj, count) {
  // xxx: !{{obj.value}}
  return


  if (count > 1000) return
  if (typeOf(obj) == 'object' && !obj.toJSON && count > 0) { // count>0: !!__webviewId__
    obj.toJSON = function () {
      var toJSON = this.toJSON
      delete this.toJSON
      var json = JSON.stringify(obj)
      this.toJSON = toJSON
      return json
    }
  }

  if (typeOf(obj) == 'object' || typeOf(obj) == 'array') {
    for (var key in obj) {
      injectObject(obj[key], (count || 0) + 1)
    }
  }

}

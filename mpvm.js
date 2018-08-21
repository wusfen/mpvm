Page.vm = function (options) {
  // vm
  var vm = {}
  Object.assign(vm, options)
  Object.assign(vm, options.data)
  Object.assign(vm, options.computed)
  Object.assign(vm, options.methods)

  // inject
  for (var key in vm) {
    !function (fn) {
      if (typeof fn == 'function') {
        vm[key] = injectFunction(vm, fn)
      }
    }(vm[key])
  }

  // alias
  vm.onLoad = vm.mounted

  // Page init
  Page(vm)
  Page.vm = vm
  return vm
}

function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

// bind this, render, computed, e.id
function injectFunction(vm, fn) {
  var $fn = function (e) {
    // e.id
    if (e && e.target && e.target.id) {
      var id = e.target.id
      e.id = isNaN(id) ? id : +id
    }

    // handler
    var rs = fn.apply(vm, arguments)

    // newData
    var fnCode = fn.toString()
    var newData = {}
    for (var key in vm) {
      var value = vm[key]
      // !return: !computed
      if (typeOf(value) == 'function') {
        var fun = value.fn || value
        if (fun.toString().match('return')) {
          fnCode += fun
        }
      }
    }
    for (var key in vm) {
      if (fnCode.match(key)) {
        newData[key] = vm[key]
      }
    }

    // update view
    this.setData(newData)

    // result
    return rs
  }

  // coumputed
  if (fn.toString().match('return')) {
    $fn.toJSON = $fn.toString = $fn.valueOf = function () {
      return fn.apply(vm, arguments)
    }
  }

  // old
  $fn.fn = fn

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

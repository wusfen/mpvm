Page.vm = function (options) {
  // data -> vm
  var data = options.data || {}
  Object.assign(data,
    options.computed,
    options.methods
  )
  // page event handlers
  var _data = Object.assign({}, options)
  delete _data.data
  delete _data.computed
  delete _data.methods
  Object.assign(data, _data)

  // inject
  for (var key in data) {
    !function (fn) {
      if (typeof fn == 'function') {
        data[key] = injectFunction(data, fn)
        options[key] = data[key]
      }
    }(data[key])
  }

  // onLoad
  options.mounted = options.mounted || options.onLoad
  options.onLoad = function () {
    var self = this
    // $page
    data.$page = this
    // setData
    data.setData = function () {
      self.setData.apply(self, arguments)
    }
    // $foceUpdate
    data.$foceUpdate = function () {
      foceUpdate(data)
    }
    // $route
    data.$route = this.route
    // mounted
    options.mounted && options.mounted.apply(this, arguments)
  }

  // Page init
  Page(options)
  Page.data = data

  return data
}

// bind this, render, computed, e->arg
function injectFunction(vm, fn) {
  var $fn = function (e) {
    var args = arguments

    // data-arg="value" -> handler(value)
    var target = e && e.target
    if (target) {
      var dataset = target.dataset
      if (dataset.arg) {
        args = [dataset.arg]
      }
    }

    // handler
    var rs = fn.apply(vm, args)

    // update view
    foceUpdate(vm)

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

// update view
function foceUpdate(vm) {
  // newData
  var newData = {}
  for (var key in vm) {
    !function (value) {
      if (typeof value == 'function') { // computed
        var fun = value.fn || value
        if (!fun.toString().match('return')) {
          return
        }
      }
      if (value === undefined) { // fix setData undefined
        value = ''
      }
      newData[key] = value
    }(vm[key])
  }

  // protected
  delete newData.$page

  // update view
  vm.setData(newData)
}

// proxy
function getProxy(data){
  return new Proxy(vm, {
    set: function (vm, key, value) {
      vm[key] = value
      setTimeout(function(){
        vm.$foceUpdate()
      }, 1)
      return true
    },
    get: function (vm, key) {
      setTimeout(function () {
        vm.$foceUpdate()
      }, 1)
      return vm[key]
    }
  })
}
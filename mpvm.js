Page.vm = function (options) {
  return new VM(options)
}

function VM(options) {

  // data
  var data = this
  VM.assign(this, options)
  options.data = data

  // proxy
  var proxy = VM.getProxy(data)

  // methods
  for (var key in data) {
    if(!data.hasOwnProperty(key)) continue
    !function (fn) {
      if (typeof fn == 'function') {
        // bind proxy
        var $fn = VM.inject(proxy, fn)
        options[key] = data[key] = $fn
        // computed
        // computed不能绑定proxy，里面取值proxy会散发setData，然后又触发toJSON，造成死循环
        if(fn.toString().match('return')){
          $fn.toJSON = $fn.toString = $fn.valueOf = function () {
            return fn.call(data)
          }
        }
      }
    }(data[key])
  }

  // onLoad
  options.mounted = options.mounted || options.onLoad
  options.onLoad = function () {
    var self = this
    // $page
    data.$page = this
    // $route
    data.$route = this.route
    // mounted
    options.mounted && options.mounted()
  }

  // init
  Page(options)
  Page.options = options
  Page.data = this
  Page.proxy = proxy

  // return proxy
  return proxy
}
VM.assign = function (data, options) {
  var _options = Object.assign({}, options)
  delete _options.data
  delete _options.methods
  delete _options.computed
  Object.assign(data,
    options.data,
    options.methods,
    options.computed,
    _options,
  )
}
// bind this, render, computed, e->arg
VM.inject = function (vm, fn) {
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

    // result
    return fn.apply(vm, args)
  }

  // old
  $fn.fn = fn

  return $fn
}
VM.getProxy = function (data) {
  return new Proxy(data, {
    set: function (data, key, value) {
      data[key] = value
      data.$render()
      return true
    },
    get: function (data, key) {
      data.$render()
      return data[key]
    }
  })
}
VM.prototype = {
  $route: '',
  $page: null,
  setData: function () {
    var $page = this.$page
    $page.setData.apply($page, arguments)
  },
  $foceUpdate: function () {
    console.log('fu')
    var vm = this
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
  },
  $render: function () {
    var self = this
    clearTimeout(this.__timer__)
    this.__timer__ = setTimeout(function () {
      self.$foceUpdate()
    }, 41)
  },
}

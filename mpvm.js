Page.VM = function(options) {
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
    if (data.hasOwnProperty(key)) {
      ! function(fn) {
        if (typeof fn == 'function') {
          // bind proxy
          var $fn = VM.inject(proxy, fn)
          options[key] = data[key] = $fn
        }
      }(data[key])
    }
  }

  // onLoad
  options.mounted = options.mounted || options.onLoad
  options.onLoad = function() {
    var self = this
    var args = arguments

    // $page
    data.$page = this
    data.$page.toJSON = function() {} // $page.data.$page.data..
    data.$route = this.route

    // mounted
    setTimeout(function() {
      options.mounted && options.mounted.apply(self, args)
    }, 1)
  }

  // onShow
  var _onShow = options.onShow
  options.onShow = function() {
    _onShow && _onShow.apply(this, arguments)
    data.$render()
    // dev
    Page[this.route] = this
    Page.page = this
    Page.options = options
    Page.data = data
    Page.vm = proxy
  }

  // init
  Page(options)

  // return proxy
  return proxy
}
VM.assign = function(data, options) {
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
  for (var key in options.computed) {
    var fn = options.computed[key]
    if (typeof fn == 'function') {
      fn.isComputed = true
    }
  }
}
// bind this, render, computed, handler(dataset.e||e, dataset)
VM.inject = function(vm, fn) {
  var $fn = function(e) {
    var args = arguments

    // handler(dataset.e||e, dataset)
    if (!this.$page) { // by view
      if (e && e.target) {
        var dataset = e.target.dataset || {}
        args = []
        args[0] = e
        args[1] = dataset
        if ('e' in dataset) {
          args[0] = dataset.e
        }
      }
    }

    // bind this, result
    return fn.apply(vm, args)
  }

  // computed
  if (fn.isComputed) {
    $fn.toJSON = $fn.toString = $fn.valueOf = function() {
      // 避免 toJSON->$render->setData->toJSON 死循环
      VM.__isToJSON__ = true
      var rs = fn.call(vm)
      VM.__isToJSON__ = false
      return rs
    }
  }

  // old
  $fn.fn = fn

  return $fn
}
VM.getProxy = function(data) {
  Proxy = undefined
  if (typeof Proxy == 'undefined') {
    var proxy = {}
    for (var key in data) {
      ! function(key) {
        proxy[key] = data[key]
        Object.defineProperty(proxy, key, {
          enumerable: true,
          configurable: true,
          get: function() {
            data.$render()
            return data[key]
          },
          set: function(value) {
            data[key] = value
            data.$render()
          }
        })
      }(key)
    }
    return proxy
  }
  return new Proxy(data, {
    set: function(data, key, value) {
      data[key] = value
      data.$render()
      return true
    },
    get: function(data, key) {
      data.$render()
      return data[key]
    }
  })
}
VM.prototype = {
  $route: '',
  $page: null,
  setData: function() {
    var $page = this.$page
    $page.setData.apply($page, arguments)
  },
  $foceUpdate: function() {
    console.log('$foceUpdate')
    var vm = this
    // newData
    var newData = {}
    for (var key in vm) {
      ! function(value) {
        if (typeof value == 'function') { // computed
          var fun = value.fn || value
          if (!fun.isComputed) {
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
    delete newData.$page // --console.warn

    // update view
    vm.setData(newData)
  },
  $render: function() {
    if (VM.__isToJSON__) return

    var pages = getCurrentPages()
    if (this.$page != pages[pages.length - 1]) return

    var self = this
    clearTimeout(this.__timer__)
    this.__timer__ = setTimeout(function() {
      self.$foceUpdate()
    }, 1)
  },
}

module.exports = VM
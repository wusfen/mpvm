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
    if (!data.hasOwnProperty(key)) continue
    !function (fn) {
      if (typeof fn == 'function') {
        // bind proxy
        var $fn = VM.inject(proxy, fn)
        options[key] = data[key] = $fn
      }
    }(data[key])
  }

  // onLoad
  options.mounted = options.mounted || options.onLoad
  options.onLoad = function () {
    var self = this
    var args = arguments

    // $page
    data.$page = this
    data.$page.toJSON = function () { } // $page.data.$page.data..
    data.$route = this.route

    // mounted
    setTimeout(function () {
      options.mounted && options.mounted.apply(self, args)
    }, 1)

    // dev
    Page.options = options
    Page.data = data
  }

  // init
  Page(options)

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
  for (var key in options.computed) {
    var fn = options.computed[key]
    if(typeof fn == 'function'){
      fn.isComputed = true
    }
  }
}
// bind this, render, computed, handler(dataset.e||e, dataset)
VM.inject = function (vm, fn) {
  var $fn = function (e) {
    var args = arguments

    // handler(dataset.e||e, dataset)
    if (!this.$page) { // by view
      if (e && e.target) {
        var dataset = e.target.dataset || {}
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
    $fn.toJSON = $fn.toString = $fn.valueOf = function () {
      // 避免 toJSON->$render->setData->toJSON 死循环
      vm.__isToJSON__ = true
      return fn.call(vm)
    }
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
    // console.log('$foceUpdate')
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
    delete newData.$page // --console.warn

    // update view
    vm.setData(newData)
  },
  $render: function () {
    if (this.__isToJSON__) {
      setTimeout(function () {
        this.__isToJSON__ = false
      }.bind(this), 1)
      return
    }

    var self = this
    clearTimeout(this.__timer__)
    this.__timer__ = setTimeout(function () {
      self.$foceUpdate()
    }, 41)
  },
}

module.exports = VM
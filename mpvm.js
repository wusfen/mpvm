/*! @preserve https://github.com/wusfen/mpvm */

function VM(options) {
  var self = this

  // $xxx
  Object.assign(this, {
    $options: options,
    $app: null,
    $page: null,
    $route: null,
  })

  // mounted -> onLoad
  if (options.mounted) {
    options.onLoad = options.mounted
  }

  // options.x -> this
  for (var key in options) {
    if (key === 'data' || key === 'computed' || key === 'methods') continue
    !function (key, value) {
      var oldValue = this[key]
      var newValue = options[key]

      if (typeof oldValue === 'function') {
        this[key] = function () {
          oldValue.apply(this, arguments)
          newValue.apply(this, arguments)
        }
      } else {
        this[key] = newValue
      }
    }.call(this, key, options[key])
  }

  // computed -> this
  for (var key in options.computed) {
    var fn = options.computed[key]
    this[key] = fn
    // toJSON -> $render -> !(noRender) -> setData -> toJSON
    fn.isComputed = true
    fn.toJSON = fn.toString = fn.valueOf = function () {
      VM.noRender = true
      var rs = this.apply(self)
      VM.noRender = false
      return rs
    }
  }

  // methods -> this
  Object.assign(this, options.methods)

  // mp
  // this -> mp options
  var mpOptions = {}
  for (var key in self) {
    !function (key, value) {
      // mp.method
      if (typeof value === 'function') {
        mpOptions[key] = function (e) {
          var args = arguments

          // mp.handler(dataset.arg||e, dataset)
          if (e && e.currentTarget) {
            var dataset = e.currentTarget.dataset || {}
            args = []
            args[0] = e
            args[1] = dataset
            if ('e' in dataset) { // -- => arg
              args[0] = dataset.e
            }
            if ('arg' in dataset) {
              args[0] = dataset.arg
            }
            if ('args' in dataset) {
              args = dataset.args
            }
          }

          // bind vm, result
          return value.apply(self, args)
        }
      }
      // 
      else {
        // mpOptions[key] = value
      }
    }(key, self[key])
  }

  // no rewrite setData
  delete mpOptions.setData

  // this.$page
  var _onLoad = mpOptions.onLoad
  mpOptions.onLoad = function () {
    self.$app = getApp()
    self.$page = this
    self.$route = this.route || this.__route__
    return _onLoad.apply(self, arguments)
  }

  // mp Page
  Page(mpOptions)
}
Object.assign(VM.prototype, {
  setData(kv, getSet, key) {
    if (VM.noRender) return
    console.log('setData', getSet || '', key || '', kv)
    var $page = this.$page

    // add computed
    VM.noRender = true
    for (var key in this) {
      var value = this[key]
      if (value && value.isComputed) {
        // console.log('isComputed', key)
        kv[key] = value
      }
    }
    VM.noRender = false

    setTimeout(() => {
      $page.setData.apply($page, [kv])
    }, 1)
  },
  $model(e) {
    var path = e.currentTarget.dataset.model
    path = path.replace(/\]/g, '')
    path = path.split(/[.[]/)
    var obj = this
    for (var i = 0; i < path.length - 1; i++) {
      var key = path[i]
      obj = obj[key]
    }
    var key = path[path.length - 1]

    obj[key] = e.detail.value
  },
  onLoad() {
    var self = this

    // data()
    var data = this.$options.data || {}
    if (typeof data === 'function') {
      data = data.apply(this)
    } else {
      data = JSON.parse(JSON.stringify(data))
    }
    Object.assign(this, data)
    this.setData(data)

    // defindeProperty
    // proxy data
    for (var key in data) {
      !function (key, value) {
        Object.defineProperty(self, key, {
          get: function () {
            // self.$render()
            var kv = {}
            kv[key] = data[key]
            self.setData(kv, 'get', key) // vm.mode .sub = value
            return data[key]
          },
          set: function (value) {
            data[key] = value
            // self.$render()
            var kv = {}
            kv[key] = value
            self.setData(kv, 'set', key) // vm.model = value
          }
        })
      }(key, data[key])
    }

  },
  onShow() {
    global.vm = this
  },
  onReady() {

  },
  onHide() {

  },
  onUnload() {

  },
})

VM.mixin = function (options) {
  var prototype = VM.prototype
  for (var key in options) {
    !function (key, value) {
      var oldValue = prototype[key]
      var newValue = value
      if (typeof oldValue === 'function') {
        prototype[key] = function () {
          oldValue.apply(this, arguments)
          newValue.apply(this, arguments)
        }
      } else {
        prototype[key] = newValue
      }
    }(key, options[key])
  }
}

module.exports = VM
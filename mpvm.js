/*! @preserve https://github.com/wusfen/mpvm */
class VM {
  constructor(options) {
    var self = this

    // $xxx
    Object.assign(this, {
      $options: options,
      $app: null,
      $page: null,
      $route: null,
    })

    // options.x -> this
    for (const key in options) {
      if (key === 'data' || key === 'computed' || key === 'methods') continue

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
    }

    // computed -> this
    for (const key in options.computed) {
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

    // bind this
    for (var key in self) {
      !function () {
        var fn = self[key]
        if (typeof fn === 'function' && !fn.isComputed) {
          self[key] = function () {
            fn.apply(self, arguments)
          }
        }
      }()
    }

    // mp Page
    Page(Object.assign({}, self, {
      onLoad() {
        self.$page = this
        self.onLoad.apply(self, arguments)
      },
      onShow() {
        self.onShow.apply(self, arguments)
      }
    }))

    global.this = this
  }
  setData() {
    var $page = this.$page
    $page.setData.apply($page, arguments)
  }
  $foceUpdate() {
    console.log('$foceUpdate')
    var self = this

    // newData
    VM.noRender = true
    var newData = {}
    for (var key in self) {
      ! function (value) {
        // !data !computed
        if (typeof value === 'function' && !value.isComputed) {
          return
        }
        // $xxx
        if (key.match(/^\$/)) {
          return
        }

        if (value === undefined) { // fix vm can not setData undefined
          value = ''
        }
        newData[key] = value
      }(self[key])
    }
    VM.noRender = false

    // console.log('newData', self, newData)

    // update view
    self.setData(newData)
  }
  $render() {
    if (VM.noRender) return
    var self = this

    // 非当前页不更新视图
    var pages = getCurrentPages()
    if (this.$page != pages[pages.length - 1]) return

    clearTimeout(this.$render.timer)
    this.$render.timer = setTimeout(function () {
      self.$foceUpdate()
    }, 100)
  }
  onLoad() {
    var self = this

    // data()
    var data = this.$options.data
    if (typeof data === 'function') {
      data = data.apply(this)
    } else {
      data = JSON.parse(JSON.stringify(data))
    }
    Object.assign(this, data)

    // defindeProperty
    for (var key in data) {
      !function (value) {
        // console.log(key, value)
        Object.defineProperty(self, key, {
          get: function () {
            self.$render()
            return data[key]
          },
          set: function (value) {
            data[key] = value
            self.$render()
          }
        })
      }(data[key])
    }

  }
  onShow() {
    global.vm = this

    this.$render()
  }
  onReady() { }
  onHide() { }
  onUnload() { }
  static mixin() { }
}

global.VM = VM

var vm = Page.VM({
  // 数据
  data: {
    model: 'mpvm.js',
    obj: {
      sub: {
        key: 'sub value'
      }
    }
  },
  // 计算属性
  computed: {
    upper: function () {
      return vm.model.toUpperCase()
    }
  },
  // 方法
  methods: {
    change: function (name, data) {
      console.log(name, data)
      this.model = 'hello ' + (name || 'world')
    }
  },
  // onLoad
  mounted: function () {
    // console.log('mounted')
    // this.change('world')
    // this.obj.sub.key = 'new sub'
  }
})

// setTimeout(function(){
//   vm.obj.sub.key = 'setTimeout'
// },2000)
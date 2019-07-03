var vm = new global.VM({
  abc: 1,
  data() {
    console.log('data', this)
    return {
      model: 'model',
      obj: {
        key: 'value'
      }
    }
  },
  computed: {
    upper() {
      return String(this.model).toUpperCase()
    }
  },
  methods: {
    getModel() {
      return this.model
    },
    change(arg) {
      console.log(arguments)
      vm.model = arg || 'new model'
    }
  },
  mounted() {
    console.log('mounted')
  },
  onShow() {
    console.log('onShow')
  }
})


var Function = (function f(){}).constructor

var fun = new Function('console.log("yes")')

console.log(fun)
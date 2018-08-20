var vm = new Page.vm({
  model: 'vmm',
  obj: {
    key: 'value',
  },
  arr: [
    { id: 11, name: 'n1' },
    { id: 22, name: 'n2' }
  ],
  computed: function () {
    return 'cp:' + Math.random()
  },
  fun: function (e) {
    console.log(e)
    vm.model = 'fun'
    vm.obj.key = 'funk'
  },
  click: function (item) {
    console.log(item)
    vm.model = item.id
  },
  onLoad: function () {
    vm.model = 'onLoad'
  }
})

// Page({
//   data: {
//     model: 'vmm',
//     obj: {
//       key: 'value',
//     },
//     arr: [
//       { id: 11, name: 'n1' },
//       { id: 22, name: 'n2' }
//     ],
//   },
//   click: function(e){
//     console.log(e)
//   }
// })
Page.vm = function (options) {
  // data -> vm
  var data = options.data || {}
  Object.assign(data, Object.assign({},
    options, // page event handlers
    options.computed,
    options.methods,
    options.data // data
  ))

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
  options.onLoad = function(){
    // route
    data.route = this.route
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

    // newData
    var newData = {}
    for(var key in vm){
      !function(value){
        if(typeof value == 'function'){ // computed
          var fun = value.fn || value
          if(!fun.toString().match('return')){
            return
          }
        }
        if(value === undefined){ // fix setData undefined
          value = ''
        }
        newData[key] = value
      }(vm[key])
    }

    // update view
    // event trigger -> method1(){ vm.method2() }
    // !vm.setData
    if (this.setData) {
      this.setData(newData)
    }

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

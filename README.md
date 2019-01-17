
# mpvm
微信小程序轻量框架（类Vue语法）


## 逻辑层

```javascript
var vm = new VM({
  // 数据
  data: {
    model: 'mpvm.js'
  },
  // 计算属性
  computed: {
    upper: function(){
      return this.model.toUpperCase()
    }
  },
  // 方法
  methods: {
    change: function(name){
      this.model = 'hello ' + (name || 'world')
    }
  },
  // onLoad
  mounted: function(){
    vm.change()
  }
})
```

### this

成员函数内的`this`指向`data`作为`vm`, 并且`computed` `methods`的成员也通过`this`访问

### 无须setData

直接通过`this`修改数据即可，框架会自动更新视图，即使在异步函数（如`setTimeout`）内亦可

`var vm = Page.VM()`返回`this`，方便在异步函数内直接使用`vm`

并且解决了小程序原生不能把数据改成`undefined`的缺陷

### computed

框架实现了原生小程序不支持的`计算属性`

### VM.mixin

`mixin`可以给所有实例注册方法，方便实现统一的行为。比如给使用`mta`对所有页面进行统计

```javascript
VM.mixin({
  onLoad(){
    console.log('mixin onLoad')
    // mta
    mta.Page.init()
  }
})
```

### mounted

`mounted`映射为`onLoad`

### 控制台调试

1. 在开发工具控制台可以通过`global.vm`访问当前页面的`vm`，方便调试

```javascript
global.vm.model = 'new model'
```

2. 通过`global.vm.page`可以访问原生的`page`实例


## 视图层
因为框架比较轻量，视图层没有多大变化

```html
{{model}}
{{computed}}
<button bind:tap="change">change</button>
```

### 传参

小程序事件处理函数不能直接传参，有且只有事件对象作为参数，
但要传递参数时只能能过`data-x="{{'value'}}"`，然后`event.target.dataset`的方式获取

所以，为了方便，本框架将`dataset`作为第二个参数传给处理函数

```javascript
handler(event, dataset)
```

#### data-arg

实际上很多数情况下我们并不会用到`event`，所以，本框架做了另外一个语法糖，如果存在`data-arg`时，将代替`event`直接作为处理函数的参数，以实现视图层传参

```html
<button bind:tap="change" data-arg="{{'my world'}}">change</button>
```
```javascript
change('my world')
```

#### data-args

```html
<button bind:tap="change" data-args="{{ [1,2,3] }}">change</button>
```
```javascript
change(1,2,3)
```


#### 注意：

小程序的`dataset`传递的参数是原数据的一个**副本**，所以传参为对象类型时，并**不能**与原数据通过`==`相等

这是小程序底层实现所决定的，这应该是底层设计存在缺陷


### 双向绑定

小程序没有直接进行双向绑定，本框架通语法糖实现

view->model: 本框架通过内置的`$model`方法和`data-model`实现视图层到逻辑层的数据修改

model->view: 逻辑层到视图层的数据传递还是原生小程序的`value="{{model}}"`

```html
<input bindinput="$model" data-model="model" value="{{model}}"></input>
```

`data-model`支持复杂的层级，如：`data-model="form.list[0].name"`


## 使用方法

1. 在入口文件`app.js`中引入[mpvm.js](https://github.com/wusfen/mpvm/blob/master/mpvm.js)
```javascript
var VM = require('./mpvm.js')
global.VM = VM
```
2. 在具体页面的js中直接使用即可
```javascript
var vm = new global.VM(options)
```





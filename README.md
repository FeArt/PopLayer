## PopLayer 简介
整个弹层是由一个弹层类PopLayer动态生成的，每生成一个，就会向PopLayer对象池里增加一个，这个对象池为全局变量top.PopLayer（这里的top表示最顶层的窗体，因为smdb的整体前台架构是基于多窗体的）的一个属性。所以对于已经生成的弹层对象，可以通过top.PopLayer.instances[index]来引用，比如要获取从父页面传过来的数据就可以用top.PopLayer.instances[index].inData来引用，调用回调函数可以通过top.PopLayer.instances[index].callback(data)来调用（此时应该注意函数的作用域为父页面，如果想改变函数的作用域，可以用apply或call函数来手动指定函数作用域）。所有的弹层配置信息都存在args这个对象里面，参数的详细信息

通过配置不同的参数能满足不同的弹层应用场合。例如，配置isModal属性可以控制生成的弹层是否有遮罩层，配置moveable可以控制生成的弹层是否可以移动等等。

##详细API介绍：
1. `Poplayer(args)`

	弹层的构造函数，接受一个对象作为初始化参数，通过配置这些参数能够实现弹层的定制。
	这里要说明的有三点：（1）初始化的过程中一定要传入上下文对象document，因为这是弹层判断父页面的依据。（2）关于inDate是父页面传给弹层页面的数据，供弹层页面的js来使用的，outData是弹层页面传回给父页面的数据，但是实际上是通过回调函数来传回去的，因为能和父页面进行通信的只有回调函数了。回调函数应该在弹层销毁前进行调用。

2. `PopLayer.prototype`

	这是弹层的原型对象，这里包括弹层对象的一些初始化方法（内容初始化，样式初始化，事件绑定）和工具方法（显示，销毁，获取页面滚动值，页面元素生成方法）

3. `PopLayer.prototype.init()`

	这是弹层对象在内存中生成之后调用的第一个方法，用来初始化（包括内容初始化，样式初始化和事件绑定）。初始化完后，整个弹层已经完整地显示在页面上了。

4. `PopLayer.prototype.initStyle()`

	用来初始化遮罩层和弹层页面的。在生成遮罩层时，为了最大限度的兼容各主流浏览器，实际上生成了两个遮罩层，一个是一个具有半透明效果（opacity = 0.3）的div，还有一个是一个具有半透明效果（opacity = 0.3）的iframe。对于webkit内核的浏览器（chrome、safari）以及Mozilla的Firefox来说，一个透明div足以，透明div在IE6下会有select穿透的bug（#FuckIE6 详情请见 [http://blog.csdn.net/yangzhihello/article/details/41207175](http://blog.csdn.net/yangzhihello/article/details/41207175)），所以不得已而为之加了一层iframe。

6. `PopLayer.prototype.initContent()`

	用来设置弹层的标题，内容区iframe的地址的，比较简单，没啥好说的。

7. `PopLayer.prototype.initEvent()`

	用来绑定事件处理程序的函数，包括弹层的拖拽，关闭（点击右上角的X，在焦点获取的情况下按“Esc”键）。

	这里要重点说明一下的是鼠标拖拽功能的实现。之前的鼠标拖拽功能一直有bug，bug就是在Chrome下快速拖动弹层时，会导致弹层脱节不响应的问题。经过调研之后，发现这个问题本质上是由于为了解决IE6 select穿透问题而引入的bug。本来鼠标的移动事件（mousemove）是绑定在top.document上面的，如果没有引入遮罩层iframe的情况下，当鼠标快速移动，即使脱离了弹层页面，鼠标移动事件处理程序仍然能够响应（弹层页面上的事件会冒泡到top.document上）。但是引入遮罩层iframe时，iframe上的mousemove事件不会冒泡到top.document上，因为他们属于不同的窗体。明白了bug产生的原因，解决起来也是很容易的，只要在iframe上在绑定一下就可以了。

8. `PopLayer.prototype.show()`

	用来显示弹层内容的，包括处理弹层显示的位置（弹层利用的是绝对定位absolute，相对于top.document.body来定位的），弹层的高度、宽度等信息。

9. `PopLayer.prototype.getScroll()`

	工具函数，用来获取页面的滚动量，屏蔽浏览器细节。

10. `PopLayer.prototype.getElement()`

	工具函数，用来动态生成弹层的内容。

11. `PopLayer.prototype.destroy()`

	弹层的销毁函数。首先在DOM中移除弹层元素，然后在对象池中销毁弹层对象，弹层编号和相应的弹层计数递减。




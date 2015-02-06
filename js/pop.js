/**
 * 弹出层类	PopLayer
 * 参数说明：args obj
 * @param	title		弹出层标题
 * @param   src			弹出层内容帧src
 * @param 	isModal		弹出层是否模态
 * @param 	moveable 	弹出层可否移动
 * @param   document	上下文文档对象
 * @param	inData		弹出层传入数据
 * @param   outData		弹出层回调数据
 * @param 	callBack	弹出层回调函数
 */
(function(){
	
	function PopLayer(args){
		//初始化参数
		this.title = args.title || "";
		this.src = args.src || "";
		this.isModal = (typeof args.isModal == "boolean") ? args.isModal : true;
		this.moveable = (typeof args.moveable == "boolean") ? args.moveable : true;
		this.document = args.document;
		this.inData = args.inData;//默认选中传入数据
		//辅助参数
		this.isDowm = false;
		this.offset = {"width" : 0, "height" : 0};
		this.initScroll = 0;
		this.id = ++top.PopLayer.id;
		//回调参数
		this.outData = args.outData;//默认回调数据 
		this.callBack = args.callBack;
		//模态加遮罩层
		var model = this.getElement();
		if(this.isModal){
			this.mybg = model.mybg;
		}
		this.myAlert = model.myAlert;
		top.PopLayer.instances[this.id] = this;
		//初始化
		this.init();
	};
	
	PopLayer.prototype = {
		
		init : function(){
			this.initStyle();//初始化样式
			this.initContent();//初始化内容
			this.initEvent();//初始化行为
		},
		
		initStyle : function(){
			if(this.isModal){
				this.mybg.css({
					"height" : Math.max(this.document.documentElement.scrollHeight, this.document.documentElement.clientHeight) - 3 + "px",
					"width" : Math.max(this.document.documentElement.scrollWidth, this.document.documentElement.clientWidth) - 4 + "px",
					"position" : "absolute" , "left" : "-10px", "top" : "0px", "filter" : "Alpha(Opacity=0.3)", "opacity" : "0.5",
					"background-color":"#FFFFFF", "z-index" : top.PopLayer.zIndexCounter++
				});
				$("iframe", this.mybg).css({
					"height" : Math.max(this.document.documentElement.scrollHeight, this.document.documentElement.clientHeight) - 3 + "px",
					"width" : Math.max(this.document.documentElement.scrollWidth, this.document.documentElement.clientWidth) - 4 + "px",
					"position" : "absolute", "left" : "0px", "top" : "0px", "border" : "0", "frameborder" : "0","framespacing" : "0",
					"marginheight" : "0", "marginwidth" : "0", "noResize" : "noResize", "scrolling" : "no", "vspale" : "0",
					"filter" : "Alpha(Opacity=0.3)", "opacity" : "0.5", "background-color" : "#FFFFFF"
				});
			}
			this.myAlert.css({"position" : "absolute", "left" : "-800px", "top" : "-800px", "overflow" : "hidden", 
				"z-index" : top.PopLayer.zIndexCounter++
			});
		},
		
		initContent : function(){
			if(this.isModal){$("body", this.document).append(this.mybg);}
			$("body", this.document).append(this.myAlert);
			var $this = this;
			$(".layerTitle", this.myAlert).html(this.title);//设置标题
			$(".layerIframe", this.myAlert).attr("src", this.src).load(function(){
				setTimeout(function(){
					$this.show();
				}, 260);
			});//显示内容帧
		},
		
		initEvent : function(){
			var $this = this;
			if(this.moveable) {//是否可拖动
				//鼠标按下事件
				$(".popup_title", this.myAlert).bind("mousedown", function(e){
					$this.isDown = true;
					$this.initScroll = $this.getScroll().height;//初始化时，滚动条高度
					$this.myAlert.css("z-index", top.PopLayer.zIndexCounter++);
					var event = window.event || e;
					//记录按下时鼠标距离弹出层位置
					$this.offset.height = event.clientY - parseInt($this.myAlert.css("top").replace(/px/, ""));
					$this.offset.width = event.clientX - parseInt($this.myAlert.css("left").replace(/px/, ""));
				});
				//鼠标拖动事件
				var mousemoveFunc = function(e){

					 if ($this.isDown) {
				        var event = window.event || e;
				        //鼠标位置
				        var t1 = event.clientY,
				        	t2 = event.clientX;
				        if(t1 < 0){
				        	t1 = 0;
			        	}
				        if(t1 > $this.document.documentElement.clientHeight){
				        	t1 = $this.document.documentElement.clientHeight;
				        }
				        if (t2 > $this.document.documentElement.clientWidth) {
				            t2 = $this.document.documentElement.clientWidth;
				        }
				        //偏移位置
				        var top = t1 - $this.offset.height + $this.getScroll().height - $this.initScroll;
				        var left = t2 - $this.offset.width;
				        //窗口大小
				        var mHeight = Math.max($this.document.body.clientHeight, $this.document.documentElement.clientHeight);
				 		var mWidth = Math.max($this.document.documentElement.clientWidth, $this.document.documentElement.scrollWidth);
				        //显示层大小
				 		var origHeight = $(".layerIframe", $this.myAlert).height() + 72;
				 		var origWidth = $(".layerIframe", $this.myAlert).width() + 42;
				 		
				        if (top > mHeight) {
				            top = mHeight;
				        }
				        //当弹出层拖出父页面范围时，将弹出层伸出父页面外的部分截除
				        if (top > mHeight - origHeight && left > mWidth - origWidth) {
				            $this.myAlert.css("height", mHeight - top + "px");
				            $this.myAlert.css("width", mWidth - left + "px");
				            $this.myAlert.css("borderWidth", "1px 0 0 1px");
				        } else if (top > mHeight - origHeight && left < mWidth - origWidth) {
				            $this.myAlert.css("height", mHeight - top + "px");
				           	$this.myAlert.css("width", origWidth + "px");
				            $this.myAlert.css("borderWidth", "1px 1px 0 1px");
				        } else if (top < mHeight - origHeight && left > mWidth - origWidth) {
							$this.myAlert.css("height", origHeight + "px");
							$this.myAlert.css("width", mWidth - left + "px");
							$this.myAlert.css("borderWidth", "1px 0 1px 1px");
						} else { //不作改变
							$this.myAlert.css("height", origHeight + "px");
							$this.myAlert.css("width", origWidth + "px");
							$this.myAlert.css("borderWidth", "1px");
						}
						$this.myAlert.css("top", top + "px");
						$this.myAlert.css("left", left + "px");
					}
				
				};
				$("iframe[name='mybg']")[0] && $($("iframe[name='mybg']")[0].contentDocument).mousemove(mousemoveFunc);//解决快速拖动时弹层不响应的bug.
				$(this.document).mousemove(mousemoveFunc).mouseup(function(e){
					if ($this.isDown) {
						$this.isDown = false;
						//$("#mybg2", $this.myAlert).remove(); //移除弹出页面上方的透明遮盖层
					}
				}).mouseout(function(e){
					var event = e || window.event;
					if(!(event.relatedTarget || event.toElement)){
						$this.isDown = false;
						//$("#mybg2", $this.myAlert).remove();
					}
				});
			}
			
			//关闭事件
			$(".close_out", this.myAlert).mouseover(function(){
				this.className = "close_over";
			}).mouseout(function(){
				this.className = "close_out";
			}).click(function(){
				$this.destroy();
			});
		},
		
		show : function(){
			this.myAlert.show();
			var layerIframe = $(".layerIframe", this.myAlert);//内容帧
			var iframeWidth = layerIframe.get(0).contentWindow.document.documentElement.scrollWidth; //iframe宽度;
			var offsetHeight = layerIframe.get(0).contentWindow.document.documentElement.offsetHeight;//<--------------------->
			var iframeHeight = Math.min(layerIframe.get(0).contentWindow.document.documentElement.scrollHeight, 750); //iframe高度;
			if($.browser.mozilla){
				iframeHeight = Math.min(iframeHeight, offsetHeight);
			}
			//内容帧大小
			layerIframe.css({"width" : iframeWidth + "px", "height" : iframeHeight + "px"});
			//边框区大小
			$(".popup_win", this.myAlert).css({"width" : iframeWidth + 22 + "px", "height" : iframeHeight + 52 + "px"});
			//内容区大小
			$(".popup_win_box", this.myAlert).css({"width" : iframeWidth + 20 + "px", "height" : iframeHeight + 50 + "px"});
			//显示区大小、位置
			this.myAlert.css({"width" : iframeWidth + 42 + "px", "height" : iframeHeight + 72 + "px"}).css({
				"left" : (this.document.documentElement.clientWidth - iframeWidth - 42) / 2 + this.document.documentElement.scrollLeft + "px",
				"top" : Math.max(this.getScroll().height + (this.document.documentElement.clientHeight - iframeHeight - 52) / 2, 0) + "px"
			});
		},
		
		getScroll : function(){
			var yScroll = 0;
			if (parent.pageYOffset) {
				yScroll = parent.pageYOffset;
			} else if (parent.document.documentElement && parent.document.documentElement.scrollTop) {
				yScroll = parent.document.documentElement.scrollTop;
			} else if (parent.document.body) {
				yScroll = document.body.scrollTop;
			}
			return {"width" : "", "height" : yScroll};
		},
		
		getElement : function(){
			return {
				"mybg" : $("<div id='mybg'></div>", this.document).append($("<iframe src='' name='mybg'></iframe>", this.document)),
				"myAlert" : $("<div class ='outer' style='display:none'></div>", this.document)
					.append($("<div class='popup_win'></div>", this.document)
						.append($("<div class='popup_win_box'></div>", this.document)
							.append($("<div class='popup_title'></div>", this.document)
								.append($("<span class='layerTitle'></span>", this.document))
								.append($("<div class='close_out'></div>", this.document)
									.append($("<img src='image/close_ico.gif' alt='关闭'/>", this.document))))
							.append($("<div class='popup_content'></div>", this.document)
								.append($("<iframe class='layerIframe' border='0' frameborder='0' framespacing='0' marginheight='0'" +
								" marginwidth='0' scrolling='no' vspale='0' align='center'></iframe>", this.document))
							))
					)
			};
		},
		
		destroy : function(){
			//清除显示层
			this.myAlert.remove();
			//清除存在的遮罩层
			if(this.isModal){
				this.mybg.remove();
			}
			//销毁池中对象
			delete top.PopLayer.instances[this.id];
			//计数器退栈
			top.PopLayer.id--;
		}
	};
	
	if(!top.PopLayer){
		PopLayer.zIndexCounter = 1000;//z-index计数器
		PopLayer.id = 0;//层对象计数
		PopLayer.instances = {};//层对象池
		PopLayer.instances.length = 0;
		top.PopLayer = PopLayer;
		
		//ESC按键事件，关闭顶层弹层页面
		$(top).unbind("keydown").keydown(function(event) { 
			if(event.which == 27) {
				for(var i in top.PopLayer.instances) {
					var layer = top.PopLayer.instances[i];
					if(layer.myAlert.css("z-index") == top.PopLayer.zIndexCounter - 1) {
						layer.destroy();
						break;
					}
				}
			}
		});
	}
	
})();
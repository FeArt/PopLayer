$(function() {
	$("#demo").click(function() {
		var pop = new PopLayer({
			title: "可移动，模态的弹层",
			src: "pop.html",
			document: document,
			isModal: true,
			moveable: true,
			inData: "这是从父页面传来的数据",
			callBack: function(data) {
				alert(data);
			}
		})
	});
	$("#demo2").click(function() {
		var pop = new PopLayer({
			title: "可移动，非模态的弹层",
			src: "pop.html",
			document: document,
			isModal: false,
			moveable: true,
			inData: "这是从父页面传来的数据",
			callBack: function(data) {
				alert(data);
			}
		})
	});
	$("#demo3").click(function() {
		var pop = new PopLayer({
			title: "不可移动，模态的弹层",
			src: "pop.html",
			document: document,
			isModal: true,
			moveable: false,
			inData: "这是从父页面传来的数据",
			callBack: function(data) {
				alert(data);
			}
		})
	});
	$("#demo4").click(function() {
		var pop = new PopLayer({
			title: "不可移动，非模态的弹层",
			src: "pop.html",
			document: document,
			isModal: false,
			moveable: false,
			inData: "这是从父页面传来的数据",
			callBack: function(data) {
				alert(data);
			}
		})
	});
})
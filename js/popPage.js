$(function() {
	$("#runCallback").click(function() {
		var pop = top.PopLayer.instances[top.PopLayer.id];
		pop.callBack(pop.inData);
	})
});
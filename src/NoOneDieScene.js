var NoOneDieScene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		
		//创建一个图层
		var layer1 = new NoOneDieLayer();
		this.addChild(layer1);
	}
});


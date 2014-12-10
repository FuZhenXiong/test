var WallSprite = cc.Sprite.extend({
	onEnter : function(){
		this._super();
	},
	//根据坐标，级别来初始化墙壁
	init : function(x,y,level){
		this._setAnchorX(0);
		this._setAnchorY(0);
		this.setPositionX(x);
		this.setPositionY(y);
		
		//根据级别随机设置墙的宽度和高度
		var width = cc.random0To1()*20+5*level;
		var height = cc.random0To1()*40+10*level;
		
		this.setTextureRect(cc.rect(0,0,width,height));
		this.setColor(cc.color(0,255,255));
		//this.runAction(cc.MoveTo(10-level,cc.p(-width,y)));
		this.runAction(cc.Sequence.create(cc.MoveTo(10-level,cc.p(-width,y)),cc.CallFunc(this.removeWall,this)));
	},
	removeWall : function(){
		this.getParent().deleteWallByTag(this.getTag());
	}
});
var BearSprite = cc.Sprite.extend({
	onEnter : function(){
		this._super();
	},
	//初始化Bear的位置并绑定行走事件
	init : function(x,y){
		this.initWithFile(res.Bear1);
		this._setAnchorX(0);
		this._setAnchorY(0);
		this.setPositionX(x);
		this.setPositionY(y);
		
		this.setScale(0.5, 0.5)
		
		this.jumpflag = true;
		this.walk();
		//this.jump();
	},
	//行走动作
	walk : function(){
		var animations = new cc.Animation();

		animations.addSpriteFrameWithFile(res.Bear1);
		animations.addSpriteFrameWithFile(res.Bear2);
		animations.addSpriteFrameWithFile(res.Bear3);
		animations.addSpriteFrameWithFile(res.Bear4);
		animations.addSpriteFrameWithFile(res.Bear5);
		animations.addSpriteFrameWithFile(res.Bear6);	
		animations.addSpriteFrameWithFile(res.Bear7);	
		animations.addSpriteFrameWithFile(res.Bear8);

		//animations.setDelayPerUnit(2.8f/14.0f);
		animations.setDelayPerUnit(0.2);
		animations.setRestoreOriginalFrame(true);

		var actions = cc.Animate.create(animations);
		this.runAction(cc.repeatForever(actions));
	},
	//跳跃动作
	jump : function(){
		if(this.jumpflag){
			var actionjump1 = cc.MoveBy(0.125,cc.p(20,70));
			var actionjump2 = cc.MoveBy(0.125,cc.p(20,50));
			var actionjump3 = cc.MoveBy(0.125,cc.p(20,30));
			var actionjump4 = cc.MoveBy(0.125,cc.p(20,10));
			
			var actionjump5 = cc.MoveBy(0.125,cc.p(20,-10));
			var actionjump6 = cc.MoveBy(0.125,cc.p(20,-30));
			var actionjump7 = cc.MoveBy(0.125,cc.p(20,-50));
			var actionjump8 = cc.MoveBy(0.125,cc.p(20,-70));
			
			var returnaction = cc.MoveBy(2,cc.p(-160,0));
			var sequences = cc.Sequence.create(	actionjump1,actionjump2,actionjump3,actionjump4,
												actionjump5,actionjump6,actionjump7,actionjump8,
												cc.callFunc(this.jumpFlag,this),returnaction);
			
			this.runAction(sequences);
		}
		this.jumpflag=false;
	},
	//正在跳跃的小熊不能jump
	jumpFlag : function(){
		this.jumpflag = true;
	},
	//获得小熊的四个角
	getMinY : function(){
		return this.getPositionY()-this._getHeight()*this._getAnchorY();
	},
	getMinX : function(){
		return this.getPositionX()-this._getWidth()*this._getAnchorX();
	},
	getMaxX : function(){
		return this.getPositionX()+this._getWidth()*(1-this._getAnchorX());
	},
	getMaxY : function(){
		return this.getPositionY()+this._getHeight()*(1-this._getAnchorY());
	}
});
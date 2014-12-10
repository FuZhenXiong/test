var NoOneDieLayer = cc.Layer.extend({
	sprite:null,
	level:null,
	touchListener:null,
	wallSprites:null,
	wallTag:10000,
	updateCount:0,
	bear1:null,
	bear2:null,
	scoreLabel:null,
	levelLabel:null,
	score:0,
	ctor:function () {
		this._super();

		var size = cc.winSize;
		this.level=1;
		this.wallSprites=[];
		
		// 背景
		this.bgSprite = new cc.Sprite(res.Background_png);
		this.bgSprite.attr({
			x: 0,
			y:0,
			anchorX: 0,
			anchorY: 0
		});
		this.addChild(this.bgSprite, 0);
		
		//添加返回键退出程序响应
		cc.eventManager.addListener({
			event:cc.EventListener.KEYBOARD,
			onKeyReleased : function(keyCode,event){
				if (keyCode == cc.KEY.back) {
					cc.director.popScene();
				}
			}
		}, this);
		
		//结束游戏按钮
		var closeItem = new cc.MenuItemImage(
				res.CloseNormal_png,
				res.CloseSelected_png,
				function () {
					cc.log("正在退出!");
					cc.director.popScene();
					Window.close();
				}, this);
		closeItem.attr({
			x: size.width-5,
			y: size.height-5,
			anchorX: 1,
			anchorY: 1
		});
		closeItem.setScale(0.8, 0.8);
		var menu = new cc.Menu(closeItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 5);
		
		//提示标签
		var tipLabel = new cc.LabelTTF("提示 ：点击跳跃", 25);
		tipLabel.attr({
			x : size.width / 4,
			y : size.height-5,
			anchorX: 0.5,
			anchorY: 1
		});
		tipLabel.setColor(cc.color(255, 125, 0));
		this.addChild(tipLabel, 0);
		
		//标题标签
		var titleLabel = new cc.LabelTTF("跳跳熊", 25);
		titleLabel.attr({
			x : size.width / 2,
			y : size.height-5,
			anchorX: 0.5,
			anchorY: 1
		});
		titleLabel.setColor(cc.color(0, 255, 0));
		this.addChild(titleLabel, 0);
		
		//积分标签
		this.scoreLabel = new cc.LabelTTF("积分: 0", 20);
		this.scoreLabel.attr({
			x : size.width / 2 +100,
			y : size.height-5,
			anchorX: 0.5,
			anchorY: 1
		});
		this.scoreLabel.setColor(cc.color(255,125, 0));
		this.addChild(this.scoreLabel, 0);
		
		//级别标签
		this.levelLabel = new cc.LabelTTF("级别: 1", 20);
		this.levelLabel.attr({
			x : size.width / 2 +200,
			y : size.height-5,
			anchorX: 0.5,
			anchorY: 1
		});
		this.levelLabel.setColor(cc.color(255,125, 0));
		this.addChild(this.levelLabel, 0);
		
		//第一个地板
		var floor1 = new cc.Sprite();
		floor1.setTextureRect(cc.rect(0, 0, size.width, 10));
		floor1.attr({
			x: 0,
			y: size.height/2,
			anchorX: 0,
			anchorY: 0
		});
		floor1.setColor(cc.color(0, 0, 0));
		this.addChild(floor1, 2);
		
		//第二一个地板
		var floor2 = new cc.Sprite();
		floor2.setTextureRect(cc.rect(0, 0, size.width, 10));
		floor2.attr({
			x: 0,
			y: 0,
			anchorX: 0,
			anchorY: 0
		});
		floor2.setColor(cc.color(0, 0, 0));
		this.addChild(floor2, 2);
		
		
		//第一个运动的小熊
		this.bear1 = new BearSprite();
		this.bear1.init(10, size.height/2+10);
		this.addChild(this.bear1 ,3, 1);
		
		//第二个运动的小熊
		this.bear2 = new BearSprite();
		this.bear2.init(10, 10);
		this.addChild(this.bear2,3, 2);
		
		//调度器
		this.schedule(this.addwall, 1 , 100000 , 0);
		this.scheduleUpdate();
		
		//监听器
		this.clickListener();
		
		return true;
	},
	//随机生成墙壁
	addwall : function(){
		var size = cc.winSize;
		
		if(this.updateCount%(6-this.level)!=0){
			this.updateCount++;
			return
		}

		if((cc.random0To1()+0.15*this.level-0.5)>=0){
			var wall = new WallSprite();
			wall.init(size.width, size.height/2+10,this.level);
			this.wallSprites.push(wall);
			this.addChild(wall, 3,this.wallTag++);
		}

		if((cc.random0To1()+0.1*this.level-0.5)>=0){
			var wall = new WallSprite();
			wall.init(size.width, 10,this.level);
			this.wallSprites.push(wall);
			this.addChild(wall, 3,this.wallTag++);
		}

		this.updateCount++;
		//cc.log("添加墙壁成功,还有"+this.wallSprites.length+"个墙壁");
	},
	//点击事件监听器
	clickListener : function(){
		this.touchListener = cc.EventListener.create({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches :true,
			onTouchBegan : function(touch,event){
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();
				var size = cc.winSize;
				if(pos.y>=size.height/2){	
					target.getChildByTag(1).jump();
				}
				else{
					target.getChildByTag(2).jump();
				}
				
				return true;
			}
		});
		cc.eventManager.addListener(this.touchListener, this);
	},
	//碰撞监测
	update : function(){
		var bearPoint = this.getBearPoint();
		for (var i = 0; i < this.wallSprites.length; i++) {
			var rect=this.wallSprites[i].getBoundingBox();
			if(this.rectContainBearPoint(rect,bearPoint)){
				cc.log("呵呵");
				var gameOver = new cc.LayerColor(cc.color(50,142,254,100));
				var size = cc.winSize;
				var titleLabel = new cc.LabelTTF("失败乃兵家常事！","Arial",30);
				titleLabel.attr({
					x:size.width/2,
					y:size.height/2+30
				});
				gameOver.addChild(titleLabel,1);
				var tryAgain = new cc.MenuItemFont(
						"再来一次",
						function(){
							var transition = cc.TransitionFade(1,new NoOneDieScene(),cc.color(255,255,255,255));
							cc.director.runScene(transition);
						},this);
				tryAgain.attr({
					x:size.width/2,
					y:size.height/2-20
				});
				
				var menu = new cc.Menu(tryAgain);
				menu.x=0;
				menu.y=0;
				gameOver.addChild(menu,1);
				this.getParent().addChild(gameOver);	
				
				this.unschedule(this.addwall);
				this.unscheduleUpdate();
				cc.eventManager.removeListener(this.touchListener);
				//this.ctor();
				return;
			}
		}
	},
	//获得当前两个小熊的周边点
	getBearPoint : function(){
		var point = [];
		var minX,minY,maxX,maxY;
		minX = this.bear1.getMinX();
		minY = this.bear1.getMinY();
		maxX = this.bear1.getMaxX();
		maxY = this.bear1.getMaxY();
		
		for(var i=minX; i<=maxX; i++){
			point.push(cc.p(i,minY));
			point.push(cc.p(i,maxY));
		}
		for(var i=minY+1; i<maxY; i++){
			point.push(cc.p(minX,i));
			point.push(cc.p(maxX,i));
		}
		
		minX = this.bear2.getMinX();
		minY = this.bear2.getMinY();
		maxX = this.bear2.getMaxX();
		maxY = this.bear2.getMaxY();
		
		for(var i=minX; i<=maxX; i++){
			point.push(cc.p(i,minY));
			point.push(cc.p(i,maxY));
		}
		for(var i=minY+1; i<maxY; i++){
			point.push(cc.p(minX,i));
			point.push(cc.p(maxX,i));
		}
		return point;	
		/*for (var i = 0; i < point.length; i++) {
			cc.log(point[i].x + " " + point[i].y);
		}*/
	},
	//判断rect是否包含point任意点
	rectContainBearPoint : function(rect,point){	
		for (var i = 0; i < point.length; i++) {
			if(cc.rectContainsPoint(rect, point[i])){
				return true;
			}
			//cc.log(point[i].x + " " + point[i].y);
		}
		return false;
	},
	//判断rect中是否包含点,测试用。暂时没用上
	myRectContainsPoint : function(rect,point){
		var x,y,width,height;
		x = rect.x;
		y = rect.y;
		width = rect.width;
		heigt = rect.height;
		
		if(point.x >= x && point.x <= x+width && point.y >= y && point.y <= y+width){
			return true;
		}
		else{
			return false;
		}
	},
	//删除消失的墙壁
	deleteWallByTag : function(tag){
		//cc.log(tag);
		this.removeChildByTag(tag, false);
		
		for (var i = 0; i < this.wallSprites.length; i++) {
			if(this.wallSprites[i].getTag()==tag){
				this.wallSprites.splice(i, 1);
				break;
			}
		}
		this.score++;
		this.scoreLabel.setString("积分: "+this.score);
		if(this.score>=this.level*15){
			this.level++;
			this.levelLabel.setString("级别: "+this.level);
		}
		//cc.log("删除墙壁成功,还有"+this.wallSprites.length+"个墙壁");
	}
});
/**
	作者:付振雄
	这里是NoOneDie的入口文件
 *
 */

cc.game.onStart = function(){
	cc.view.adjustViewPort(true);
	//按照手机屏幕自动调整大小
	cc.view.setDesignResolutionSize(720, 480, cc.ResolutionPolicy.EXACT_FIT);
	cc.view.resizeWithBrowserSize(true);
	//load resources
	cc.LoaderScene.preload(g_resources, function () {
		cc.director.setDisplayStats(false);
		cc.director.runScene(new NoOneDieScene());
	}, this);
};
cc.game.run();
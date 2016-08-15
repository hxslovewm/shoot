/**
 * Created by Will on 2015/3/30.
 */
var GameMain = cc.Scene.extend({
    onEnter:function () {
        this._super();
        mainLayer = new GameMainLayer();
        this.addChild(mainLayer);
    }
});

var GameMainLayer = cc.Layer.extend({
    score:0,
    overFlag:false,
    tempFlag :false,
    ctor: function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();
        $.post("ajaxPost!startGame.action");
        
        _size = cc.director.getWinSize();

        var layerbg = new cc.Sprite(res.a_gameBG);
        layerbg.setPosition(_size.width/2,_size.height/2);
        this.addChild(layerbg,0);
        //时间
        var time1 = new cc.Sprite("#time_1.png");
        time1.setPosition(_size.width*0.31,_size.height*0.95);
        this.addChild(time1,0);
        var time2 = this.time2 = new cc.Sprite("#time_2.png");
        time2.setPosition(time1.width*0.05,time1.height*0.325);
        time2.anchorX = 0;
        time1.addChild(time2,0);
        //得分
        var scoreBg = new cc.Sprite("#score.png");
        scoreBg.setPosition(_size.width*0.805,_size.height*0.95);
        this.addChild(scoreBg,0);
        var score = this.scoreText = new cc.LabelTTF("0","Microsoft YaHei",36);
        score.setPosition(scoreBg.width*0.65,scoreBg.height*0.5);
        //tempValue.strokeStyle = cc.color.RED;
        //tempValue.fillStyle = cc.color.RED;
        scoreBg.addChild(score);
        
        this.scoreTemp = new cc.LabelTTF("","Microsoft YaHei",32);
        this.scoreTemp.setPosition(_size.width*0.5,_size.height*0.88);
        this.scoreTemp.color = cc.color.RED;
        this.addChild(this.scoreTemp);
        
        //游戏次数
        var countPnt = new cc.Sprite("#number.png");
        countPnt.setPosition(_size.width*0.805,_size.height*0.3);
        this.addChild(countPnt,0);
        countTxt = new cc.LabelTTF(g_gameCount,"Microsoft YaHei",40);
        countTxt.setPosition(countPnt.width*1.5,countPnt.height*0.5);
        countTxt.color = cc.color(132,84,38);
        countPnt.addChild(countTxt);

        var rope = this.rope = new cc.Sprite("#rope.png");
        rope.setPosition(_size.width*0.1,_size.height*0.73);
        this.addChild(rope,0);
        var infinite = this.infinite = new cc.Sprite("#infinite.png");
        infinite.setPosition(_size.width*0.1,_size.height*0.7);
        this.addChild(infinite,0);
        infinite.runAction(cc.moveBy(3,cc.p(_size.width*1.1,0)));
        var viewSize = cc.view.getFrameSize();
        console.log(viewSize.width/viewSize.height);
        console.log(_size.width/_size.height);
        //if(viewSize.width/viewSize.height >= _size.width/_size.height){
            infinite.scaleX = _size.width/viewSize.width*_size.width/_size.height;
            infinite.scaleY = _size.height/viewSize.height*_size.width/_size.height;
        //}

        var bow_1 = bow1 = new cc.Sprite(res.a_bow1);
        bow_1.setPosition(_size.width*0.5,_size.height*0.145);
        this.addChild(bow_1,0);
        var bow_2 = bow2 = new cc.Sprite(res.a_bow2);
        bow_2.setPosition(_size.width*0.5,_size.height*0.1);
        this.addChild(bow_2,0);
        bow_2.visible = false;

        arrow = new cc.Sprite("#arrow.png");
        arrow.setPosition(_size.width*0.5,_size.height*0.27);
        this.addChild(arrow,0);
        cc.eventManager.addListener(listener,arrow);

        zhiyin = new cc.Sprite("res/zhiyin.png");
        zhiyin.setPosition(_size.width*0.5,_size.height*0.18);
        zhiyin.runAction(cc.blink(1,3));
        this.addChild(zhiyin,0);
        
        this.countDown();
        this.scheduleUpdate();
        this.schedule(this.randomMove,3);
        return true;
    },
    countDown: function () {
        this.schedule(function(){
            if(g_gameTime<=0 && !this.overFlag){
                this.overFlag = true;
                g_gameTime = 0;
                this.gameOver();
            }
            g_gameTime -= 0.1;
            this.time2.scaleX = g_gameTime/30;
        },0.1);
    },
    randomMove: function () {
        var t = Math.random()*2+1.5;
        if(this.infinite.x > _size.width/2){
            this.infinite.runAction(cc.moveBy(t,cc.p(-_size.width*1.5,0)));
        }else{
            this.infinite.runAction(cc.moveBy(t,cc.p(_size.width*1.5,0)));
        }
    },
    addHole: function (pos) {
        var hole = new cc.Sprite("res/duang.png");
        hole.x = pos.x-16;
        hole.y = pos.y-18;
        this.infinite.addChild(hole);
    },
    gameOver:function(){
        //查询数据库
        if(!this.tempFlag){
            this.tempFlag = true;
            cc.director.pause();
          //保存喜欢值到数据库
            var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
            var point = accMul(this.score,100);
        	var encrypt = RSAUtils.encryptedString(publicKey, point+"");
        	var self = this;
            $.post("ajaxPost!updatePoint.action",{"encrypt":encrypt},function(data){
            	if(data.msg == "true"){
            		$("#score").html(self.score);
            		$("#gameCanvas").hide();
                	$("#tjxx").show();
            	}else if(data.msg == "false"){
            		self.addChild(new GameEndLayer(self.score,data.userJson.point,data.rankCount));
            	}
            });
        }
    },
    update: function () {
        this.rope.x = this.infinite.x;
        var rect = this.infinite.getBoundingBox();
        var point = arrow.getPosition();
        if(cc.rectContainsPoint(rect,point)){
            arrow.stopAllActions();
            arrow.y = _size.height*0.27;
            //arrow.visible = false;
            clickFlag = false;
            arrow.scaleY = 1;
            //this.infinite.stopAllActions();
            var score = Math.floor((this.infinite.width/2-Math.abs(this.infinite.x - point.x))*1.25*10)/100;
            if(score<0) {score = Math.abs(score)};
            this.scoreTemp.setString("+"+score);
            this.scoreTemp.scale = 0.3;
            this.scoreTemp.x= _size.width/2;
            this.scoreTemp.y = _size.height*0.88;
            //this.scoreTemp.runAction(cc.sequence(cc.fadeIn(0.1),cc.delayTime(1),cc.fadeOut(0.5)));
            this.scoreTemp.runAction(cc.sequence(cc.fadeIn(0.1),cc.scaleTo(0.5,1.9),cc.scaleTo(0.2,1.5),cc.delayTime(0.8),cc.spawn(cc.scaleTo(0.5,0.1),cc.moveTo(0.5,cc.p(600,900)),cc.fadeOut(0.8))));
            this.score = accAdd(this.score,score);
            var pos = cc.p(point.x,this.infinite.y);
            pos = this.infinite.convertToNodeSpace(pos);
            this.addHole(pos);
            var str = this.score+"";
            if(str.length > 5){
                this.score = Math.floor(this.score);
            }
            this.scoreText.setString(this.score);
        }
        if(arrow.y > _size.height*1.1){
            arrow.stopAllActions();
            clickFlag = false;
            arrow.y = _size.height*0.27;
            arrow.scaleY = 1;
        }

        if(g_gameCount == 0 && !this.overFlag ){
            this.overFlag = true;
            cc.eventManager.removeAllListeners();
            this.scheduleOnce(this.gameOver,1.5);
        }
    }
});

var clickFlag = false;
var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
        if(!clickFlag){
            clickFlag = true;
            zhiyin.visible = false;
            bow1.visible = false;
            bow2.visible = true;
            arrow.runAction(cc.moveBy(0.1,cc.p(0,-cc.winSize.height*0.09)));
            return true;
        }
    },
    onTouchMoved:function(touch, event){       //实现onTouchMoved事件处理回调函数, 触摸移动时触发
        var target = event.getCurrentTarget();      // 移动当前按钮精灵的坐标位置
        var delta = touch.getDelta();               //获取事件数据: delta
    },
    onTouchEnded: function () {
        console.log("shoot");
        bow1.visible = true;
        bow2.visible = false;
        arrow.runAction(cc.moveBy(0.5,cc.p(0,cc.winSize.height)));
        arrow.runAction(cc.scaleTo(0.5,1,0.3));
        g_gameCount --;
        countTxt.setString(g_gameCount+"");
    }
});

//加法函数
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}
//乘法函数  
function accMul(arg1, arg2) {  
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();  
    try {  
        m += s1.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        m += s2.split(".")[1].length;  
    }  
    catch (e) {  
    }  
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);  
} 

//除法函数  
function accDiv(arg1, arg2) {  
    var t1 = 0, t2 = 0, r1, r2;  
    try {  
        t1 = arg1.toString().split(".")[1].length;  
    }  
    catch (e) {  
    }  
    try {  
        t2 = arg2.toString().split(".")[1].length;  
    }  
    catch (e) {  
    }  
    with (Math) {  
        r1 = Number(arg1.toString().replace(".", ""));  
        r2 = Number(arg2.toString().replace(".", ""));  
        return (r1 / r2) * pow(10, t2 - t1);  
    }  
} 
//校验手机号码：必须以数字开头，除数字外，可含有“-”
function isMobil(s){
    var patrn=/^(13[0-9]|15[0-9]|18[0-9]|177)\d{8}$/;
    if (!patrn.exec(s)) return false
    return true;
}

shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};

var sendRequest = function(url, params, isPost, callback, errorcallback){
    if(url == null || url == '')
        return;

    var xhr = cc.loader.getXMLHttpRequest();
    if(isPost){
        xhr.open("POST",url);
    }else{
        xhr.open("GET",url);
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            var response = xhr.responseText;
            if(callback)
                callback(response);
        }else if(xhr.readyState == 4 && xhr.status != 200){
            var response = xhr.responseText;
            if(errorcallback)
                errorcallback(response);
        }
    };

    if(params == null || params == ""){
        xhr.send();
    }else{
        xhr.send(params);
    }
};



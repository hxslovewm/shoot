/**
 * Created by Will on 2015/3/30.
 */
 
var GameStart = cc.Scene.extend({              //游戏开始页
    onEnter:function () {
        this._super();
        var layer = new GameStartLayer();
        this.addChild(layer);
        layer.init();
    }
});
var GameStartLayer = cc.Layer.extend({
    size:null,
    init:function () {
        this._super();
        this.size = cc.director.getWinSize();
        var indexBg = new cc.Sprite(res.a_indexBG);
        indexBg.setPosition(this.size.width / 2, this.size.height/2);
        this.addChild(indexBg);

        var menuStart= new cc.MenuItemImage('#start_but.png',null,this.onStart, this);
        menuStart.setPosition(this.size.width / 2, this.size.height*0.41);

        var menuRank= new cc.MenuItemImage('#list_but.png',null,this.onAddLayer, this);
        menuRank.setPosition(this.size.width*0.5, this.size.height*0.27);
        menuRank.tag = TagOfLayer.rank;

        var menuRule= new cc.MenuItemImage('#rules_but.png',null,this.onAddLayer, this);
        menuRule.setPosition(this.size.width*0.5, this.size.height*0.16);
        menuRule.tag = TagOfLayer.rule;

        var menuBow= new cc.MenuItemImage('#switch.png',null,this.onAddLayer, this);
        menuBow.setPosition(this.size.width*0.85, this.size.height*0.1);
        menuBow.tag = TagOfLayer.prize;

        menuBow.runAction(cc.sequence(cc.rotateTo(1,10),cc.rotateTo(1,-10))).repeatForever();

        var menu = this.menu = new cc.Menu(menuStart,menuRank,menuRule,menuBow);
        menu.setPosition(0,0);
        this.addChild(menu,1);

                //load music
//        document.addEventListener("touchstart", function(e) {
//            if (!audio_flag){
//                beep = document.createElement('audio');
//                beep.setAttribute('src', 'res/music.wav');
//                beep.loop = 'loop';
//                beep.load();
//                beep.play();
//                audio_flag = true;
//            }
//            //e.returnValue = false;
//        }, true);
    },
    onAddLayer:function (obj){
       if(obj.tag == TagOfLayer.rule){
           this.menu.setEnabled(false);
           this.addRuleLayer();
       }else if(obj.tag == TagOfLayer.rank){
           //排行榜
    	   if(gameInfo.phone != ""){
    		   $("#gameCanvas").hide();
               $("#phb").show();
    	   }else{
    		   TINY.box.show({html:'亲，参与游戏，提交手机号，方可参与排名!',animate:false,close:false,boxid:'error',autohide:2,top:200});
    	   }
       }else{
    	   $.post("ajaxPost!updateLookNum.action");
           cc.director.runScene(new BeginAnimationScene());
       }
    },
    onStart: function () {
        cc.director.runScene(new GameMain());
    },
    addRuleLayer:function(){
        var ruleLayer= this.addLayer = new cc.Layer();
        this.addChild(ruleLayer,1);

        var prizeBg = new cc.Sprite(res.a_ruleBG);
        prizeBg.setPosition(this.size.width / 2, this.size.height/2);
        ruleLayer.addChild(prizeBg);
        var menuBack = new cc.MenuItemImage('#return_but.png',null,this.goBack, this);
        menuBack.setPosition(this.size.width*0.5, this.size.height*0.04);
        var menu = new cc.Menu(menuBack);
        menu.setPosition(0,0);
        ruleLayer.addChild(menu,1);
    },
    goBack: function () {
        this.removeChild(this.addLayer);
        this.menu.setEnabled(true);
    }
});


var BeginAnimationScene = cc.Scene.extend({              //游戏开始页
    onEnter:function () {
        this._super();
        var layer = new BeginAnimationLayer();
        this.addChild(layer);
        layer.init();
    }
});


var BeginAnimationLayer = cc.Layer.extend({
    size:null,

    init:function () {
        this._super();
        this.size = cc.director.getWinSize();
        if(g_page == 0){
            var firstLayer = new FirstAnimationLayer();
            this.addChild(firstLayer);
        }else if(g_page == 1){
            var secondLayer = new SecondAnimationLayer();
            this.addChild(secondLayer);
        }else{
            var thirdLayer = new ThirdAnimationLayer();
            this.addChild(thirdLayer);
        }
        
        document.addEventListener("touchstart", function(e) {
            if (!audio_flag){
                beep = document.createElement('audio');
                beep.setAttribute('src', 'res/music.wav');
                beep.loop = 'loop';
                beep.load();
                beep.play();
                audio_flag = true;
            }
            //e.returnValue = false;
        }, true);
    }
});

var FirstAnimationLayer = cc.Layer.extend({
    size:null,
    beginHeight:70,
    beginHeight2:0,
    progress:2,
    clickIndex:0,
    actionOverFlag:false,
    ctor: function () {
        this._super();
        this.init();
    },
    init:function () {
        this.size = cc.director.getWinSize();
        var animationBg1 = new cc.Sprite("#BG_animation_01.jpg");
        animationBg1.setPosition(this.size.width / 2, this.size.height/2);
        this.addChild(animationBg1);

        var scroll1 = this.scroll1 = new cc.Sprite(res.a_scroll1);
        scroll1.setPosition(this.size.width / 2, this.size.height*0.94);
        scroll1.anchorY = 1;
        scroll1.setTextureRect(cc.rect(0,0,scroll1.width,this.beginHeight));
        this.addChild(scroll1);

        this.beginHeight2 = scroll1.y-100;
        var scroll2= this.scroll2 = new cc.Sprite("#scroll_02.png");
        scroll2.setPosition(this.size.width / 2, this.beginHeight2);
        this.addChild(scroll2);

        var menuSkip= new cc.MenuItemImage("#skip_but.png",null,this.onSkip, this);
        menuSkip.setPosition(this.size.width*0.5, this.size.height*0.04);
        var menu = this.menu = new cc.Menu(menuSkip);
        menu.setPosition(0,0);
        this.addChild(menu,1);

        this.scheduleUpdate();
    },
    onSkip:function (obj) {
        console.log("skip animation");
        if(this.clickIndex == 0){
            this.scroll1.setTextureRect(cc.rect(0, 0, this.scroll1.width, 801));
            this.scroll2.y = this.size.height * 0.11;
        }else{
            g_page++;
            cc.director.runScene(new BeginAnimationScene());
        }
    },
    update: function () {
        if(this.scroll2.y>this.size.height*0.11){
            this.beginHeight += this.progress;
            this.beginHeight2 -= this.progress;
            this.scroll1.setTextureRect(cc.rect(0,0,this.scroll1.width, this.beginHeight));
            this.scroll2.y = this.beginHeight2;
        }else{
            if(!this.actionOverFlag){
                this.actionOverFlag = true;
                this.clickIndex = 1;
            }
        }
    }
});

var SecondAnimationLayer = cc.Layer.extend({
    size:null,
    frameIndex:0,
    beginX:25,
    progressX:20,
    clickIndex:0,
    arrayIndex:0,
    actionOverFlag:false,
    ctor: function () {
        this._super();
        this.init();
    },
    init:function () {
        this.size = cc.director.getWinSize();
        var imgArray = [res.a_text1,res.a_text2,res.a_text3,res.a_text4,res.a_text5];
        var animationBg2 = new cc.Sprite("#BG_animation_02.jpg");
        animationBg2.setPosition(this.size.width / 2, this.size.height/2);
        this.addChild(animationBg2);

        this.spriteArray = [];
        for(var i=0; i<5; i++){
            var textSp = new cc.Sprite(imgArray[i]);
            textSp.setPosition(this.size.width*0.2, this.size.height*0.47-45*i);
            if(i==0){
                textSp.x = textSp.x+60;
            }
            textSp.setTextureRect(cc.rect(0,0,0,textSp.height));
            textSp.anchorY = 1;
            textSp.anchorX = 0;
            this.addChild(textSp);
            this.spriteArray.push(textSp);
        }

        var pen= this.pen = new cc.Sprite("#pen.png");
        pen.setPosition(this.size.width*0.415,10+this.size.height*0.43+pen.height/2);
        //pen.anchorY = 0;
        pen.setRotation(20);
        pen.runAction(cc.sequence(cc.rotateTo(0.2,22),cc.rotateTo(0.2,18))).repeatForever();
        this.addChild(pen);

        var menuSkip= new cc.MenuItemImage("#skip_but.png",null,this.onSkip, this);
        menuSkip.setPosition(this.size.width*0.5, this.size.height*0.04);
        var menu = this.menu = new cc.Menu(menuSkip);
        menu.setPosition(0,0);
        this.addChild(menu,1);

        this.scheduleUpdate();
    },
    onSkip:function (obj) {
        console.log("skip animation");
        if(this.clickIndex == 0){
            for(var i=0; i<5; i++){
            	if(i==0){
            		this.spriteArray[i].setTextureRect(cc.rect(0,0,309,this.spriteArray[i].height));
            	}else if(i==1){
            		this.spriteArray[i].setTextureRect(cc.rect(0,0,379,this.spriteArray[i].height));
            	}else if(i==2){
            		this.spriteArray[i].setTextureRect(cc.rect(0,0,373,this.spriteArray[i].height));
            	}else if(i==3){
            		this.spriteArray[i].setTextureRect(cc.rect(0,0,365,this.spriteArray[i].height));
            	}else if(i==4){
            		this.spriteArray[i].setTextureRect(cc.rect(0,0,149,this.spriteArray[i].height));
            	}
            }
            this.actionOverFlag = true;
            this.clickIndex=1;
            this.pen.stopAllActions();
            this.pen.setRotation(0);
            this.pen.runAction(cc.moveTo(1,cc.p(590,330)));
        }else{
            g_page++;
            cc.director.runScene(new BeginAnimationScene());
        }
    },
    update: function () {
        if(this.frameIndex%10 == 0 && !this.actionOverFlag){
        	if(this.arrayIndex == 0 && this.beginX>=309){
        		this.spriteArray[this.arrayIndex].setTextureRect(cc.rect(0,0,309,this.spriteArray[this.arrayIndex].height));
        	}else if(this.arrayIndex == 1 && this.beginX>=379){
        		this.spriteArray[this.arrayIndex].setTextureRect(cc.rect(0,0,379,this.spriteArray[this.arrayIndex].height));
        	}else if(this.arrayIndex == 2 && this.beginX>=373){
        		this.spriteArray[this.arrayIndex].setTextureRect(cc.rect(0,0,373,this.spriteArray[this.arrayIndex].height));
        	}else if(this.arrayIndex == 3 && this.beginX>=365){
        		this.spriteArray[this.arrayIndex].setTextureRect(cc.rect(0,0,365,this.spriteArray[this.arrayIndex].height));
        	}else if(this.arrayIndex == 4 && this.beginX>=149){
        		this.spriteArray[this.arrayIndex].setTextureRect(cc.rect(0,0,149,this.spriteArray[this.arrayIndex].height));
        	}else{
        		this.spriteArray[this.arrayIndex].setTextureRect(cc.rect(0,0,this.beginX,this.spriteArray[this.arrayIndex].height));
        	}
            this.pen.runAction(cc.moveBy(0.15,cc.p(20,0)));
            if(this.beginX > 309 && this.arrayIndex == 0 || this.beginX > 370 && this.arrayIndex<4){
                this.pen.x = this.size.width*0.33;
                this.pen.y = this.pen.y - 45;
                this.beginX = 20;
                this.arrayIndex++;
            }
            if(this.arrayIndex == 4 && this.beginX>180){
                this.pen.stopAllActions();
                this.pen.setRotation(0);
                this.pen.runAction(cc.moveTo(1,cc.p(590,330)));
                this.actionOverFlag = true;
                this.clickIndex=1;
            }
            this.beginX += this.progressX;
        }
        this.frameIndex ++;
    }
});


var ThirdAnimationLayer = cc.Layer.extend({
    size:null,
    beginHeight:70,
    beginHeight2:0,
    progress:4,
    actionOverFlag:false,
    ctor: function () {
        this._super();
        this.init();
    },
    init:function () {
        this.size = cc.director.getWinSize();
        var animationBg1 = new cc.Sprite("#BG_animation_03.jpg");
        animationBg1.setPosition(this.size.width / 2, this.size.height/2);
        this.addChild(animationBg1);

        var scroll3 = this.scroll3 = new cc.Sprite(res.a_scroll31);
        scroll3.setPosition(this.size.width / 2, this.size.height*0.84);
        scroll3.anchorY = 1;
        scroll3.setTextureRect(cc.rect(0,0,scroll3.width,this.beginHeight));
        this.addChild(scroll3);

        this.beginHeight2 = scroll3.y-80;
        var scroll4 = this.scroll4 = new cc.Sprite("#scroll_032.png");
        scroll4.setPosition(this.size.width / 2, this.beginHeight2);
        this.addChild(scroll4);

        var menuSkip= new cc.MenuItemImage("#Enter-the_but.png",null,this.onStart, this);
        menuSkip.setPosition(this.size.width*0.5, this.size.height*0.06);
        var menu = this.menu = new cc.Menu(menuSkip);
        menu.setPosition(0,0);
        this.addChild(menu,1);
        menu.setEnabled(false);

        this.scheduleUpdate();
    },
    onStart:function (obj) {
        g_page = 0;
        cc.director.runScene(new GameStart());
    },
    update: function () {
        if(this.scroll4.y>this.size.height*0.14){
            this.beginHeight += this.progress;
            this.beginHeight2 -= this.progress;
            if(this.scroll3.height > 650){
            	this.progress = 1;
            }
            this.scroll3.setTextureRect(cc.rect(0,0,this.scroll3.width, this.beginHeight));
            this.scroll4.y = this.beginHeight2;
        }else{
            if(!this.actionOverFlag){
                this.actionOverFlag = true;
                this.menu.setEnabled(true);
            }
        }
    }
});
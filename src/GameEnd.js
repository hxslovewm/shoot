/**
 * Created by Will on 2015/3/30.
 */
var GameEnd = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var mainLayer = new GameEndLayer();
        this.addChild(mainLayer);
    }
});
var GameEndLayer = cc.LayerColor.extend({
    _score:0,
    _bestScore:0,
    _rankCount:1000,
    ctor:function (score,bestScore,count) {
        this._super(cc.color(30,30,30,180));
        this._score = score;
        this._bestScore = bestScore;
        this._rankCount = count;
        
        this.init();
    },
    init: function () {
        _size = cc.winSize;
        var overPng = new cc.Sprite("#end_2.png");
        overPng.setPosition(_size.width/2,_size.height*0.63);
        this.addChild(overPng);

        var currentScore = new cc.LabelTTF(this._score+"","Microsoft YaHei",30);
        currentScore.setPosition(overPng.width*0.65,overPng.height*0.61);
        currentScore.color = cc.color(132,84,38);
        overPng.addChild(currentScore);
        
        var point = accDiv(this._bestScore,100);
        var bestScore = new cc.LabelTTF(point+"","Microsoft YaHei",30);
        bestScore.setPosition(overPng.width*0.675,overPng.height*0.5);
        bestScore.color = cc.color(132,84,38);
        overPng.addChild(bestScore);

        var currentRank = new cc.LabelTTF(this._rankCount,"Microsoft YaHei",30);
        currentRank.setPosition(overPng.width*0.61,overPng.height*0.39);
        currentRank.color = cc.color(132,84,38);
        overPng.addChild(currentRank);

        var menuAgain = new cc.MenuItemImage('#again_but.png',null,this.onAgain, this);
        menuAgain.setPosition(_size.width*0.5, _size.height*0.3);

        var menuShareBtn= new cc.MenuItemImage('#share_but.png',null,this.onShare, this);
        menuShareBtn.setPosition(_size.width*0.5, _size.height*0.15);

        var menuShare = this.share = new cc.MenuItemImage('res/share.png',null,this.onShare, this);
        menuShare.setPosition(_size.width*0.5, _size.height*0.5);
        menuShare.visible= false;

        var menu = this.menu = new cc.Menu(menuAgain,menuShareBtn,menuShare);
        menu.setPosition(0,0);
        this.addChild(menu,1);
    },
    onAgain: function () {
        g_gameCount = 5;
        g_gameTime = 30;
        cc.director.runScene(new GameMain());
        cc.director.resume();
    },
    onShare: function () {
        if(!this.share.visible){
        	$.post("ajaxPost!updateShareNum.action");
            this.share.visible = true;
        }else{
            this.share.visible = false;
        }
    }
});

$(function(){
    //提交信息
    var confirmFlag = false;
    $("#phone_tip").show();
    $('#btn_qd').click(function(){
        if(confirmFlag){
            TINY.box.show({html:'亲，请勿重复提交!',animate:false,close:false,boxid:'error',autohide:2,top:200});
            return;
        }
        var phone = $.trim($("#phone").val());
        var point = $.trim($("#score").html());
        point = accMul(point,100);
//        var name = $.trim($("#name").val());
//        if(name == ""){
//            $("#tip").html("请输入您的姓名!");
//            return false;
//        }
        if(phone == ""){
            $("#phone_tip").html("请输入您的手机号!");
            return false;
        }
        if(!isMobil(phone)){
            $("#phone_tip").html("请输入正确格式的手机号");
            return false;
        }
        $("#phone_tip").html("");
        confirmFlag = true;
        //alert(confirmFlag);
        $.post("ajaxPost!updatePhone.action",{"phone":phone,"name":"黄帝五子","address":"CN","point":point},function(data){
            if(data.msg == "true"){
            	point = accDiv(point,100);
            	cc.director.getRunningScene().addChild(new GameEndLayer(point,data.userJson.point,data.rankCount));
            	$("#gameCanvas").css("display","block");
                $("#tjxx").hide();
            }else{
                $("#phone_tip").html(data.msg);
                confirmFlag = false;
                return;
            }
        });
        return false;
    });
});
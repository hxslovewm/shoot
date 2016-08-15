
//var g_isExchange = gameInfo.prizeTag;  //是否领奖标记
var g_gameCount = 5;  //剩余游戏次数
//var g_prizeCount = gameInfo.gameCount;
//var g_subscribe = 1;
var g_gameTime = 30;
var g_gameState = gameInfo.gameState;  //0 进自己链接  1 进朋友链接  2。。。
var g_page = 0;

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.start = 0;
    TagOfLayer.game = 1;
    TagOfLayer.rule = 10;
    TagOfLayer.prize = 11;
    TagOfLayer.rank = 12;
};

// collision type for chipmunk
if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.target = 0;
};

// collision type for chipmunk
if(typeof GameTag == "undefined") {
    var GameTag = {};
    GameTag.myself = 0;              //自己第一次进
    GameTag.myselfNotFirst = 1;    //自己多次进
    GameTag.friend = 2;             //朋友第一次进
    GameTag.friendNotFirst = 3;
    GameTag.hasPrized = 0;
};
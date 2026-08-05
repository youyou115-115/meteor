/*
    Meteor Ver0.3
    game.js
*/


const Game={


canvas:null,

ctx:null,


meteor:null,

coin:null,

isMobile:false,
showBonusHelp:false,
bonusHelpWait:false,
bonusHelpReady:false,

planes:[],
bullets:[],
screenCrack:0,
cracks:[],


wave:1,



roulette:Roulette,


danger:0,

lastTime:0,

deltaTime:1,
power:1,
bonus:false,









// 状態管理
state:"TITLE",

impactFlash:0,


// 現在倍率
power:1,

waveMessage:"",
waveTimer:0,





init(){

    Roulette.init();

    Sound.init();

    this.planes=[];
this.bullets=[];

    this.isMobile =
window.innerWidth < 700;



    this.canvas =
    document.getElementById("gameCanvas");



    this.canvas.width = 800;

    this.canvas.height = 700;



    this.ctx =
    this.canvas.getContext("2d");

    let touchLock=false;





    // =====================
    // 隕石生成
    // =====================

    this.meteor =
    new Meteor();

 // 攻撃用コイン

this.coin =
new Coin();







    this.state = "TITLE";

    if(Game.state === "GAMEOVER"){

       


    Game.state="TITLE";


    return;

}



},

start(){


    this.state="GAME";

     Sound.stopBGM();

      Sound.startBattleBGM();

      this.planes=[];
    this.bullets=[];


     


    this.meteor.reset();


    this.coin.reset();


    Roulette.active=false;

    Roulette.stopTimer=0;


    Camera.shake=0;


    this.impactFlash=0;

    this.coin.active=false;
    this.meteor.destroying=false;
    Roulette.mode="IDLE";
    Roulette.visible=false;
    Roulette.resultTimer=0;
    this.power=1;
    this.wave = 1;

    this.showBonusHelp=false;
this.bonusHelpWait=false;
this.bonusHelpReady=false;



},







update(){

    // ボーナス説明中は停止

if(this.showBonusHelp){

    Camera.update();

    return;

}


    WaveBonus.update();
    WaveBonusUI.update();


    if(this.impactFlash > 0){

        this.impactFlash--;

    }



    // =====================
    // タイトル
    // =====================

    if(this.state === "TITLE"){

    Camera.update();

    return;

}





    // =====================
    // ゲームオーバー
    // =====================

   if(this.state === "GAMEOVER"){


    for(let p of this.planes){

        p.update();

    }


    for(let b of this.bullets){

        b.update();

    }


    Camera.update();

    return;

}




    // =====================
    // ゲーム中
    // =====================


    this.meteor.update();


    this.coin.update();

    // 飛行機
if(!Roulette.active){

    for(let p of Game.planes){

        p.update();

    }

}


// 弾
for(let b of this.bullets){

    b.update();

}


this.bullets =
this.bullets.filter(
b=>b.active
);



    Roulette.update();


    Camera.update();

    if(this.waveTimer > 0){

    this.waveTimer--;

}



},
toTitle(){


    this.state="TITLE";

    this.titleBGMStarted=false;


    this.meteor.reset();


    this.coin.reset();


    Roulette.active=false;

    Roulette.stopTimer=0;


    this.coinCount=3;


    this.power=1;


    this.impactFlash=0;


    Camera.shake=0;
    this.wave = 1;



}




};
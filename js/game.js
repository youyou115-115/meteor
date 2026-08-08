/*
    Meteor Ver0.3
    game.js
*/


const Game={


canvas:null,

ctx:null,
bossWaves:[1,5],


meteor:null,

coin:null,

isMobile:false,
showBonusHelp:false,
bonusHelpWait:false,
bonusHelpReady:false,
bonusHelpShown:false,


bossMeteors: [],
planes:[],
bullets:[],
screenCrack:0,
cracks:[],

wave:1,

// =====================
// BOSS
// =====================

bossWave:false,

bossPhase:"NONE",

bossTimer:0,

bossWarningTimer:0,
bossWarningActive:false,
bossCurtain:0,
bossWarningMax:120,

bossStarted:false,



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
    this.boss = null;





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

this.wave = 1;


// =====================
// BOSS
// =====================

this.bossWave = false;

this.bossPhase = "NONE";

this.bossTimer = 0;

this.bossWarningTimer = 0;

this.bossStarted = false;

this.bossMeteors = [];

this.boss = new Boss();


// =====================
// ボスWAVE判定
// =====================

if(this.isBossWave()){

    this.startBossWave();

}

    this.showBonusHelp=false;
this.bonusHelpWait=false;
this.bonusHelpReady=false;

WaveBonus.timer=0;
WaveBonusUI.timer=0;
WaveBonusUI.active=false;



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


// =====================
// ルーレット更新
// =====================
// 
// 先にルーレットだけ動かす
// =====================

Roulette.update();


// =====================
// スロット中はゲーム停止
// =====================

if(Roulette.active){

    Camera.update();

    return;

}



// =====================
// BOSS WAVE
// =====================

if(this.bossWave){

    this.updateBossWave();

}
else{

    // =====================
    // 通常WAVE
    // =====================

    this.meteor.update();

}


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

// =====================
// BOSS
// =====================

if(this.boss && this.bossWave){

    this.boss.update();

}

// =====================
// ボス隕石
// =====================

for(let i = this.bossMeteors.length - 1; i >= 0; i--){

    const meteor = this.bossMeteors[i];


    meteor.update();


    if(!meteor.active){

        this.bossMeteors.splice(i, 1);

    }

}





},


updateBossWave(){

    // =====================
    // ボス演出中
    // =====================

if(this.bossPhase === "WARNING"){

    // =====================
    // WARNINGタイマー
    // =====================

    this.bossWarningTimer -= Game.deltaTime;

    // 通常隕石停止
    this.meteor.active = false;


    // =====================
    // 垂れ幕
    // =====================

    const elapsed =
        this.bossWarningMax -
        this.bossWarningTimer;


    // 最初の30フレームで開く
    if(elapsed < 30){

        this.bossCurtain =
            elapsed / 30;

    }

    // 最後の30フレームで閉じる
    else if(this.bossWarningTimer < 30){

        this.bossCurtain =
            this.bossWarningTimer / 30;

    }

    else{

        this.bossCurtain = 1;

    }


    // =====================
    // 2秒経過
    // =====================

    if(this.bossWarningTimer <= 0){

        // ★完全にWARNINGを終了
        this.bossWarningTimer = 0;
        this.bossCurtain = 0;
        this.bossWarningActive = false;


        // =====================
        // ボス戦開始
        // =====================

        this.bossPhase = "BATTLE";
        this.bossStarted = true;


        // ボス生成
        this.boss = new Boss();


        // 召喚隕石をクリア
        this.bossMeteors = [];


        // 最初の隕石召喚
        this.boss.summonMeteors();


        return;

    }


    return;

}


    // =====================
    // ボス戦
    // =====================

    // =====================
// ボス戦
// =====================

if(this.bossPhase === "BATTLE"){

    // =====================
    // 通常隕石を完全停止
    // =====================

    this.meteor.active = false;


    // =====================
    // ボス撃破
    // =====================

    if(
        this.bossStarted &&
        this.boss &&
        !this.boss.active
    ){

        this.finishBossWave();

        return;

    }

}

},

isBossWave(){

    return this.bossWaves.includes(
        this.wave
    );

},

startBossWave(){

    console.log(
        "BOSS WAVE:",
        this.wave
    );


    // =====================
    // BOSS WARNING開始
    // =====================

    this.bossWave = true;

    this.bossPhase = "WARNING";

    // 120 × 1/60秒 = 約2秒
    this.bossWarningTimer =
        this.bossWarningMax;

    this.bossWarningActive = true;

    this.bossCurtain = 0;

    this.bossStarted = false;


    // =====================
    // 通常隕石停止
    // =====================

    this.meteor.active = false;


    // =====================
    // ボス関連初期化
    // =====================

    this.bossMeteors = [];

    this.boss = null;


    // =====================
    // ルーレット停止
    // =====================

    Roulette.active = false;
    Roulette.visible = false;

},

finishBossWave(){

    this.bossPhase = "NONE";

    this.bossWave = false;

    this.bossStarted = false;


    this.bossMeteors = [];


    // 次WAVE

    this.wave++;


    // 通常隕石復帰

    this.meteor.reset();

    this.meteor.active = true;


    console.log(
        "BOSS CLEAR → WAVE",
        this.wave
    );

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

    this.bonusHelpShown=false;


    Camera.shake=0;
    this.wave = 1;



}




};
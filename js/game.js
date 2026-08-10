/*
    Meteor Ver0.3
    game.js
*/


const Game={




canvas:null,

ctx:null,
bossWaves:[5],

// =====================
// スロットチャージ
// =====================

slotCharge: 0,

slotChargeMax: 60,

slotCharging: true,

slotAutoStart: true,


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


// =====================
// GAME CLEAR
// =====================

clearTimer:0,
clearAnimation:0,

// ☄ METEOR役でボス撃破
meteorClear:false,

// =====================
// METEOR FINISH
// =====================

specialClear:false,

// 0 = 月登場
// 1 = 「それはあかんやろ」
// 2 = 爆発
// 3 = 終了
specialClearPhase:0,

specialClearTimer:0,

// METEOR FINISH専用
specialClearMoonX:400,
specialClearMoonY:350,
specialClearMoonRadius:0,

specialClearFlash:0,
specialClearShake:0,
specialClearExplosion:0,
specialClearCracks:[],
specialClearMessageAlpha:0,




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

    this.canvas.height =
    this.isMobile
    ? 1200
    : 700;


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
window.addEventListener("keydown", (e) => {

    if(Game.state !== "TITLE"){
        return;
    }


    // =========================================
    // M → METEOR FINISH
    // =========================================

    if(e.key.toLowerCase() === "m"){

        Game.meteorClear = true;

        Game.startSpecialClear();

        return;

    }


    // =========================================
    // C → GAME CLEAR
    // =========================================

    if(e.key.toLowerCase() === "c"){

        Game.state = "CLEAR";

        Game.clearTimer = 240;

        Game.clearAnimation = 0;

        Sound.stopBGM();

        return;

    }

});



},

// =====================
// WAVE開始時のスロット
// =====================

startWaveSlot(){

    // 既にスロット中なら何もしない
    if(Roulette.active){

        return;

    }

    // 状態がGAME以外なら開始しない
    if(this.state !== "GAME"){

        return;

    }

    // 隕石破壊演出中は開始しない
    if(
        !this.bossWave &&
        this.meteor &&
        this.meteor.destroying
    ){

        return;

    }

    // =====================
    // チャージリセット
    // =====================

    this.slotCharge = 0;
    this.slotCharging = false;

    // =====================
    // スロット開始
    // =====================

    Roulette.active = false;
    Roulette.visible = false;
    Roulette.mode = "IDLE";
    Roulette.stopTimer = 0;
    Roulette.resultTimer = 0;

    Roulette.start();

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
else{

    // =====================
    // WAVE1開始
    // =====================

    this.startWaveSlot();

}

    this.showBonusHelp=false;
this.bonusHelpWait=false;
this.bonusHelpReady=false;

WaveBonus.timer=0;
WaveBonusUI.timer=0;
WaveBonusUI.active=false;

// =====================
// スロットチャージ初期化
// =====================

this.slotCharge = 0;

this.slotCharging = false;

this.slotAutoStart = true;



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
// WAVE表示タイマー
// ※ゲーム停止中でも進める
// =====================

if(this.waveTimer > 0){

    this.waveTimer -= this.deltaTime;

    if(this.waveTimer < 0){

        this.waveTimer = 0;

    }

}



    // =====================
    // タイトル
    // =====================

    if(this.state === "TITLE"){

    Camera.update();

    return;

}

// =====================
// SPECIAL CLEAR
// =====================

if(this.state === "SPECIAL_CLEAR"){

    this.updateSpecialClear();

    Camera.update();

    return;

}
// =====================
// GAME CLEAR
// =====================

if(this.state === "CLEAR"){

    this.clearAnimation += this.deltaTime;

    this.clearTimer -= this.deltaTime;

    Camera.update();

    if(this.clearTimer <= 0){

        this.toTitle();

    }

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
// スロット中
// =====================

if(Roulette.active){

    Camera.update();

    return;

}


// =====================
// スロットチャージ
// =====================

if(
    this.state === "GAME" &&
    this.bossPhase !== "WARNING" &&
    this.meteor &&
    !this.meteor.destroying
){

    this.slotCharging = true;


    this.slotCharge +=
        Game.deltaTime;


    // =====================
    // MAX
    // =====================

    if(
        this.slotCharge >=
        this.slotChargeMax
    ){

        this.slotCharge =
            this.slotChargeMax;

        this.slotCharging = false;


        // =====================
        // 自動スロット開始
        // =====================

        Roulette.start();

        this.slotCharge = 0;

    }

}
else if(
    this.meteor &&
    this.meteor.destroying
){

    // =====================
    // 隕石破壊演出中のみ停止
    // =====================

    this.slotCharging = false;

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




    Camera.update();


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

updateSpecialClear(){

    this.specialClearTimer -=
        this.deltaTime;

    this.clearAnimation +=
        this.deltaTime;


    // =====================================================
    // PHASE 0
    // 月が登場
    // =====================================================

    if(this.specialClearPhase === 0){

        const progress =
            1 -
            Math.max(
                0,
                this.specialClearTimer / 70
            );

        // 月が小さい状態から巨大化
        this.specialClearMoonRadius =
            20 +
            progress * 100;

        // 少し上から落ちてくる
        this.specialClearMoonY =
            260 +
            progress * 90;

        // 登場時の光
        this.specialClearFlash =
            Math.max(
                0,
                1 - progress * 1.5
            );

        if(this.specialClearTimer <= 0){

            this.specialClearPhase = 1;

            this.specialClearTimer = 100;

            this.specialClearMoonRadius = 100;

            this.specialClearMoonY = 350;

            Camera.hitShake(15);

        }

    }


    // =====================================================
    // PHASE 1
    // 「それはあかんやろ」
    // =====================================================

    else if(this.specialClearPhase === 1){

        const progress =
            1 -
            Math.max(
                0,
                this.specialClearTimer / 100
            );

        // 文字を徐々に表示
        this.specialClearMessageAlpha =
            Math.min(
                1,
                progress * 3
            );

        // 月が少し揺れる
        this.specialClearMoonX =
            400 +
            Math.sin(
                this.clearAnimation * 0.18
            ) * 3;

        if(this.specialClearTimer <= 0){

            this.specialClearPhase = 2;

            this.specialClearTimer = 110;

            this.specialClearExplosion = 0;

            this.specialClearFlash = 1;

            Camera.hitShake(35);
            

              // =====================================
    // ボス撃破音
    // =====================================

    Sound.gameOver();

    Camera.hitShake(35);

            // =====================
            // 亀裂生成
            // =====================

            this.specialClearCracks = [];

            for(let i = 0; i < 30; i++){

                const angle =
                    Math.random() *
                    Math.PI *
                    2;

                const length =
                    80 +
                    Math.random() * 300;

                this.specialClearCracks.push({

                    angle:angle,

                    length:length,

                    width:
                        1 +
                        Math.random() * 3

                });

            }

        }

    }


    // =====================================================
    // PHASE 2
    // 爆発
    // =====================================================

    else if(this.specialClearPhase === 2){

        const progress =
            1 -
            Math.max(
                0,
                this.specialClearTimer / 110
            );

        this.specialClearExplosion =
            progress;

        // =====================
        // 爆発フラッシュ
        // =====================

        this.specialClearFlash =
            Math.max(
                0,
                1 - progress * 2
            );

        // =====================
        // 激しく振動
        // =====================

        this.specialClearMoonX =
            400 +
            (
                Math.random() - 0.5
            ) *
            18 *
            progress;

        this.specialClearMoonY =
            350 +
            (
                Math.random() - 0.5
            ) *
            18 *
            progress;

        Camera.hitShake(
            Math.floor(
                8 +
                progress * 35
            )
        );


        if(this.specialClearTimer <= 0){

            this.specialClearPhase = 3;

            this.specialClearTimer = 100;

            this.specialClearExplosion = 1;

            Camera.hitShake(45);

        }

    }


    // =====================================================
    // PHASE 3
    // 終了
    // =====================================================

    else if(this.specialClearPhase === 3){

        this.specialClearTimer -=
            this.deltaTime;

        if(this.specialClearTimer <= 0){

    this.specialClear = false;

    this.meteorClear = false;

    this.specialClearPhase = 0;

    this.specialClearExplosion = 0;

    this.specialClearCracks = [];

    this.toTitle();

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

           // =====================
    // スロットチャージリセット
    // =====================

    this.slotCharge = 0;
    this.slotCharging = false;
    this.slotAutoStart = true;


    // =====================
    // 最初のスロット自動開始
    // =====================

    Roulette.active = false;
    Roulette.visible = false;
    Roulette.mode = "IDLE";

    Roulette.start();





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

    // =====================
    // WAVE 5
    // GAME CLEAR
    // =====================

    if(this.wave === 5){

        this.bossPhase = "NONE";

        this.bossWave = false;

        this.bossStarted = false;

        this.bossMeteors = [];


            // =====================
    // METEOR役クリア
    // =====================

    if(this.meteorClear){

        this.startSpecialClear();

        return;

    }

        this.state = "CLEAR";

        this.clearTimer = 240;

        

        // =====================
// クリア専用BGM
// =====================

Sound.clearBGM();

        this.clearAnimation = 0;

        Roulette.active = false;
        Roulette.visible = false;

        this.coin.active = false;

        this.meteor.active = false;

        this.planes = [];
        this.bullets = [];

        Camera.shake = 0;

        Sound.stopBGM();

        console.log("GAME CLEAR!");

        return;

    }


    // =====================
    // 通常のボスクリア
    // =====================

    this.bossPhase = "NONE";

    this.bossWave = false;

    this.bossStarted = false;

    this.bossMeteors = [];


    this.wave++;


    this.meteor.reset();

    this.meteor.active = true;


    console.log(
        "BOSS CLEAR → WAVE",
        this.wave
    );

},


startSpecialClear(){

    console.log("☄ METEOR FINISH!");

    this.state = "SPECIAL_CLEAR";

    this.specialClear = true;

    // =====================
    // 初期化
    // =====================

    this.specialClearPhase = 0;

    this.specialClearTimer = 70;

    this.clearAnimation = 0;

    this.specialClearMoonX = 400;
    this.specialClearMoonY = 350;

    // 最初は小さい
    this.specialClearMoonRadius = 10;

    this.specialClearFlash = 0;

    this.specialClearShake = 0;

    this.specialClearExplosion = 0;

    this.specialClearMessageAlpha = 0;

    this.specialClearCracks = [];

    // =====================
    // ゲーム停止
    // =====================

    Roulette.active = false;
    Roulette.visible = false;

    this.coin.active = false;

    this.meteor.active = false;

    this.bossMeteors = [];

    this.planes = [];
    this.bullets = [];

    // =====================
    // BGM停止
    // =====================

    Sound.stopBGM();

    // =====================
    // 初期衝撃
    // =====================

    Camera.hitShake(20);

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
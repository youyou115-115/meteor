/*
    Meteor Ver1.1
    roulette.js
*/


const Roulette = {


    grid:[],

    resultEffect:"normal",
resultEffectTimer:0,

effectMessage:"",
effectMessageTimer:0,
meteorHit:false,

meteorFinish:false,
meteorFinishTimer:0,


    active:false,

    reachWait:false,

    reachNumber:null,

    

     mode:"IDLE",


    stopTimer:0,


    result:1,


    phase:0,

    resultTimer:0,

    reachEffectTimer:0,

    reachLine:null,

    


    phaseTimer:0,
    scrollSpeed:20,

    stopLight:[
    false,
    false,
    false
],

rowStopOffset:[
    [0,0,0],
    [0,0,0],
    [0,0,0]
],

stopOffset:[
    0,
    0,
    0
],

offset:[0,0,0],

stopped:[false,false,false],

    visible:false,

    reels:[
    [],
    [],
    []
],

reelPos:[
    0,
    0,
    0
],

reelSpeed:[
    0,
    0,
    0
],

   


    highlightLines:[],
    targetNumber:null,

    reach:false,

reachTimer:0,




    init(){


        this.reels=[];


this.reels=[

    // 左リール
    [
1,5,3,7,2,"☄",9,4,1,8,6,
7,3,"★",5,2,1,9
],


    // 中央リール
    [
4,7,2,8,1,"☄",5,9,3,7,6,
2,8,"★",5,1
],


    // 右リール
    [
2,6,7,3,9,1,"☄",5,8,4,7,
6,"★"
]
];



    },








    start(){

        this.stopOffset=[
    0,
    0,
    0
];

    if(this.active){
        return;
    }


    this.mode="SPIN";

     this.visible=true;

    this.active=true;

        this.reach=false;
    this.reachWait=false;
    this.reachTimer=0;
    this.reachEffectTimer=0;
    this.reachLine=null;
    this.meteorHit = false;

    this.meteorFinish = false;
this.meteorFinishTimer = 0;

        // ★追加
    this.stopped=[
        false,
        false,
        false
    ];

    this.rowStopOffset = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];


    // ★追加
    this.offset=[
        0,
        0,
        0
    ];

    this.reelPos = [
    Math.random(),
    Math.random(),
    Math.random()
];

this.stopLight=[
    false,
    false,
    false
];


// 青ボーナスは次の1回転だけ
let slow = 1;
let fast = 1;


// =====================
// 青ボーナス
// 次の1回転だけ減速
// =====================

if(WaveBonus.blueSpin){

    slow = 0.6;

    WaveBonus.blueSpin = false;

}


// =====================
// 月のデバフ
// 次の1回転だけ高速
// =====================

if(
    Game.boss &&
    Game.boss.active &&
    Game.boss.nextSlotFast
){

    fast = 1.8;

    // 使用済み
    Game.boss.nextSlotFast = false;

}


// =====================
// リール速度
// =====================


// =====================
// リール速度
// =====================

// 目押し用に速度を低下
const baseSpeed = [
    0.012,
    0.012,
    0.0080
];

this.reelSpeed = [
    baseSpeed[0] * slow * fast,
    baseSpeed[1] * slow * fast,
    baseSpeed[2] * slow * fast
];


    this.phase=0;


    this.highlightLines=[];

    this.reach=false;

this.reachTimer=0;

this.reachWait=false;
this.reachLine=null;
this.reachNumber=null;



},

destroyMeteor(){

    // =====================
    // ボス戦の召喚隕石
    // =====================

    if(
        Game.bossMeteors &&
        Game.bossMeteors.length > 0
    ){

        for(const meteor of Game.bossMeteors){

            if(meteor && meteor.active){

                meteor.hp = 99;
                meteor.active = false;

            }

        }

        Game.bossMeteors = [];

        Camera.hitShake(25);

        this.resultEffect = "meteor";
        this.resultEffectTimer = 60;

        Sound.meteor();

        return;
    }



    if(
        Game.meteor &&
        Game.meteor.active
    ){

        Game.meteor.hp = 99;

        Camera.hitShake(25);

        this.resultEffect = "meteor";
        this.resultEffectTimer = 60;

        Sound.meteor();

    }

},





    update(){

        if(this.reachEffectTimer > 0){

    this.reachEffectTimer -= Game.deltaTime;

}

if(this.resultTimer > 0){

    this.resultTimer -= Game.deltaTime;

    if(this.resultTimer <= 0){

        Game.coin.throw();

        this.visible=false;

        this.mode="IDLE";

    }

    return;

}

        if(this.stopTimer>0){

    this.stopTimer -= Game.deltaTime;

}
        
           if(this.mode !== "SPIN"){

        return;

    }



        if(!this.active){

            return;

        }




        // =====================
// リール回転
// =====================

for(let x=0;x<3;x++){


    if(this.stopped[x]){

        continue;

    }


    this.reelPos[x] +=
    this.reelSpeed[x] *
    Game.deltaTime;



    if(this.reelPos[x] >= 1){


    this.reelPos[x] -= 1;


    // リールを循環

}


}


        // 停止演出


        if(this.phaseTimer>0){


    this.phaseTimer -= Game.deltaTime;


    if(this.phaseTimer<=0 && this.phase===3){

        this.finish();

    }


    return;

}


    },







stop(){

    if(!this.active){

        return;

    }


    // =====================
    // 左リール
    // =====================

    if(this.phase===0){

        Sound.stop(1);

        this.stopped[0]=true;

        this.stopLight[0]=true;


        const pos =
        Math.floor(
            this.reelPos[0] *
            this.reels[0].length
        );


        const leftIndex =
        (
            pos +
            1 +
            this.reels[0].length
        )
        %
        this.reels[0].length;


        this.targetNumber =
        this.reels[0][leftIndex];


        this.phase=1;

        return;

    }



    // =====================
    // 中央リール
    // =====================

    if(this.phase===1){

        Sound.stop(2);

        this.stopped[1]=true;

        this.stopLight[1]=true;


        // =====================
        // 現在の左リール表示
        // 上・中央・下を取得
        // =====================

        const leftGrid=[];


        for(let y=0;y<3;y++){

            leftGrid[y] =
            this.reels[0][
                (
                    Math.floor(
                        this.reelPos[0] *
                        this.reels[0].length
                    )
                    +
                    this.stopOffset[0]
                    +
                    y
                    +
                    this.reels[0].length
                )
                %
                this.reels[0].length
            ];

        }



// =====================
// 中央リール補正
// 最大1段だけリーチさせる
// =====================

this.rowStopOffset[1] = [0, 0, 0];

const candidates = [];


// =====================
// 左と同じ図柄が中央に
// 存在する段を候補にする
// =====================

for(let y = 0; y < 3; y++){

    const target =
        leftGrid[y];

    for(
        let i = 0;
        i < this.reels[1].length;
        i++
    ){

        if(
            this.reels[1][i] === target
        ){

            candidates.push(y);

            break;

        }

    }

}


// =====================
// 補正候補
// =====================

const reachCandidates = [];


// =====================
// 各段ごとに確率判定
// =====================

for(const y of candidates){

    const target =
        leftGrid[y];


    // =====================
    // 通常数字
    // =====================

    let reachChance =
        0.90 


    // 最大90%
    reachChance =
        Math.min(
            reachChance,
            0.90
        );


    // =====================
    // ☄・★
    // 30%固定
    // =====================

    if(
        target === "☄" ||
        target === "★"
    ){

        reachChance = 0.30;

    }


    // =====================
    // 補正成功
    // =====================

    if(
        Math.random() < reachChance
    ){

        reachCandidates.push(y);

    }

}


// =====================
// 最大1段だけ補正
// =====================

if(
    reachCandidates.length > 0
){

    const y =
        reachCandidates[
            Math.floor(
                Math.random() *
                reachCandidates.length
            )
        ];


    const target =
        leftGrid[y];


    const current =
        Math.floor(
            this.reelPos[1] *
            this.reels[1].length
        );


    // =====================
    // 対応する図柄を探す
    // =====================

    for(
        let i = 0;
        i < this.reels[1].length;
        i++
    ){

        if(
            this.reels[1][i] === target
        ){

            this.rowStopOffset[1][y] =
                i -
                current -
                y;

            break;

        }

    }

}



        // =====================
        // 中央リール表示位置
        // =====================

        const centerGrid=[];


        for(let y=0;y<3;y++){

            const offset =
                this.rowStopOffset[1][y];


            centerGrid[y] =
            this.reels[1][
                (
                    Math.floor(
                        this.reelPos[1] *
                        this.reels[1].length
                    )
                    +
                    offset
                    +
                    y
                    +
                    this.reels[1].length
                )
                %
                this.reels[1].length
            ];

        }



// =====================
// リーチ判定
// 横3ライン + 斜め2ライン
// =====================

this.rowReach = [
    false,
    false,
    false
];

this.rowReachNumber = [
    null,
    null,
    null
];


// =====================
// 横ライン
// =====================

for(let y = 0; y < 3; y++){

    if(
        leftGrid[y] === centerGrid[y]
    ){

        this.rowReach[y] = true;

        this.rowReachNumber[y] =
            leftGrid[y];

    }

}


// =====================
// 斜めリーチ
//
// 左上 → 中央 → 右下
// 左下 → 中央 → 右上
//
// 右リールはまだ回転中なので
// 「左＋中央」が一致しているかだけを見る
// =====================

this.diagonalReach = [
    false,
    false
];


// 左上 → 中央

if(
    leftGrid[0] === centerGrid[1]
){

    this.diagonalReach[0] = true;

}


// 左下 → 中央

if(
    leftGrid[2] === centerGrid[1]
){

    this.diagonalReach[1] = true;

}


// =====================
// どこか1ラインでもリーチ
// =====================

if(
    this.rowReach[0] ||
    this.rowReach[1] ||
    this.rowReach[2] ||
    this.diagonalReach[0] ||
    this.diagonalReach[1]
){

    this.reach = true;

    this.reachWait = true;

    this.reachTimer = 60;

    this.reachEffectTimer = 120;

}


        this.phase=2;

        return;

    }



    // =====================
    // 右リール
    // =====================

    if(this.phase===2){

        // =====================
        // リーチ演出待ち
        // =====================

        if(this.reachWait){

            this.reachTimer -=
                Game.deltaTime;


            if(this.reachTimer <= 0){

                this.reachWait=false;

            }

        }


        Sound.stop(3);


        this.stopped[2]=true;

        this.stopLight[2]=true;



        // =====================
        // 現在の中央リール
        // 上・中央・下
        // =====================

        const centerGrid=[];


        for(let y=0;y<3;y++){

            centerGrid[y] =
            this.reels[1][
                (
                    Math.floor(
                        this.reelPos[1] *
                        this.reels[1].length
                    )
                    +
                    this.rowStopOffset[1][y]
                    +
                    y
                    +
                    this.reels[1].length
                )
                %
                this.reels[1].length
            ];

        }



// =====================
// 右リール補正
// 最大1段だけ補正
// =====================

this.rowStopOffset[2] = [0, 0, 0];

const rightCandidates = [];


// =====================
// 補正候補を作る
// =====================

for(let y = 0; y < 3; y++){

    const target =
        centerGrid[y];

    // =====================
// 基本補正確率
// WAVEが上がるほど弱くする
// =====================

let chance =
    0.5 //-
   // (Game.wave - 1) * 0.04;

chance =
    Math.max(
        chance,
        0.15
    );


// =====================
// レア役補正
// WAVEが上がるほど弱くする
// =====================

if(
    centerGrid[y] === "☄"
){

    chance =
        0.20 -
        (Game.wave - 1) * 0.02;

    chance =
        Math.max(
            chance,
            0.15
        );

}
else if(
    centerGrid[y] === "★"
){

    chance =
        0.30 -
        (Game.wave - 1) * 0.25;

    chance =
        Math.max(
            chance,
            0.30
        );

}

    // この段を補正候補に入れる
    if(Math.random() < chance){

        rightCandidates.push(y);

    }

}


// =====================
// 最大1段だけ補正
// =====================

if(rightCandidates.length > 0){

    // 候補の中から1段だけ選択
    const y =
        rightCandidates[
            Math.floor(
                Math.random() *
                rightCandidates.length
            )
        ];


    const target =
        centerGrid[y];


    const current =
        Math.floor(
            this.reelPos[2] *
            this.reels[2].length
        );


    // =====================
    // 対応する図柄を探す
    // =====================

    for(
        let i = 0;
        i < this.reels[2].length;
        i++
    ){

        if(
            this.reels[2][i] === target
        ){

            this.rowStopOffset[2][y] =
                i - current - y;

            break;

        }

    }

}


        // =====================
        // 既存の中央ライン用
        // リーチ演出との整合
        // =====================

        if(this.reach){

            // 中央段がリーチしている場合だけ
            // これまでの中央ライン補正を維持

            if(this.rowReach[1]){

                this.rowStopOffset[2][1] =
                    this.rowStopOffset[2][1];

            }

        }



        this.phase=3;

        this.phaseTimer=20;

        return;

    }

},






   stopColumn(column){

    this.stopped[column]=true;

},





    finish(){

        const resultGrid=[];


for(let y=0;y<3;y++){

    for(let x=0;x<3;x++){


        const pos =
(
    Math.floor(
        this.reelPos[x] *
        this.reels[x].length
    )
    +
    this.rowStopOffset[x][y]
    +
    y
    +
    this.reels[x].length
)
%
this.reels[x].length;


let value =
this.reels[x][pos];



resultGrid.push(value);


    }

}





        this.result=1;

        let bonusHit = null;


        this.highlightLines=[];




        const lines=[



            [0,1,2],

            [3,4,5],

            [6,7,8],



            [0,3,6],

            [1,4,7],

            [2,5,8],



            [0,4,8],

            [2,4,6]


        ];





        for(let line of lines){



            const a=resultGrid[line[0]];

const b=resultGrid[line[1]];

const c=resultGrid[line[2]];



            if(
                a===b &&
                b===c
            ){



                if(a==="☄"){

     // 隕石一発破壊役
    this.result = 99;

    this.meteorHit = true;

}
else if(a==="★"){

    this.result = 10;

}
else{

    this.result =
    Math.max(
        this.result,
        a
    );


    // SPECIAL BONUS成立判定
   if(
    WaveBonus.active &&
    Number(a) === Number(WaveBonus.green)
){

    bonusHit="green";

}
else if(
    WaveBonus.active &&
    Number(a) === Number(WaveBonus.blue)
){

    bonusHit="blue";

}
else if(
    WaveBonus.active &&
    Number(a) === Number(WaveBonus.yellow)
){

    bonusHit="yellow";

}


}




                this.highlightLines.push(
                    line
                );


            }


        }


Game.power = this.result;


if(this.meteorHit){

  // =====================
// ☄ 隕石役
// =====================

if(this.meteorHit){

    // =====================
    // BOSS戦
    // =====================

    if(
        Game.bossWave &&
        Game.bossPhase === "BATTLE"
    ){

        // =====================
        // ① 召喚隕石が存在
        // =====================

        if(
            Game.bossMeteors &&
            Game.bossMeteors.some(
                meteor =>
                    meteor &&
                    meteor.active
            )
        ){

            this.destroyMeteor();

            Game.meteorClear = true;

        }

        // =====================
        // ② 月本体がCHANCE状態
        // =====================

        else if(
            Game.boss &&
            Game.boss.active &&
            Game.boss.attackState === "CHANCE" &&
            Game.boss.phase === 2
        ){

            // ★ 月本体へのMETEOR攻撃
            // ダメージ計算は今まで通り

            const damage =
                Game.boss.hp * 0.5;

            Game.meteorClear = true;

            Game.boss.damage(damage);


            // =====================
            // 月本体を撃破
            // =====================

            if(
                Game.boss.hp <= 0
            ){

                this.meteorFinish = true;

                this.meteorFinishTimer = 100;

                this.resultEffect =
                    "meteorFinish";

                this.resultEffectTimer = 100;

                this.stopTimer = 100;

                this.resultTimer = 100;

                Camera.hitShake(80);

                console.log(
                    "★ METEOR FINISH : MOON DESTROYED ★"
                );

            }

            // =====================
            // 月を倒せなかった
            // =====================

            else{

                Game.meteorClear = false;

                Camera.hitShake(40);

                this.resultEffect =
                    "meteor";

                this.resultEffectTimer = 60;

                Sound.meteor();

            }

        }

        // =====================
        // ③ 対象がなくても
        //    ☄役成立として扱う
        // =====================

        else{

            console.log(
                "☄ METEOR役成立：BOSS条件成立"
            );

            // ★ ダメージ処理は行わない
            // ★ 特殊エンディング条件だけ成立

            Game.meteorClear = true;

        }

    }

    // =====================
    // 通常WAVE
    // =====================

    else{

        this.destroyMeteor();

    }

}

}






//=====================
// リザルト演出設定
//=====================

this.resultEffect="normal";


if(this.meteorFinish){

    this.resultEffect="meteorFinish";

}
else if(this.meteorHit){

    this.resultEffect="meteor";

}
else if(this.result === 7){

    this.resultEffect="seven";

}
else if(this.result === 10){

    this.resultEffect="star";

}
else if(this.result === 9){

    this.resultEffect="nine";

}


this.resultEffectTimer=60;



       this.stopTimer=40;



// ルーレット終了
this.mode="RESULT";

this.active=false;


// 結果表示時間
this.resultTimer =
    this.meteorFinish
    ? 100
    : 25;

if(this.resultEffect==="meteorFinish"){

    // METEOR FINISH
    Camera.hitShake(80);

}
else if(this.resultEffect==="meteor"){

    Camera.hitShake(60);

    Sound.meteor();

}
else if(this.resultEffect==="star"){

    Sound.star();

}




Game.power = this.result;

if(this.result === 1){

    Sound.miss();

}
else if(this.result < 7){

    Sound.success(this.result);

}
else if(this.result === 7){

    Sound.seven();
}

else if(this.result === 8){

    Sound.success(8);

}

else if(this.result===9){

    Sound.nine();

}

// 2以上が揃った時だけ強化
if(this.result > 1){

    Game.bonus = true;

}
else{

    Game.bonus = false;

}
//=====================
// SPECIAL BONUS発動
//=====================

if(
    WaveBonus.active &&
    bonusHit
){


    // =====================
// GREEN
// 隕石を押し戻す
// =====================

if(bonusHit === "green"){

    // 攻撃対象が存在するか確認
    let targetExists = false;


    // =====================
    // 通常隕石
    // =====================

    if(
        !Game.bossWave &&
        Game.meteor &&
        Game.meteor.active
    ){

        targetExists = true;

    }


    // =====================
    // BOSS戦
    // =====================

    if(
        Game.bossWave &&
        Game.bossPhase === "BATTLE"
    ){

        // 召喚隕石がいる
        if(
            Game.bossMeteors &&
            Game.bossMeteors.some(
                meteor =>
                    meteor &&
                    meteor.active
            )
        ){

            targetExists = true;

        }

        // 召喚隕石がいなければ月
        else if(
            Game.boss &&
            Game.boss.active
        ){

            targetExists = true;

        }

    }


    // =====================
    // 飛行機発進
    // =====================

    if(targetExists){

        const plane =
            new Plane("green");

        Game.planes.push(plane);

        plane.greenAttack = true;

    }

}



    // 青
    else if(bonusHit==="blue"){

    // 次の1回転だけ減速
    WaveBonus.blueSpin=true;

}



    // 黄色
    else if(
    bonusHit==="yellow" 
){


        WaveBonus.yellowActive=true;

        WaveBonus.yellowShots=0;


    }



}
//=====================
// 特殊数字説明
//=====================

this.effectMessage="";


if(
    Game.wave >= 3 &&
    WaveBonus
){

   if(
    WaveBonus.active &&
    bonusHit==="green"
){

        this.effectMessage =
        "GREEN BONUS\n援軍到着！！";

    }


    else if(WaveBonus.active &&
        bonusHit==="blue"){

        this.effectMessage =
        "BLUE BONUS\nスロット速度DOWN";

    }


    else if(WaveBonus.active &&
       bonusHit==="yellow"){

        this.effectMessage =
        "YELLOW BONUS\n強化ミサイル2発発射";

    }


    if(this.effectMessage){

        this.effectMessageTimer=180;

    }

}

    this.reach=false;
    this.reachWait=false;
    this.reachEffectTimer=0;
    this.reachLine=null;

 



    },







    draw(ctx){

        if(!this.visible){

        return;

    }



        
// =====================
// スロットサイズ
// =====================

const size = 90;

// 3列分を常に中央配置
const slotWidth = size * 3;

const startX =
    400 - slotWidth / 2;

const startY = 185;

// スロット全体
const slotHeight =
    size * 3;




        // =====================================================
// ★ METEOR FINISH
// =====================================================

if(
    this.meteorFinish &&
    this.meteorFinishTimer > 0
){

    this.meteorFinishTimer -= Game.deltaTime;


    const t =
        1 -
        this.meteorFinishTimer / 100;


    // =====================
    // フラッシュ
    // =====================

    let flashAlpha = 0;

    if(t < 0.18){

        flashAlpha =
            1 -
            t / 0.18;

    }
    else{

        flashAlpha =
            Math.max(
                0,
                0.35 -
                t * 0.35
            );

    }


    ctx.fillStyle =
        `rgba(255,120,20,${flashAlpha})`;

    ctx.fillRect(
        0,
        0,
        800,
        700
    );


    // =====================
    // 巨大衝撃波
    // =====================

    const ringRadius =
        80 +
        t * 620;


    const ringAlpha =
        Math.max(
            0,
            1 - t
        );


    ctx.save();

    ctx.strokeStyle =
        `rgba(255,100,20,${ringAlpha})`;

    ctx.lineWidth =
        12 * (1 - t * 0.6);

    ctx.shadowColor =
        "#ff3300";

    ctx.shadowBlur =
        35;


    ctx.beginPath();

    ctx.arc(
        400,
        350,
        ringRadius,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    // =====================
    // 2本目の衝撃波
    // =====================

    if(t > 0.08){

        const ring2 =
            40 +
            (t - 0.08) * 700;

        ctx.strokeStyle =
            `rgba(255,220,80,${Math.max(
                0,
                0.8 - t
            )})`;

        ctx.lineWidth = 6;

        ctx.beginPath();

        ctx.arc(
            400,
            350,
            ring2,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    ctx.restore();


    // =====================
    // 放射状の衝撃線
    // =====================

    ctx.save();

    ctx.translate(400,350);

    const lineAlpha =
        Math.max(
            0,
            1 - t * 1.2
        );


    ctx.strokeStyle =
        `rgba(255,170,40,${lineAlpha})`;

    ctx.lineWidth = 4;

    ctx.shadowColor =
        "#ff4400";

    ctx.shadowBlur = 20;


    for(let i = 0; i < 20; i++){

        const angle =
            (Math.PI * 2 / 20) * i;

        const inner =
            100 + t * 250;

        const outer =
            180 + t * 420;


        ctx.beginPath();

        ctx.moveTo(
            Math.cos(angle) * inner,
            Math.sin(angle) * inner
        );

        ctx.lineTo(
            Math.cos(angle) * outer,
            Math.sin(angle) * outer
        );

        ctx.stroke();

    }


    ctx.restore();


    // =====================
    // METEOR FINISH
    // =====================

    const scale =
        1 +
        Math.sin(t * Math.PI) * 0.12;


    ctx.save();

    ctx.translate(
        400,
        285
    );

    ctx.scale(
        scale,
        scale
    );


    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.font =
        "italic bold 72px sans-serif";


    ctx.shadowColor =
        "#ff2200";

    ctx.shadowBlur =
        40;


    ctx.fillStyle =
        "#fff4c0";


    ctx.fillText(
        "METEOR",
        0,
        -25
    );


    ctx.fillStyle =
        "#ff5a00";


    ctx.fillText(
        "FINISH",
        0,
        50
    );


    // =====================
    // 白いハイライト
    // =====================

    ctx.shadowColor =
        "#ffffff";

    ctx.shadowBlur =
        12;

    ctx.fillStyle =
        "rgba(255,255,255,0.85)";


    ctx.font =
        "bold 16px sans-serif";


    ctx.fillText(
        "★ FINAL IMPACT ★",
        0,
        105
    );


    ctx.restore();


    // =====================
    // MOON DEVIL DESTROYED
    // =====================

    const subAlpha =
        Math.min(
            1,
            t * 3
        );


    ctx.save();

    ctx.textAlign =
        "center";

    ctx.font =
        "bold 26px sans-serif";

    ctx.fillStyle =
        `rgba(255,255,255,${subAlpha})`;

    ctx.shadowColor =
        "#ff0000";

    ctx.shadowBlur =
        18;


    ctx.fillText(
        "MOON DEVIL DESTROYED",
        400,
        440
    );


    ctx.restore();

}
        if(this.resultEffect==="meteor"
&& this.resultEffectTimer>0){

    ctx.fillStyle="rgba(255,80,0,0.25)";

    ctx.fillRect(
        0,
        0,
        800,
        700
    );

}


// =====================
// スロット筐体
// =====================

// =====================
// リーチ演出
// =====================

// リーチしている段だけ演出する
const reachGlow =
    this.reachEffectTimer > 0 &&
    (
        this.rowReach &&
        (
            this.rowReach[0] ||
            this.rowReach[1] ||
            this.rowReach[2]
        )
    );


// =====================
// リーチ演出の色
// =====================

if(reachGlow){

    let reachColor = "#00ffff";
    let reachBlur = 30;

    // 実際にリーチしている数字を見る
    for(let y = 0; y < 3; y++){

        if(
            this.rowReach &&
            this.rowReach[y]
        ){

            const value =
                this.rowReachNumber[y];

            // ☄リーチ
            if(value === "☄"){

                reachColor = "#ff5500";
                reachBlur = 60;

                break;

            }

            // ★リーチ
            if(value === "★"){

                reachColor = "#ffff00";
                reachBlur = 40;

                break;

            }

        }

    }

    ctx.shadowColor = reachColor;
    ctx.shadowBlur = reachBlur;

}



// =====================
// 外枠
// =====================

const frameX =
    startX - 45;

const frameY =
    startY - 75;

const frameW =
    slotWidth + 90;

const frameH =
    slotHeight + 170;


ctx.fillStyle =
    "#2b2f3a";

ctx.beginPath();

ctx.roundRect(
    frameX,
    frameY,
    frameW,
    frameH,
    18
);

ctx.fill();


// =====================
// 内枠
// =====================

const frame =
    ctx.createLinearGradient(
        0,
        frameY,
        0,
        frameY + frameH
    );

frame.addColorStop(
    0,
    "#3e5cff"
);

frame.addColorStop(
    0.5,
    "#101830"
);

frame.addColorStop(
    1,
    "#5fb7ff"
);

ctx.fillStyle =
    frame;

ctx.beginPath();

ctx.roundRect(
    frameX + 15,
    frameY + 15,
    frameW - 30,
    frameH - 30,
    14
);

ctx.fill();


// =====================
// タイトル
// =====================

ctx.fillStyle =
    "#ffffff";

ctx.font =
    "bold 28px sans-serif";

ctx.textAlign =
    "center";

ctx.textBaseline =
    "middle";

ctx.shadowColor =
    "#55aaff";

ctx.shadowBlur =
    18;

ctx.fillText(
    "☄ METEOR SLOT ☄",
    400,
    startY - 35
);

ctx.shadowBlur = 0;



// =====================
// スロット背景
// =====================

const slotX = startX - 15;
const slotY = startY - 15;

const slotW = slotWidth + 30;
const slotH = slotHeight + 30;

ctx.fillStyle = "#0b1024";

ctx.fillRect(
    slotX,
    slotY,
    slotW,
    slotH
);

ctx.strokeStyle = "#55ddff";
ctx.lineWidth = 4;

ctx.strokeRect(
    slotX,
    slotY,
    slotW,
    slotH
);

ctx.shadowColor = "#33ccff";
ctx.shadowBlur = 20;

ctx.strokeRect(
    slotX,
    slotY,
    slotW,
    slotH
);

ctx.shadowBlur = 0;





        for(let y=0;y<3;y++){


            for(let x=0;x<3;x++){



                const index =
                y*3+x;



                let glow=false;




                for(let line of this.highlightLines){


                    if(
                        line.includes(index)
                    ){

                        glow=true;

                    }


                }





                if(glow){


                    ctx.shadowColor="#00ffff";
                    ctx.shadowBlur=25;

                    ctx.fillStyle="#00ffff";


                }
                else{


                    const panel =
                    ctx.createLinearGradient(
                        0,
                    startY+y*size,
                     0,
                     startY+y*size+size
                    );

panel.addColorStop(0,"#1b2b55");
panel.addColorStop(1,"#081020");

ctx.fillStyle=panel;


                }




                ctx.fillRect(

                    startX+x*size,

                    startY+y*size,

                    size-5,

                    size-5

                );

               ctx.shadowBlur=0;





                ctx.strokeStyle="white";


                ctx.strokeRect(

                    startX+x*size,

                    startY+y*size,

                    size-5,

                    size-5

                );





                ctx.shadowColor="#66ffff";
                ctx.shadowBlur=15;

               


                ctx.textAlign="center";


                ctx.textBaseline="middle";



                ctx.save();


ctx.beginPath();

ctx.rect(
    startX + x * size,
    startY + y * size,
    size - 5,
    size - 5
);

ctx.clip();



const pos =
(
    Math.floor(
        this.reelPos[x] *
        this.reels[x].length
    )
    +
    this.rowStopOffset[x][y]
    +
    y
    +
    this.reels[x].length
)
%
this.reels[x].length;


let value =
this.reels[x][pos];

if(value==="☄"){


    ctx.fillStyle="#ff6600";
    ctx.shadowColor="#ff0000";
    ctx.shadowBlur=20;


}
else if(value==="★"){


    ctx.fillStyle="#ffff00";
    ctx.shadowColor="#ffffff";
    ctx.shadowBlur=20;


}
else if(
    WaveBonus &&
    Number(WaveBonus.green) === Number(value)
){

    // 緑特殊
    ctx.fillStyle="#66ff99";
    ctx.shadowColor="#66ff99";
    ctx.shadowBlur=35;


}
else if(
    WaveBonus &&
    Number(WaveBonus.blue) === Number(value)
){

    // 青特殊
    ctx.fillStyle="#55aaff";
    ctx.shadowColor="#55aaff";
    ctx.shadowBlur=35;


}
else if(
    WaveBonus &&
    Number(WaveBonus.yellow) === Number(value)
){

    // 黄特殊
    ctx.fillStyle="#ffff66";
    ctx.shadowColor="#ffff00";
    ctx.shadowBlur=35;


}
else{

    // 通常数字
    ctx.fillStyle="#ffffff";
    ctx.shadowColor="#66ffff";
    ctx.shadowBlur=15;

}



// =====================
// シンボル表示
// =====================

const symbolX =
    startX +
    x * size +
    size / 2;

const symbolY =
    startY +
    y * size +
    size / 2;

let fontSize = 52;

// ☄
if(value === "☄"){

    fontSize = 58;

}
// ★
else if(value === "★"){

    fontSize = 60;

}

ctx.font =
    "900 " +
    fontSize +
    "px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";

// 黒い縁取り
ctx.lineWidth = 5;
ctx.strokeStyle = "#000000";

ctx.strokeText(
    value,
    symbolX,
    symbolY
);

// 本体
ctx.fillText(
    value,
    symbolX,
    symbolY
);



ctx.shadowBlur=0;


ctx.restore();



            }


        }

      ctx.shadowBlur=0;


// =====================
// STOPボタン
// =====================

const buttonY =
    startY +
    slotHeight +
    25;

const buttonWidth = 75;
const buttonHeight = 40;

const buttonGap = 15;

const totalButtonWidth =
    buttonWidth * 3 +
    buttonGap * 2;

const buttonStartX =
    400 -
    totalButtonWidth / 2;


for(let i = 0; i < 3; i++){

    const buttonX =
        buttonStartX +
        i * (buttonWidth + buttonGap);


    const grad =
        ctx.createLinearGradient(
            buttonX,
            buttonY,
            buttonX,
            buttonY + buttonHeight
        );


    if(this.stopLight[i]){

        grad.addColorStop(
            0,
            "#55ff55"
        );

        grad.addColorStop(
            1,
            "#008000"
        );

    }
    else{

        grad.addColorStop(
            0,
            "#ff5555"
        );

        grad.addColorStop(
            1,
            "#800000"
        );

    }


    ctx.fillStyle = grad;


    ctx.beginPath();

    ctx.roundRect(
        buttonX,
        buttonY,
        buttonWidth,
        buttonHeight,
        8
    );

    ctx.fill();


    ctx.strokeStyle = "#ffffff";

    ctx.stroke();


    ctx.fillStyle = "white";

    ctx.font =
        "bold 17px sans-serif";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    ctx.fillText(
        "STOP",
        buttonX + buttonWidth / 2,
        buttonY + buttonHeight / 2
    );

}






        if(this.stopTimer>0){



            ctx.shadowColor="#00ffff";
            ctx.shadowBlur=25;

            ctx.fillStyle="#ffffff";


            ctx.font="55px sans-serif";


            ctx.textAlign="center";

            


            let text="POWER ×"+this.result;

let color="#ffffff";
let size=55;


// 7揃い
if(this.resultEffect==="seven"){

    text="★ POWER ×7 ★";

    color="#ffff00";

    size=70;

}

else if(this.resultEffect==="nine"){

    text="POWER ×9";

    color="#ff00ff";

    size=75;

}


// ★
else if(this.resultEffect==="star"){

    text="★SPECIAL POWER★";

    color="#00ffff";

    size=65;

}


// 隕石
else if(this.resultEffect==="meteor"){

    text="☄METEOR IMPACT☄";

    color="#ff5500";

    size=80;

}



ctx.shadowColor=color;

ctx.shadowBlur=35;

ctx.fillStyle=color;

ctx.font=
"bold "+size+"px sans-serif";


ctx.fillText(
    text,
    400,
    105
);




ctx.shadowBlur=0;

            


        }
//=====================
// 効果説明
//=====================
if(this.effectMessageTimer > 0){

    this.effectMessageTimer -= Game.deltaTime;


    // undefined / null / 空文字なら表示しない
    if(
        this.effectMessage === undefined ||
        this.effectMessage === null 
    ){
        return;
    }

    ctx.save();

    ctx.fillStyle="rgba(0,0,0,0.65)";
    ctx.beginPath();
    ctx.roundRect(
        180,
        520,
        440,
        90,
        15
    );
    ctx.fill();

    ctx.textAlign="center";
    ctx.textBaseline="middle";

    ctx.shadowColor="#66ff99";
    ctx.shadowBlur=20;

    ctx.fillStyle="#ffffff";
    ctx.font="bold 28px sans-serif";

   const lines = String(this.effectMessage || "").split("\n");

    if(lines[0]){
    ctx.fillText(lines[0],400,550);
}

ctx.font="bold 22px sans-serif";

if(lines[1]){
    ctx.fillText(lines[1],400,585);
}

    ctx.restore();
}


    }


};
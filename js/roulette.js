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
6,"★",2
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

this.reelSpeed = [

    0.010 * slow * fast,
    0.0125 * slow * fast,
    0.015 * slow * fast

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



   // 左

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
pos + 1 + this.reels[0].length
)
%
this.reels[0].length;


this.targetNumber =
this.reels[0][leftIndex];

    this.phase=1;

    return;

}



    if(this.phase===1){
        Sound.stop(2);

    this.stopped[1]=true;

    this.stopLight[1]=true;



    // 40%で左と同じ数字を狙う

    let reachChance =
0.7 +
(Game.wave - 1) * 0.03;


// 最大90%
reachChance =
Math.min(
    reachChance,
    0.9
);


// レア役は少し低くする
if(
    this.targetNumber==="☄" ||
    this.targetNumber==="★"
){

    reachChance=0.4;

}


if(Math.random()<reachChance){

    const current =
    Math.floor(
        this.reelPos[1] *
        this.reels[1].length
    );


    for(let i=0;i<this.reels[1].length;i++){

        if(this.reels[1][i]===this.targetNumber){

            this.stopOffset[1] =
            i - current - 1;

            break;

        }

    }

}

//=====================
// 左・中央 表示位置でリーチ判定
//=====================

const leftGrid=[];
const centerGrid=[];


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


    centerGrid[y] =
    this.reels[1][
        (
        Math.floor(
            this.reelPos[1] *
            this.reels[1].length
        )
        +
        this.stopOffset[1]
        +
        y
        +
        this.reels[1].length
        )
        %
        this.reels[1].length
    ];

}



const leftValue = leftGrid[1];


// 真ん中ラインだけリーチ判定
if(
    leftValue === centerGrid[1]
){

    this.reachLine="middle";

    // ★実際のリーチ数字
    this.reachNumber = leftValue;

}



if(this.reachLine){

    this.reach=true;

    this.reachWait=true;

    this.reachTimer=60;

    this.reachEffectTimer=120;

}







    this.phase=2;

    return;

}



// 右

if(this.phase===2){


    // リーチ演出待ち

if(this.reachWait){

    this.reachTimer -= Game.deltaTime;


    if(this.reachTimer <= 0){

        this.reachWait=false;

    }

}

Sound.stop(3);

    this.stopped[2]=true;

    this.stopLight[2]=true;



// リーチ時補正

if(this.reach){

    let chance =
0.6 +
(Game.wave - 1) * 0.04;


chance =
Math.min(
    chance,
    0.9
);


    // レア役リーチ補正
if(this.reachNumber==="☄"){


    chance =
    0.25 +
    (Game.wave-1)*0.03;


    chance =
    Math.min(
        chance,
        0.45
    );


}
else if(this.reachNumber==="★"){


    chance =
    0.8 +
    (Game.wave-1)*0.02;


    chance =
    Math.min(
        chance,
        0.95
    );


}


    if(Math.random() < chance){

        const target = this.targetNumber;


        for(let i=0;i<this.reels[2].length;i++){

            if(this.reels[2][i] === target){

                const current =
                Math.floor(
                    this.reelPos[2] *
                    this.reels[2].length
                );


                this.stopOffset[2] =
                i - current - 1;


                break;

            }

        }

    }
    else{

        // ハズレ時は補正なし
        this.stopOffset[2]=0;

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
 this.reelPos[x] * this.reels[x].length
)
+
this.stopOffset[x]
+
this.reels[x].length
)
%
this.reels[x].length


        let value =
this.reels[x][
(pos+y) % this.reels[x].length
];



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

    // =====================
    // BOSS戦
    // =====================

    if(
        Game.bossWave &&
        Game.bossPhase === "BATTLE"
    ){

        // =====================
        // ① 召喚隕石が存在する場合
        // =====================

        if(
            Game.bossMeteors &&
            Game.bossMeteors.length > 0
        ){

            this.destroyMeteor();

            // ★実際に召喚隕石を破壊した
            Game.meteorClear = true;

        }

        // =====================
        // ② 召喚隕石がなく、月がCHANCEの場合
        // =====================

       else if(
    Game.boss &&
    Game.boss.active &&
    Game.boss.attackState === "CHANCE" &&
    Game.boss.phase === 2
){

    // ★METEOR役によるボス攻撃
    const damage =
        Game.boss.hp * 0.5;

    // ★ボス撃破処理より先に判定フラグを準備
    Game.meteorClear = true;

    Game.boss.damage(damage);

    // ★実際に月を倒した場合
    if(Game.boss.hp <= 0){

        this.meteorFinish = true;

        this.meteorFinishTimer = 100;

        this.resultEffect = "meteorFinish";

        this.resultEffectTimer = 100;

        this.stopTimer = 100;

        this.resultTimer = 100;

        Camera.hitShake(80);

        console.log(
            "★ METEOR FINISH : MOON DESTROYED ★"
        );

    }
    else{

        // ★倒せなかったのでフラグを戻す
        Game.meteorClear = false;

        Camera.hitShake(40);

        this.resultEffect = "meteor";

        this.resultEffectTimer = 60;

        Sound.meteor();

    }

}

        // =====================
        // ③ それ以外
        // =====================

        else{

            console.log(
                "☄ METEOR役発動：対象なし"
            );

        }

    }

    // =====================
    // 通常WAVE
    // =====================

    else{

        this.destroyMeteor();

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


this.mode="RESULT";


this.active=false;


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



        const startX=295;
        const startY=220;
        const size=70;


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

        //====================
// スロット筐体
//====================

// リーチ演出
//====================
// リーチ演出
//====================

let reachGlow = false;

if(this.reachEffectTimer > 0){

    reachGlow = true;

}


if(reachGlow){

    if(this.targetNumber==="☄"){

        ctx.shadowColor="#ff5500";
        ctx.shadowBlur=60;

    }
    else if(this.targetNumber==="★"){

        ctx.shadowColor="#ffff00";
        ctx.shadowBlur=40;

    }
    else{

        ctx.shadowColor="#00ffff";
        ctx.shadowBlur=30;

    }

}

// 外枠
ctx.fillStyle = "#2b2f3a";

ctx.beginPath();
ctx.roundRect(
    startX - 35,
    startY - 60,
    size * 3 + 65,
    size * 3 + 120,
    18
);
ctx.fill();


// 内枠
const frame =
ctx.createLinearGradient(
    startX,
    startY - 40,
    startX,
    startY + size * 3 + 40
);

frame.addColorStop(0, "#3e5cff");
frame.addColorStop(0.5, "#101830");
frame.addColorStop(1, "#5fb7ff");

ctx.fillStyle = frame;

ctx.beginPath();
ctx.roundRect(
    startX - 20,
    startY - 45,
    size * 3 + 30,
    size * 3 + 90,
    14
);
ctx.fill();

ctx.fillStyle = "#ffffff";

ctx.font = "bold 28px sans-serif";

ctx.textAlign = "center";

ctx.shadowColor = "#55aaff";
ctx.shadowBlur = 18;

ctx.fillText(
    "☄ METEOR SLOT ☄",
    400,
    startY - 35
);

ctx.shadowBlur = 0;

        //====================
// スロット背景
//====================

ctx.fillStyle="#0b1024";

ctx.fillRect(
    startX-20,
    startY-20,
    250,
    250
);

ctx.strokeStyle="#55ddff";
ctx.lineWidth=4;

ctx.strokeRect(
    startX-20,
    startY-20,
    250,
    250
);

ctx.shadowColor="#33ccff";
ctx.shadowBlur=20;

ctx.strokeRect(
    startX-20,
    startY-20,
    250,
    250
);

ctx.shadowBlur=0;




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
    startX+x*size,
    startY+y*size,
    size-5,
    size-5
);

ctx.clip();



const pos =
(
Math.floor(
 this.reelPos[x] * this.reels[x].length
)
+
this.stopOffset[x]
+
this.reels[x].length
)
%
this.reels[x].length


let value =
this.reels[x][
(pos+y) % this.reels[x].length
];


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


ctx.fillText(

    value,

    startX+x*size+32,

    startY+y*size+32

);

ctx.shadowBlur=0;


ctx.restore();



            }


        }

      ctx.shadowBlur=0;

        //====================
// STOPボタン
//====================

const buttonY =
startY + size*3 + 25;


for(let i=0;i<3;i++){

    const buttonX =
    startX + i*70;


    // ボタン本体

    const grad =
    ctx.createLinearGradient(
        buttonX,
        buttonY,
        buttonX,
        buttonY+35
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


    ctx.fillStyle=grad;


    ctx.beginPath();

    ctx.roundRect(
        buttonX,
        buttonY,
        60,
        35,
        8
    );

    ctx.fill();



    // 枠

    ctx.strokeStyle="#ffffff";

    ctx.stroke();



    // 文字

    ctx.fillStyle="white";

    ctx.font="18px sans-serif";

    ctx.textAlign="center";

    ctx.textBaseline="middle";


    ctx.fillText(
        "STOP",
        buttonX+30,
        buttonY+18
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
    120
);




ctx.shadowBlur=0;

            


        }
//=====================
// 効果説明
//=====================
if(this.effectMessageTimer > 0){

    this.effectMessageTimer -= Game.deltaTime;

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

    const lines=this.effectMessage.split("\n");

    ctx.fillText(lines[0],400,550);

    ctx.font="bold 22px sans-serif";

    ctx.fillText(lines[1],400,585);

    ctx.restore();
}


    }


};
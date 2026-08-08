/*
    Meteor
    boss.js
*/


class Boss{


constructor(){

    this.reset();

}



reset(){

    // =====================
    // 基本
    // =====================

    this.x = 400;

    this.y = 120;

    this.targetY = 120;


    this.maxHp = 1000;

    this.hp = 1000;

    this.meteorSummonTimer = 0;
    this.summonIndex = 0;

    // =====================
// 第2形態デバフ
// =====================

this.debuffType = null;

this.debuffTimer = 0;

this.nextSlotFast = false;

this.nextAttackHalf = false;


    // =====================
// ボス攻撃状態
// =====================

this.attackState = "METEOR";

// METEOR
// ↓
// CHANCE
// ↓
// METEOR

this.attackChanceTimer = 0;

this.laughTimer = 180;

this.laughing = false;

this.laughDuration = 0;

        // =====================
    // 笑い攻撃
    // =====================

    this.laughTimer = 300;

    this.laughDuration = 0;


    this.active = true;


    // =====================
    // 形態
    // =====================

    this.phase = 1;

    this.transformed = false;


    // =====================
    // ダメージ演出
    // =====================

    this.damageFlash = 0;


    // =====================
    // 変身演出
    // =====================

    this.transformTimer = 0;


    // =====================
    // 浮遊
    // =====================

    this.time = 0;


    // =====================
    // 落下速度
    // =====================

    this.fallSpeed = 0;

    // =====================
// 第2形態用 奥行き
// =====================

this.z = 1000;

this.secondPhaseSpeed = 4;


    // =====================
    // サイズ
    // =====================

    this.radius = 100;


    // =====================
    // 表情
    // =====================

    this.mouthOpen = false;


}



update(){

    if(!this.active){

        return;

    }


    // =====================
    // 笑いタイマー
    // =====================

    this.laughTimer -= Game.deltaTime;


    if(this.laughTimer <= 0){

        // 攻撃チャンス中は笑い攻撃しない
        if(this.attackState !== "CHANCE"){

            this.laughTimer =
                180 + Math.random() * 120;

            this.laugh();

        }

    }


    // =====================
    // 笑い時間
    // =====================

    if(this.laughing){

        this.laughDuration -=
            Game.deltaTime;


        if(this.laughDuration <= 0){

            this.laughing = false;

            this.mouthOpen = false;

        }

    }


    // =====================
    // ダメージフラッシュ
    // =====================

    if(this.damageFlash > 0){

        this.damageFlash -=
            Game.deltaTime;

    }


    // =====================
    // 変身演出
    // =====================

    if(this.transformTimer > 0){

        this.transformTimer -=
            Game.deltaTime;

    }


    // =====================
    // 攻撃チャンス
    // =====================

    if(this.attackState === "CHANCE"){

    this.attackChanceTimer -=
        Game.deltaTime;


    if(this.attackChanceTimer <= 0){

        // =====================
        // 攻撃チャンス終了
        // =====================

        this.attackState = "METEOR";

          // =====================
    // 次の攻撃は右から
    // =====================

    this.summonIndex = 0;


        // すぐ次の隕石を召喚
        this.summonMeteors();

    }

    

}


    // =====================
    // 第1形態
    // =====================

    if(this.phase === 1){

        this.time +=
            0.03 *
            Game.deltaTime;


        this.y =
            120 +
            Math.sin(this.time) * 8;

    }


    // =====================
    // HP500以下
    // 第2形態
    // =====================

    if(
    this.phase === 1 &&
    this.hp < 500
){

    this.phase = 2;

    this.transformed = true;

    this.transformTimer = 90;


    // =====================
    // 第2形態
    // =====================

    this.attackState = "SECOND";


    // 月を奥から開始
    this.z = 1000;


    // 画面中央
    this.x = 400;


    // 上から開始
    this.y = 150;


    // 第1形態の召喚隕石を消す
    Game.bossMeteors = [];


    this.mouthOpen = true;


    Camera.hitShake(30);

}


// =====================
// 第2形態
// 月自身が通常隕石になる
// =====================

// =====================
// 第2形態
// 通常隕石と同じ落下
// =====================

if(this.phase === 2){

    // スロット中は停止
    if(Roulette.active){

        return;

    }


    // =====================
    // 奥行きを進める
    // =====================

    this.z -=
        this.secondPhaseSpeed *
        Game.deltaTime;


    if(this.z < 10){

        this.z = 10;

    }


    // =====================
    // 通常隕石と同じサイズ
    // =====================

    this.radius =
        Math.min(
            20000 / this.z,
            250
        );


    // =====================
    // 中央固定
    // =====================

    this.x = 400;


    // =====================
    // 画面上の位置
    // =====================

    this.y = 150;


    // =====================
    // 月が地球に到達
    // =====================

    if(
        this.z < 50 &&
        Game.state !== "GAMEOVER"
    ){

        this.hitPlayer();

        return;

    }

}


if(this.debuffTimer > 0){

    this.debuffTimer -=
        Game.deltaTime;

}
// =====================
// ボス隕石管理
// =====================

if(
    this.phase === 1 &&
    this.attackState === "METEOR" &&
    Game.bossMeteors.length === 0
){

    // =====================
    // まだ召喚する隕石がある
    // =====================

    if(this.summonIndex < 2){

        this.summonMeteors();

    }

    // =====================
    // 2個とも破壊された
    // =====================

    else{

        this.openAttackChance();

    }

}

}

summonMeteors(){

    if(!this.active){

        return;

    }


    if(this.attackState !== "METEOR"){

        return;

    }


    // すでに隕石が存在しているなら
    // 新しく作らない

    if(Game.bossMeteors.length > 0){

        return;

    }


    // =====================
    // 右 → 左の順番
    // =====================

    const side =
        this.summonIndex === 0
        ? "right"
        : "left";


    const meteor =
        new BossMeteor();


    meteor.spawnSide = side;


    // =====================
    // 月の左右に配置
    // =====================

    if(side === "right"){

        meteor.x =
            this.x +
            this.radius +
            35;

    }
    else{

        meteor.x =
            this.x -
            this.radius -
            35;

    }


    meteor.y =
        this.y;


    // =====================
    // 最初は待機
    // =====================

    meteor.moveState = "WAIT";


    // =====================
    // 登録
    // =====================

    Game.bossMeteors.push(
        meteor
    );


    // 次は左

    this.summonIndex++;

    if(side === "right"){

    meteor.moveState = "CENTER";

}


    // =====================
    // 笑い演出
    // =====================

    this.mouthOpen = true;

    this.laughing = true;

    this.laughDuration = 45;


    Sound.bossLaugh();

    Camera.hitShake(8);

}

openAttackChance(){

    // =====================
    // 攻撃チャンス開始
    // =====================

    this.attackState = "CHANCE";

    // 攻撃チャンス時間
    this.attackChanceTimer = 180;

    // 念のため召喚インデックスをリセット
    this.summonIndex = 0;

    // =====================
    // 笑いを止める
    // =====================

    this.laughing = false;
    this.mouthOpen = false;

}
laugh(){

    // =====================
    // 攻撃チャンス中は笑わない
    // =====================

    if(this.attackState === "CHANCE"){

        return;

    }


    // =====================
    // 笑い演出
    // =====================

    this.mouthOpen = true;

    this.laughing = true;

    this.laughDuration = 45;


    Sound.bossLaugh();

    Camera.hitShake(8);


    // =====================
    // 第2形態
    // =====================

    if(this.phase === 2){

        this.applyDebuff();

        return;

    }


    // =====================
    // 第1形態
    // =====================

    this.attackState = "METEOR";

}

applyDebuff(){

    const type =
        Math.floor(
            Math.random() * 3
        );


    // =====================
    // ① 月HP回復
    // =====================

    if(type === 0){

        this.hp =
            Math.min(
                this.maxHp,
                this.hp + 100
            );

        this.debuffType = "HEAL";

        this.debuffMessage =
            "MOON HEAL +100";

    }


    // =====================
    // ② 次のスロット高速
    // =====================

    else if(type === 1){

        this.nextSlotFast = true;

        this.debuffType = "SLOT";

        this.debuffMessage =
            "SLOT SPEED UP";

    }


    // =====================
    // ③ 次の攻撃半減
    // =====================

    else{

        this.nextAttackHalf = true;

        this.debuffType = "ATTACK";

        this.debuffMessage =
            "ATTACK POWER DOWN";

    }


    this.debuffTimer = 90;


    console.log(
        "BOSS DEBUFF:",
        this.debuffType
    );

}

damage(value){


    if(!this.active){

        return;

    }


    // =====================
    // ダメージ
    // =====================

    this.hp -= value;


    this.hp =
    Math.max(
        0,
        this.hp
    );


    this.damageFlash = 6;



    // =====================
    // HP0
    // =====================

    if(this.hp <= 0){

        this.hp = 0;

        this.active = false;

    }


}



draw(ctx){

    if(!this.active){

        return;

    }

    ctx.fillStyle = "red";

ctx.fillRect(
    this.x - 3,
    this.y - 3,
    6,
    6
);



    const r = this.radius;



    ctx.save();



    // =====================================================
    // 月の位置
    // =====================================================

    ctx.translate(
        this.x,
        this.y
    );



    // =====================================================
    // 月の外側の薄い光
    // =====================================================

    const aura =
        ctx.createRadialGradient(
            0,
            0,
            r * 0.75,
            0,
            0,
            r * 1.18
        );


    if(this.phase === 1){

        aura.addColorStop(
            0,
            "rgba(255,255,255,0)"
        );

        aura.addColorStop(
            0.75,
            "rgba(220,220,220,0.08)"
        );

        aura.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

    }
    else{

        aura.addColorStop(
            0,
            "rgba(255,80,60,0)"
        );

        aura.addColorStop(
            0.75,
            "rgba(180,20,20,0.15)"
        );

        aura.addColorStop(
            1,
            "rgba(255,0,0,0)"
        );

    }

    if(this.debuffTimer > 0){

    ctx.save();

    ctx.textAlign = "center";

    ctx.font = "bold 24px sans-serif";

    ctx.fillStyle = "#ff4444";

    ctx.shadowColor = "#ff0000";

    ctx.shadowBlur = 12;

    ctx.fillText(
        this.debuffMessage,
        this.x,
        this.y + this.radius + 65
    );

    ctx.restore();

}



    ctx.fillStyle = aura;



    ctx.beginPath();

    ctx.arc(
        0,
        0,
        r * 1.18,
        0,
        Math.PI * 2
    );

    ctx.fill();



    // =====================================================
    // 月本体
    // =====================================================

    const moon =
        ctx.createRadialGradient(

            -r * 0.38,
            -r * 0.42,
            r * 0.05,

            r * 0.12,
            r * 0.10,
            r * 1.15

        );



    if(this.phase === 1){

        moon.addColorStop(
            0,
            "#f4f4f4"
        );

        moon.addColorStop(
            0.30,
            "#d9d9d9"
        );

        moon.addColorStop(
            0.62,
            "#b4b4b4"
        );

        moon.addColorStop(
            0.84,
            "#858585"
        );

        moon.addColorStop(
            1,
            "#555555"
        );

    }
    else{

        moon.addColorStop(
            0,
            "#d88a8a"
        );

        moon.addColorStop(
            0.30,
            "#b05252"
        );

        moon.addColorStop(
            0.62,
            "#763232"
        );

        moon.addColorStop(
            0.84,
            "#481616"
        );

        moon.addColorStop(
            1,
            "#210707"
        );

    }



    ctx.fillStyle = moon;



    ctx.beginPath();

    ctx.arc(
        0,
        0,
        r,
        0,
        Math.PI * 2
    );

    ctx.fill();



    // =====================================================
    // 月面クリップ
    // =====================================================

    ctx.save();



    ctx.beginPath();

    ctx.arc(
        0,
        0,
        r,
        0,
        Math.PI * 2
    );

    ctx.clip();



    // =====================================================
    // 月面の細かいクレーター
    // =====================================================
    //
    // Math.random() は使わない。
    // 毎フレーム位置が変わるとチラつくため、
    // 固定配置にする。
    // =====================================================

    const craters = [

        [-0.68,-0.62,0.045],
        [-0.48,-0.72,0.025],
        [-0.25,-0.78,0.038],
        [ 0.02,-0.74,0.022],
        [ 0.30,-0.70,0.045],
        [ 0.55,-0.58,0.032],

        [-0.80,-0.38,0.030],
        [-0.60,-0.40,0.055],
        [-0.36,-0.48,0.026],
        [ 0.42,-0.43,0.040],
        [ 0.67,-0.34,0.050],
        [ 0.82,-0.12,0.025],

        [-0.82,-0.05,0.048],
        [-0.65, 0.08,0.028],
        [ 0.63, 0.05,0.038],
        [ 0.78, 0.20,0.055],

        [-0.78, 0.30,0.038],
        [-0.58, 0.42,0.060],
        [ 0.55, 0.38,0.050],
        [ 0.76, 0.48,0.032],

        [-0.66, 0.65,0.055],
        [-0.40, 0.72,0.030],
        [-0.10, 0.70,0.045],
        [ 0.20, 0.68,0.028],
        [ 0.48, 0.65,0.050],
        [ 0.70, 0.70,0.025],

        [-0.88, 0.62,0.025],
        [ 0.88, 0.55,0.030],

        [-0.30,-0.30,0.018],
        [ 0.34,-0.27,0.025],

        [-0.42, 0.18,0.020],
        [ 0.38, 0.18,0.018],

        [-0.20, 0.48,0.022],
        [ 0.28, 0.45,0.018]

    ];



    for(let c of craters){

        const cx =
            c[0] * r;

        const cy =
            c[1] * r;

        const cr =
            c[2] * r;



        // クレーターの外側の影

        const crater =
            ctx.createRadialGradient(

                cx - cr * 0.28,
                cy - cr * 0.28,
                cr * 0.05,

                cx,
                cy,
                cr

            );



        crater.addColorStop(
            0,
            "rgba(255,255,255,0.10)"
        );

        crater.addColorStop(
            0.35,
            "rgba(130,130,130,0.10)"
        );

        crater.addColorStop(
            0.70,
            "rgba(50,50,50,0.20)"
        );

        crater.addColorStop(
            1,
            "rgba(30,30,30,0.42)"
        );



        ctx.fillStyle = crater;



        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            cr,
            0,
            Math.PI * 2
        );

        ctx.fill();



        // クレーター内部

        ctx.fillStyle =
            "rgba(50,50,50,0.12)";



        ctx.beginPath();

        ctx.arc(
            cx + cr * 0.10,
            cy + cr * 0.10,
            cr * 0.55,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }



    // =====================================================
    // 非常に細かい月面の凹凸
    // =====================================================

    const tinyCraters = [

        [-0.72,-0.75,0.010],
        [-0.61,-0.68,0.008],
        [-0.52,-0.58,0.012],
        [-0.42,-0.82,0.009],
        [-0.32,-0.67,0.011],
        [-0.18,-0.82,0.008],
        [-0.06,-0.70,0.010],
        [ 0.12,-0.82,0.008],
        [ 0.24,-0.62,0.011],
        [ 0.40,-0.78,0.009],
        [ 0.53,-0.67,0.012],
        [ 0.66,-0.73,0.008],

        [-0.82,-0.25,0.010],
        [-0.70,-0.15,0.008],
        [-0.56,-0.28,0.011],
        [-0.46,-0.12,0.008],

        [ 0.48,-0.18,0.010],
        [ 0.58,-0.28,0.008],
        [ 0.70,-0.18,0.012],
        [ 0.82,-0.25,0.008],

        [-0.82,0.08,0.010],
        [-0.70,0.18,0.008],
        [-0.57,0.30,0.012],

        [ 0.58,0.22,0.010],
        [ 0.70,0.30,0.008],
        [ 0.83,0.36,0.011],

        [-0.80,0.48,0.009],
        [-0.70,0.56,0.012],
        [-0.52,0.52,0.008],
        [-0.46,0.68,0.010],

        [ 0.45,0.55,0.010],
        [ 0.62,0.52,0.008],
        [ 0.78,0.62,0.011],

        [-0.25,0.62,0.008],
        [-0.08,0.74,0.011],
        [ 0.08,0.62,0.009],
        [ 0.25,0.74,0.010]

    ];



    for(let c of tinyCraters){

        const cx =
            c[0] * r;

        const cy =
            c[1] * r;

        const cr =
            c[2] * r;



        ctx.fillStyle =
            "rgba(45,45,45,0.18)";



        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            cr,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }



    // =====================================================
    // 顔
    // =====================================================



    // =====================================================
    // 目の周囲のくぼみ
    // =====================================================

    const eyeY =
        -r * 0.18;



    const eyeX =
        r * 0.32;



    // 左目のくぼみ

    ctx.fillStyle =
        "rgba(55,55,55,0.28)";



    ctx.beginPath();

    ctx.ellipse(
        -eyeX,
        eyeY,
        r * 0.28,
        r * 0.075,
        -0.04,
        0,
        Math.PI * 2
    );

    ctx.fill();



    // 右目のくぼみ

    ctx.beginPath();

    ctx.ellipse(
        eyeX,
        eyeY,
        r * 0.28,
        r * 0.075,
        0.04,
        0,
        Math.PI * 2
    );

    ctx.fill();



    // =====================================================
    // 細く横長の目
    // =====================================================

    ctx.strokeStyle =
        "rgba(35,35,35,0.88)";



    ctx.lineWidth =
        r * 0.028;



    ctx.lineCap =
        "round";



    // 左目

    ctx.beginPath();

    ctx.moveTo(
        -r * 0.56,
        eyeY
    );

    ctx.quadraticCurveTo(
        -r * 0.32,
        eyeY - r * 0.075,
        -r * 0.08,
        eyeY
    );

    ctx.quadraticCurveTo(
        -r * 0.32,
        eyeY + r * 0.075,
        -r * 0.56,
        eyeY
    );

    ctx.stroke();



    // 右目

    ctx.beginPath();

    ctx.moveTo(
        r * 0.08,
        eyeY
    );

    ctx.quadraticCurveTo(
        r * 0.32,
        eyeY - r * 0.075,
        r * 0.56,
        eyeY
    );

    ctx.quadraticCurveTo(
        r * 0.32,
        eyeY + r * 0.075,
        r * 0.08,
        eyeY
    );

    ctx.stroke();



    // =====================================================
    // 目の内部
    // =====================================================

    ctx.fillStyle =
        "rgba(235,235,235,0.55)";



    ctx.beginPath();

    ctx.ellipse(
        -r * 0.32,
        eyeY,
        r * 0.17,
        r * 0.018,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();



    ctx.beginPath();

    ctx.ellipse(
        r * 0.32,
        eyeY,
        r * 0.17,
        r * 0.018,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();



    // =====================================================
    // 鼻
    // =====================================================

    // 鼻の左側の影

    ctx.strokeStyle =
        "rgba(55,55,55,0.38)";



    ctx.lineWidth =
        r * 0.035;



    ctx.beginPath();

    ctx.moveTo(
        -r * 0.035,
        -r * 0.12
    );

    ctx.quadraticCurveTo(
        -r * 0.055,
        r * 0.04,
        -r * 0.065,
        r * 0.22
    );

    ctx.stroke();



    // 鼻の右側の薄いハイライト

    ctx.strokeStyle =
        "rgba(245,245,245,0.35)";



    ctx.lineWidth =
        r * 0.018;



    ctx.beginPath();

    ctx.moveTo(
        r * 0.025,
        -r * 0.10
    );

    ctx.quadraticCurveTo(
        r * 0.04,
        r * 0.04,
        r * 0.045,
        r * 0.20
    );

    ctx.stroke();



    // =====================================================
    // 鼻先
    // =====================================================

    ctx.strokeStyle =
        "rgba(40,40,40,0.65)";



    ctx.lineWidth =
        r * 0.022;



    ctx.beginPath();

    ctx.moveTo(
        -r * 0.10,
        r * 0.22
    );

    ctx.quadraticCurveTo(
        -r * 0.05,
        r * 0.27,
        0,
        r * 0.23
    );

    ctx.quadraticCurveTo(
        r * 0.05,
        r * 0.27,
        r * 0.10,
        r * 0.22
    );

    ctx.stroke();



    // =====================================================
    // 小さな鼻の穴
    // =====================================================

    ctx.fillStyle =
        "rgba(30,30,30,0.60)";



    ctx.beginPath();

    ctx.ellipse(
        -r * 0.055,
        r * 0.225,
        r * 0.022,
        r * 0.012,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();



    ctx.beginPath();

    ctx.ellipse(
        r * 0.055,
        r * 0.225,
        r * 0.022,
        r * 0.012,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();



    // =====================================================
    // 口
    // =====================================================

    ctx.strokeStyle =
        "rgba(45,45,45,0.78)";



    ctx.lineWidth =
        r * 0.022;



    ctx.lineCap =
        "round";



    ctx.beginPath();



    if(this.mouthOpen){

        // 少しだけ開く

        ctx.moveTo(
            -r * 0.22,
            r * 0.39
        );

        ctx.quadraticCurveTo(
            0,
            r * 0.46,
            r * 0.22,
            r * 0.39
        );

    }
    else{

        // 画像のような非常に薄い微笑み

        ctx.moveTo(
            -r * 0.22,
            r * 0.39
        );

        ctx.quadraticCurveTo(
            0,
            r * 0.43,
            r * 0.22,
            r * 0.39
        );

    }



    ctx.stroke();



    // =====================================================
    // 口の両端
    // =====================================================

    ctx.fillStyle =
        "rgba(40,40,40,0.45)";



    ctx.beginPath();

    ctx.arc(
        -r * 0.22,
        r * 0.39,
        r * 0.018,
        0,
        Math.PI * 2
    );

    ctx.fill();



    ctx.beginPath();

    ctx.arc(
        r * 0.22,
        r * 0.39,
        r * 0.018,
        0,
        Math.PI * 2
    );

    ctx.fill();



    // =====================================================
    // 口を開いたとき
    // =====================================================

    if(this.mouthOpen){

        ctx.fillStyle =
            "rgba(20,10,10,0.90)";



        ctx.beginPath();

        ctx.ellipse(
            0,
            r * 0.405,
            r * 0.22,
            r * 0.055,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }



    // =====================================================
    // 第2形態
    // =====================================================

    if(this.phase === 2){

        // 赤い亀裂

        ctx.strokeStyle =
            "rgba(255,45,25,0.75)";



        ctx.shadowColor =
            "#ff2200";



        ctx.shadowBlur =
            7;



        ctx.lineWidth =
            2;



        ctx.beginPath();

        ctx.moveTo(
            -r * 0.72,
            r * 0.02
        );

        ctx.lineTo(
            -r * 0.53,
            r * 0.12
        );

        ctx.lineTo(
            -r * 0.62,
            r * 0.34
        );

        ctx.stroke();



        ctx.beginPath();

        ctx.moveTo(
            r * 0.70,
            -r * 0.05
        );

        ctx.lineTo(
            r * 0.52,
            r * 0.08
        );

        ctx.lineTo(
            r * 0.62,
            r * 0.28
        );

        ctx.stroke();



        ctx.shadowBlur = 0;

    }



    // =====================================================
    // ダメージフラッシュ
    // =====================================================

    if(this.damageFlash > 0){

        ctx.fillStyle =
            "rgba(255,255,255,0.70)";



        ctx.beginPath();

        ctx.arc(
            0,
            0,
            r,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }



    // =====================================================
// 月面クリップ終了
// =====================================================

ctx.restore();


// =====================================================
// Bossの座標変換終了
// =====================================================

ctx.restore();




// =====================================================
// CHANCE中だけボスHP表示
// =====================================================

if(this.attackState === "CHANCE"){

    const barWidth =
        180;

    const barHeight =
        14;

    const hpRate =
        Math.max(
            0,
            Math.min(
                1,
                this.hp / this.maxHp
            )
        );


    // =====================
    // HPバー背景
    // 月の下
    // =====================

    const barY =
        this.y +
        this.radius +
        25;


    ctx.fillStyle =
        "rgba(0,0,0,0.85)";


    ctx.fillRect(
        this.x - barWidth / 2,
        barY,
        barWidth,
        barHeight
    );


    // =====================
    // HP
    // =====================

    ctx.fillStyle =
        this.phase === 1
        ?
        "#999999"
        :
        "#cc2222";


    ctx.fillRect(
        this.x - barWidth / 2,
        barY,
        barWidth * hpRate,
        barHeight
    );


    // =====================
    // 枠
    // =====================

    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth =
        2;


    ctx.strokeRect(
        this.x - barWidth / 2,
        barY,
        barWidth,
        barHeight
    );


    // =====================
    // HP数値
    // =====================

    ctx.font =
        "bold 16px sans-serif";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        Math.ceil(this.hp) +
        " / " +
        this.maxHp,
        this.x,
        barY + 12
    );

}


    // =====================================================
    // BOSS表示
    // =====================================================

    ctx.textAlign =
        "center";



    ctx.font =
        "bold 24px sans-serif";



    ctx.fillStyle =
        "#ffffff";



    ctx.shadowColor =
        "#ff0000";



    ctx.shadowBlur =
        15;



    ctx.fillText(
        "MOON DEVIL",
        this.x,
        this.y - this.radius - 50
    );



    ctx.shadowBlur = 0;



    // =====================================================
    // 変身中
    // =====================================================

    if(this.transformTimer > 0){

        ctx.fillStyle =
            "rgba(255,0,0,0.20)";



        ctx.fillRect(
            0,
            0,
            800,
            700
        );



        ctx.fillStyle =
            "#ff2222";



        ctx.font =
            "bold 55px sans-serif";



        ctx.shadowColor =
            "#ff0000";



        ctx.shadowBlur =
            30;



        ctx.fillText(
            "HAHAHAHA!!",
            400,
            180
        );



        ctx.shadowBlur = 0;

    }

}

hitPlayer(){

    if(Game.state === "GAMEOVER"){
        return;
    }


    Game.state = "GAMEOVER";


    // ボーナス初期化
    WaveBonus.init();

    WaveBonusUI.active = false;


    Game.bullets = [];


    for(let p of Game.planes){

        p.destroy();

    }


    Sound.stopBattleBGM();

    Game.impactFlash = 30;

    Sound.gameOver();


    Camera.hitShake(30);


    // 画面破壊
    Game.screenCrack = 1;

    Game.cracks = [];


    for(let i=0;i<25;i++){

        const angle =
            Math.random() *
            Math.PI *
            2;


        const length =
            100 +
            Math.random() * 350;


        Game.cracks.push({

            angle: angle,

            length: length,

            branch: Math.random()

        });

    }

}


}
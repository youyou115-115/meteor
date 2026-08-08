/*
    Meteor
    bossMeteor.js
*/

class BossMeteor{

constructor(){

    this.reset();

}


reset(){

    // =====================
    // 初期位置
    // =====================

    this.x = 400;
    this.y = 120;

    this.targetX = 400;
    this.targetY = 700;

    this.spawned = false;

    // =====================
    // 出現位置
    // =====================

    this.spawnSide = "right";

    // =====================
    // 移動状態
    // =====================

    this.moveState = "WAIT";

    // =====================
    // 通常隕石と同じタイプ
    // =====================

    this.type = 0;

    // =====================
    // 奥行き
    // =====================

    this.z = 1000;

    // =====================
    // HP
    // =====================

    this.maxHp = 100;
    this.hp = 100;

    // =====================
    // 通常隕石と同じ速度
    // =====================

    this.speed = 4;

    // =====================
    // サイズ
    // =====================

    this.radius = 20;

    // =====================
    // 状態
    // =====================

    this.active = true;

    // =====================
    // ダメージ演出
    // =====================

    this.damageFlash = 0;

    // =====================
    // プレイヤー到達
    // =====================

    this.hitPlane = false;

    // =====================
    // 回転
    // =====================

    this.rotation =
        Math.random() *
        Math.PI * 2;

    this.rotationSpeed =
        (Math.random() * 0.04) - 0.02;
}


// =====================================================
// UPDATE
// =====================================================

update(){

    if(!this.active){

        return;

    }


    // =====================
    // ダメージフラッシュ
    // =====================

    if(this.damageFlash > 0){

        this.damageFlash -=
            Game.deltaTime;

    }


    // =====================
    // 回転
    // =====================

    this.rotation +=
        this.rotationSpeed *
        Game.deltaTime;


    // =================================================
    // 右・左から中央へ移動
    // =================================================

    if(this.movingToCenter){

        const dx =
            400 - this.x;


        // 中央へ寄せる
        if(Math.abs(dx) > 2){

            this.x +=
                dx *
                0.08 *
                Game.deltaTime;


            return;

        }


        // =====================
        // 中央到着
        // =====================

        this.x = 400;

        this.movingToCenter = false;

        return;

    }


    // =================================================
    // ここから通常隕石と同じ
    // =================================================


    // =====================
    // 奥へ進む
    // =====================

    this.z -=
        this.speed *
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
    // コイン付近まで到達
    // =====================

    if(
        this.z < 50 &&
        Game.state !== "GAMEOVER"
    ){

        this.hitPlane = true;


        this.hitPlayer();


        this.active = false;


        return;

    }

}


// =====================================================
// DAMAGE
// =====================================================

damage(value){

    if(!this.active){

        return;

    }


    this.hp -= value;


    this.damageFlash = 5;


    if(this.hp <= 0){

        this.hp = 0;

        this.active = false;


        Camera.hitShake(5);

        Sound.explosion();

    }

}


// =====================================================
// プレイヤーへの攻撃
// =====================================================

hitPlayer(){

    // =====================
    // 右の援軍
    // =====================

    const rightPlane =
        Game.planes.find(
            p =>
                p.side === "right" &&
                p.active &&
                !p.destroying
        );


    if(rightPlane){

        rightPlane.destroy();

        Camera.hitShake(15);

        Sound.planeCrash();

        return;

    }


    // =====================
    // 左の援軍
    // =====================

    const leftPlane =
        Game.planes.find(
            p =>
                p.side === "left" &&
                p.active &&
                !p.destroying
        );


    if(leftPlane){

        leftPlane.destroy();

        Camera.hitShake(15);

        Sound.planeCrash();

        return;

    }


    // =====================
    // ゲームオーバー
    // =====================

    if(
        Game.state !== "GAMEOVER"
    ){

        Game.state = "GAMEOVER";


        WaveBonus.init();

        WaveBonusUI.active = false;


        Game.bullets = [];


        for(let p of Game.planes){

            if(
                p.active &&
                !p.destroying
            ){

                p.destroy();

            }

        }


        Sound.stopBattleBGM();

        Game.impactFlash = 30;

        Sound.gameOver();

        Camera.hitShake(30);


        Game.screenCrack = 1;

        Game.cracks = [];


        for(let i=0;i<25;i++){

            const angle =
                Math.random() *
                Math.PI * 2;


            const length =
                100 +
                Math.random() * 350;


            Game.cracks.push({

                angle: angle,

                length: length,

                branch:
                    Math.random()

            });

        }

    }

}


// =====================================================
// DRAW
// =====================================================

draw(ctx){

    if(!this.active){

        return;

    }


    const r =
        this.radius;


    // =====================
    // 炎
    // =====================

    const fire =
        ctx.createRadialGradient(

            this.x,
            this.y,
            r * 0.7,

            this.x,
            this.y,
            r * 1.8

        );


    fire.addColorStop(
        0,
        "rgba(255,120,30,0.8)"
    );


    fire.addColorStop(
        0.5,
        "rgba(255,50,0,0.4)"
    );


    fire.addColorStop(
        1,
        "rgba(255,0,0,0)"
    );


    ctx.fillStyle = fire;


    ctx.beginPath();

    ctx.arc(
        this.x,
        this.y,
        r * 1.8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =====================
    // 岩
    // =====================

    ctx.save();


    ctx.translate(
        this.x,
        this.y
    );


    ctx.rotate(
        this.rotation
    );


    const points = 10;


    ctx.beginPath();


    for(
        let i=0;
        i<points;
        i++
    ){

        const angle =
            Math.PI * 2 *
            i /
            points;


        const offset =
            r *
            (
                0.85 +
                Math.random() * 0.15
            );


        const px =
            Math.cos(angle) *
            offset;


        const py =
            Math.sin(angle) *
            offset;


        if(i === 0){

            ctx.moveTo(
                px,
                py
            );

        }
        else{

            ctx.lineTo(
                px,
                py
            );

        }

    }


    ctx.closePath();


    // =====================
    // 通常隕石と同じ色
    // type 0
    // =====================

    const rock =
        ctx.createRadialGradient(

            -r * 0.3,
            -r * 0.4,
            5,

            0,
            0,
            r

        );


    rock.addColorStop(
        0,
        "#777"
    );


    rock.addColorStop(
        0.5,
        "#333"
    );


    rock.addColorStop(
        1,
        "#080808"
    );


    if(this.damageFlash > 0){

        ctx.fillStyle =
            "white";

    }
    else{

        ctx.fillStyle =
            rock;

    }


    ctx.fill();


    // =====================
    // 溶岩
    // =====================

    ctx.fillStyle =
        "rgba(255,80,20,0.8)";


    ctx.beginPath();

    ctx.arc(
        r * 0.2,
        -r * 0.2,
        r * 0.15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();


    // =====================
    // HPバー
    // =====================

    if(this.hp < this.maxHp){

        const barWidth = 50;

        const barHeight = 6;


        const hpRate =
            this.hp /
            this.maxHp;


        ctx.fillStyle =
            "rgba(0,0,0,0.7)";


        ctx.fillRect(

            this.x -
            barWidth / 2,

            this.y -
            this.radius -
            12,

            barWidth,

            barHeight

        );


        ctx.fillStyle =
            "#ff3333";


        ctx.fillRect(

            this.x -
            barWidth / 2,

            this.y -
            this.radius -
            12,

            barWidth * hpRate,

            barHeight

        );

    }

}

}
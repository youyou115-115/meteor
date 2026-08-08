/*
    Meteor
    plane.js
*/


class Plane{


constructor(side){

    this.greenAttack=false;

    this.destroying=false;
this.destroyTimer=0;
this.vy=0;



    this.side = side;


    // 初期位置

   if(side==="left"){

    this.x = 100;
    this.y = 580;

}
else if(side==="right"){

    this.x = 700;
    this.y = 580;

}
else if(side==="green"){

    this.x = 400;
    this.y = 650;

}
  // 追加
    this.destroying=false;
    this.destroyTimer=0;
    this.vy=0;


    this.baseY = this.y;


    this.time = Math.random()*10;


    if(WaveBonus.current==="yellow"){

    this.cooldown=10;

}
else{

    this.cooldown=15;

}


    this.active = true;

    this.angle = 0;

if(side==="left"){

    this.angle = -0.45; // 左から右上へ

}
else{

    this.angle = Math.PI + 0.45; // 右から左上へ

}

const target = this.getTarget();

if(target){

    const dx =
    target.x - this.x;

    const dy =
    target.y - this.y;

    this.angle =
    Math.atan2(
        dy,
        dx
    );

}


}


destroy(){


    if(this.destroying){
        return;
    }


    this.destroying=true;

    this.destroyTimer=60;

    this.vx = Math.random()*6-3;
this.vy = -5;


    this.active=false;

     Sound.planeCrash();


}

getTarget(){

    // =====================
    // BOSS戦
    // =====================

    if(
        Game.bossWave &&
        Game.bossPhase === "BATTLE"
    ){

        // 生きている召喚隕石を探す
        if(
            Game.bossMeteors &&
            Game.bossMeteors.length > 0
        ){

            const targets =
                Game.bossMeteors.filter(
                    meteor =>
                        meteor &&
                        meteor.active
                );

            if(targets.length > 0){

                // 一番近い隕石を狙う
                let target = targets[0];

                let minDist = Infinity;

                for(const meteor of targets){

                    const dx =
                        meteor.x - this.x;

                    const dy =
                        meteor.y - this.y;

                    const dist =
                        dx * dx +
                        dy * dy;

                    if(dist < minDist){

                        minDist = dist;

                        target = meteor;

                    }

                }

                return target;

            }

        }


        // 召喚隕石がいなければ月
        if(
            Game.boss &&
            Game.boss.active
        ){

            return Game.boss;

        }

    }


    // =====================
    // 通常WAVE
    // =====================

    return Game.meteor;

}




update(){

// =====================
// GREEN BONUS 突撃
// =====================

if(this.greenAttack){

    let target = null;


    // =====================
    // BOSS戦
    // =====================

    if(
        Game.bossWave &&
        Game.bossMeteors &&
        Game.bossMeteors.length > 0
    ){

        const targets =
            Game.bossMeteors.filter(
                meteor =>
                    meteor &&
                    meteor.active
            );


        if(targets.length > 0){

            // 一番近い召喚隕石を狙う

            target = targets[0];

            let minDist = Infinity;


            for(const meteor of targets){

                const dx =
                    meteor.x - this.x;

                const dy =
                    meteor.y - this.y;


                const dist =
                    dx * dx +
                    dy * dy;


                if(dist < minDist){

                    minDist = dist;

                    target = meteor;

                }

            }

        }

    }


    // =====================
    // 召喚隕石がなければ月
    // =====================

    if(
        !target &&
        Game.bossWave &&
        Game.boss &&
        Game.boss.active
    ){

        target = Game.boss;

    }


    // =====================
    // 通常ステージ
    // =====================

    if(
        !target &&
        Game.meteor &&
        Game.meteor.active
    ){

        target = Game.meteor;

    }


    // =====================
    // 攻撃対象なし
    // =====================

    if(!target){

        this.greenAttack = false;

        return;

    }


    // =====================
    // ターゲットへ向かう
    // =====================

    this.angle =
        Math.atan2(
            target.y - this.y,
            target.x - this.x
        );


    const dx =
        target.x - this.x;

    const dy =
        target.y - this.y;


    const dist =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    this.greenAttackSpeed =
        (this.greenAttackSpeed || 0) + 0.2;


    const speed =
        Math.min(
            this.greenAttackSpeed,
            10
        );


    if(dist > 0){

    this.x +=
        dx / dist *
        speed *
        Game.deltaTime;

    this.y +=
        dy / dist *
        speed *
        Game.deltaTime;

}


// =====================
// 命中
// =====================

if(
    dist <
    target.radius + 20
){

    this.greenAttack = false;

    this.destroy();


    // =====================
    // BOSS戦
    // =====================

    if(
        Game.bossWave &&
        Game.bossMeteors &&
        Game.bossMeteors.includes(target)
    ){

        target.damage(40);

    }


    // =====================
    // 月
    // =====================

    else if(
        Game.bossWave &&
        target === Game.boss
    ){

        target.damage(50);

    }


    // =====================
    // 通常隕石
    // =====================

    else{

        Game.meteor.greenHit = true;

    }

    return;

}


// ★これを追加
// 緑飛行機はここで終了
return;

}

    if(this.destroying){


    this.y += this.vy;

    this.vy += 0.15;


    this.x += 
    Math.random()*4-2;


    this.destroyTimer--;


    return;


}




    if(!this.active){
        return;
    }



    // ホバリング

    this.time += 0.05;


    this.y =
    this.baseY +
    Math.sin(this.time)*10;





// 攻撃間隔

this.cooldown -= Game.deltaTime;


if(this.cooldown <= 0){

    this.shoot();

   if(
    WaveBonus.current==="yellow" &&
    !WaveBonus.yellowUsed
){

    this.cooldown = 10;

    WaveBonus.yellowUsed=true;
    WaveBonus.current=null;
}
else{

    this.cooldown = 15;

}

}


}





shoot(){

    // =====================
    // 攻撃対象
    // =====================

    let target = null;


    // =====================
    // BOSS戦
    // =====================

    if(
        Game.bossWave &&
        Game.bossMeteors &&
        Game.bossMeteors.length > 0
    ){

        const targets =
            Game.bossMeteors.filter(
                meteor =>
                    meteor &&
                    meteor.active
            );


        if(targets.length > 0){

            // 一番近い召喚隕石を狙う

            target = targets[0];

            let minDist = Infinity;


            for(const meteor of targets){

                const dx =
                    meteor.x - this.x;

                const dy =
                    meteor.y - this.y;

                const dist =
                    dx * dx +
                    dy * dy;


                if(dist < minDist){

                    minDist = dist;

                    target = meteor;

                }

            }

        }

    }


    // =====================
    // BOSS戦
    // 召喚隕石がなければ月
    // =====================

    if(
        !target &&
        Game.bossWave &&
        Game.boss &&
        Game.boss.active
    ){

        target = Game.boss;

    }


    // =====================
    // 通常ステージ
    // =====================

    if(
        !target &&
        !Game.bossWave &&
        Game.meteor
    ){

        target = Game.meteor;

    }


    // =====================
    // 攻撃対象なし
    // =====================

    if(!target){

        return;

    }


    // =====================
    // 攻撃角度
    // =====================

    const dx =
        target.x - this.x;

    const dy =
        target.y - this.y;


    const angle =
        Math.atan2(
            dy,
            dx
        );


    // =====================
    // YELLOW ミサイル
    // =====================

    if(
        WaveBonus.yellowActive &&
        WaveBonus.yellowShots < 2 &&
        (this.side==="left" || this.side==="right")
    ){

        Game.bullets.push(
            new Bullet(
                this.x,
                this.y,
                angle,
                2,
                true
            )
        );


        Sound.missile();


        WaveBonus.yellowShots++;


        if(
            WaveBonus.yellowShots >= 2
        ){

            WaveBonus.yellowActive = false;

        }


        return;

    }


    // =====================
    // 通常弾
    // =====================

    let bulletSpeed = 1;

    let powerBullet = false;


    if(
        WaveBonus.yellowActive &&
        WaveBonus.yellowShots < 2
    ){

        bulletSpeed = 2;

        powerBullet = true;

        Sound.missile();

        WaveBonus.yellowShots++;


        if(
            WaveBonus.yellowShots >= 2
        ){

            WaveBonus.yellowActive = false;

        }

    }


    Game.bullets.push(
        new Bullet(
            this.x,
            this.y,
            angle,
            bulletSpeed,
            powerBullet
        )
    );

}





draw(ctx){

    ctx.save();


    ctx.translate(
        this.x,
        this.y
    );

    ctx.rotate(this.angle);

    if(this.side==="green"){

    ctx.shadowColor="#66ff66";
    ctx.shadowBlur=30;

}



    // =================
    // エンジン炎
    // =================

    const flame =
    ctx.createLinearGradient(
        -35,
        0,
        -60,
        0
    );


    flame.addColorStop(
        0,
        "orange"
    );

    flame.addColorStop(
        1,
        "rgba(255,0,0,0)"
    );


    ctx.fillStyle=flame;


    ctx.beginPath();

    ctx.moveTo(-25,0);
    ctx.lineTo(-60,-8);
    ctx.lineTo(-60,8);

    ctx.closePath();

    ctx.fill();



    // =================
    // 主翼
    // =================

    ctx.fillStyle="#444";


    ctx.beginPath();


    ctx.moveTo(-10,0);

    ctx.lineTo(-5,-22);

    ctx.lineTo(25,-8);

    ctx.lineTo(35,0);

    ctx.lineTo(25,8);

    ctx.lineTo(-5,22);


    ctx.closePath();


    ctx.fill();



    // =================
    // 機体
    // =================

    const body =
    ctx.createLinearGradient(
        0,
        -10,
        0,
        10
    );


    body.addColorStop(
        0,
        "#ddd"
    );


    body.addColorStop(
        0.5,
        "#777"
    );


    body.addColorStop(
        1,
        "#222"
    );


    ctx.fillStyle=body;


    ctx.beginPath();


    ctx.moveTo(-20,0);

    ctx.lineTo(20,-5);

    ctx.lineTo(45,0);

    ctx.lineTo(20,5);


    ctx.closePath();


    ctx.fill();



    // =================
    // コックピット
    // =================

    ctx.fillStyle="#0af";


    ctx.beginPath();

    ctx.ellipse(
        10,
        -2,
        8,
        4,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();



    // =================
    // 翼のライン
    // =================

    ctx.strokeStyle="#aaa";

    ctx.lineWidth=2;


    ctx.beginPath();

    ctx.moveTo(0,-12);

    ctx.lineTo(25,-5);

    ctx.moveTo(0,12);

    ctx.lineTo(25,5);

    ctx.stroke();



    ctx.restore();

}



}
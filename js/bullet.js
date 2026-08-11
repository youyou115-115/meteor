/*
    Meteor Ver0.1
    bullet.js
*/


class Bullet{


constructor(
    x,
    y,
    angle,
    speed=1,
    powerBullet=false,
){

    this.x=x;
    this.y=y;

    this.angle=angle;

    this.speed = 15 * speed;

    this.explosionDamage=false;
    this.explosionTarget = null;

    this.vx =
    Math.cos(angle)*this.speed;


    this.vy =
    Math.sin(angle)*this.speed;


    this.active=true;
    this.powerBullet = powerBullet;

    this.exploding = false;
this.explosionTimer = 0;
this.explosionRadius = 0;

}



update(){

    // =====================
    // 爆発中
    // =====================

   if(this.exploding){

    this.explosionRadius +=
        6 * Game.deltaTime;

    this.explosionTimer -=
        Game.deltaTime;


    // =====================
    // 爆発開始時だけダメージ
    // =====================

    if(
        this.explosionTimer > 19 &&
        !this.explosionDamage
    ){

        // =====================
        // 召喚隕石
        // 現在HPの50%
        // =====================

        if(
            this.explosionTarget &&
            this.explosionTarget.active
        ){

            const damage =
                Math.floor(
                    this.explosionTarget.hp * 0.25
                );

            this.explosionTarget.damage(damage);

        }

        // =====================
        // 月
        // CHANCE時のみ25%
        // =====================

        else if(
            Game.bossWave &&
            Game.boss &&
            Game.boss.active &&
            Game.boss.attackState === "CHANCE"
        ){

            const damage =
                Math.floor(
                    Game.boss.hp * 0.15
                );

            Game.boss.damage(damage);

        }

        // =====================
        // 通常戦
        // =====================

        else if(!Game.bossWave){

            const damage =
                Math.floor(
                    Game.meteor.hp * 0.25
                );

            Game.meteor.damage(damage);

        }


        Sound.explosion();

        Camera.hitShake(12);

        this.explosionDamage = true;

    }


    if(this.explosionTimer <= 0){

        this.active = false;

    }

    return;

}


    // =====================
    // 移動
    // =====================

    this.x +=
        this.vx *
        Game.deltaTime;

    this.y +=
        this.vy *
        Game.deltaTime;


    // =====================================================
    // BOSS戦
    // =====================================================

    if(Game.bossWave){

        // =====================
        // ボス隕石
        // =====================

        for(let meteor of Game.bossMeteors){

            if(!meteor.active){

                continue;

            }


            const dx =
                this.x - meteor.x;

            const dy =
                this.y - meteor.y;


            const d =
                Math.sqrt(
                    dx*dx +
                    dy*dy
                );


            if(d < meteor.radius){

    if(this.powerBullet){

        this.exploding = true;

        this.explosionTimer = 20;

        this.explosionRadius = 0;

        this.explosionDamage = false;

        this.explosionTarget = meteor;

        this.vx = 0;
        this.vy = 0;

    }
    else{

        meteor.damage(5);

        Sound.planeShot();

        this.active = false;

    }

    return;

}

        }



// =====================
// 月本体
// 第1形態 CHANCE
// 第2形態 SECOND
// =====================

if(
    Game.boss &&
    Game.boss.active &&
    (
        Game.boss.attackState === "CHANCE" ||
        Game.boss.phase === 2
    )
){

    const dx =
        this.x - Game.boss.x;

    const dy =
        this.y - Game.boss.y;

    const d =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if(d < Game.boss.radius){

        if(this.powerBullet){

            this.exploding = true;

            this.explosionTimer = 20;

            this.explosionRadius = 0;

            this.explosionDamage = false;

            this.explosionTarget = null;

            this.vx = 0;
            this.vy = 0;

        }
        else{

            Game.boss.damage(5);

            Sound.planeShot();

            this.active = false;

        }

        return;

    }

}




        return;

    }


    // =====================================================
    // 通常戦
    // =====================================================

    const dx =
        this.x - Game.meteor.x;


    const dy =
        this.y - Game.meteor.y;


    const d =
        Math.sqrt(
            dx*dx +
            dy*dy
        );


    if(d < Game.meteor.radius){

        if(this.powerBullet){

            this.exploding = true;

            this.explosionTimer = 20;

            this.explosionRadius = 0;

            this.explosionDamage = false;


            this.vx = 0;

            this.vy = 0;

        }
        else{

            Game.meteor.damage(5);

            Sound.planeShot();

            this.active = false;

        }

    }

}



draw(ctx){


    if(this.exploding){

    // 外側
    ctx.fillStyle="rgba(255,80,0,0.3)";
    ctx.beginPath();
    ctx.arc(
        this.x,
        this.y,
        this.explosionRadius,
        0,
        Math.PI*2
    );
    ctx.fill();

    // 中
    ctx.fillStyle="rgba(255,180,0,0.6)";
    ctx.beginPath();
    ctx.arc(
        this.x,
        this.y,
        this.explosionRadius*0.7,
        0,
        Math.PI*2
    );
    ctx.fill();

    // 中心
    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.arc(
        this.x,
        this.y,
        this.explosionRadius*0.3,
        0,
        Math.PI*2
    );
    ctx.fill();

    return;

}

if(this.powerBullet){

    // ミサイル本体
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // 炎
    ctx.fillStyle="orange";
    ctx.beginPath();
    ctx.moveTo(-14,0);
    ctx.lineTo(-24,-4);
    ctx.lineTo(-24,4);
    ctx.closePath();
    ctx.fill();

    // 本体
    ctx.fillStyle="#dddddd";
    ctx.fillRect(-12,-3,18,6);

    // 先端
    ctx.fillStyle="red";
    ctx.beginPath();
    ctx.moveTo(8,0);
    ctx.lineTo(2,-4);
    ctx.lineTo(2,4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

}
else{

    ctx.fillStyle="#ffff66";

    ctx.fillRect(
        this.x,
        this.y-2,
        12,
        4
    );

}

}



}
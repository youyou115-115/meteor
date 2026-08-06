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

const dx =
Game.meteor.x - this.x;


const dy =
Game.meteor.y - this.y;


this.angle =
Math.atan2(
    dy,
    dx
);


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




update(){

    // GREEN BONUS 突撃

if(this.greenAttack){

    this.angle =
    Math.atan2(
        Game.meteor.y-this.y,
        Game.meteor.x-this.x
    );


    const dx =
    Game.meteor.x - this.x;


    const dy =
    Game.meteor.y - this.y;


    const dist =
    Math.sqrt(
        dx*dx+dy*dy
    );


    this.greenAttackSpeed =
(this.greenAttackSpeed || 0) + 0.2;

const speed =
Math.min(
    this.greenAttackSpeed,
    10
);


    this.x +=
    dx/dist *
    speed *
    Game.deltaTime;


    this.y +=
    dy/dist *
    speed *
    Game.deltaTime;


    if(
    dist <
    Game.meteor.radius + 20
    ){

        this.greenAttack=false;

        this.destroy();

        Game.meteor.greenHit=true;

    }


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
    // YELLOW ミサイル
    // =====================

    if(
        WaveBonus.yellowActive &&
        WaveBonus.yellowShots < 2 &&
        (this.side==="left" || this.side==="right")
    ){


        const dx =
        Game.meteor.x - this.x;

        const dy =
        Game.meteor.y - this.y;


        const angle =
        Math.atan2(dy,dx);



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


        if(WaveBonus.yellowShots>=2){

            WaveBonus.yellowActive=false;

        }


        return;
    }


    // ↓ここから通常弾処理

    const dx =
    Game.meteor.x - this.x;

    const dy =
    Game.meteor.y - this.y;


    const angle =
    Math.atan2(
        dy,
        dx
    );


    let bulletSpeed=1;
let powerBullet=false;

if(
    WaveBonus.yellowActive &&
    WaveBonus.yellowShots < 2
){

    bulletSpeed=2;
    powerBullet=true;
    Sound.missile();
    WaveBonus.yellowShots++;

    if(WaveBonus.yellowShots>=2){

    WaveBonus.yellowActive=false;

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
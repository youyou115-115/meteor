/*
    Meteor Ver0.2
    coin.js
*/


class Coin{


    constructor(){

        this.reset();

    }



    reset(){

        this.rotation = 0;
        this.rotationSpeed = 0;
        this.flip = 0;


        this.x = 400;

        this.y = 620;


        this.radius = 18;

        this.scale = 1;
        this.vx = 0;

        this.vy = 0;


        this.active = false;

        this.displayOnly = false;


    }



  throw(){

      // ルーレット非表示
    Roulette.visible=false;


    this.active = true;


    // 現在位置

    const startX = this.x;
    const startY = this.y;



    // 隕石位置

    const targetX =
    Game.meteor.x;


    const targetY =
    Game.meteor.y;



    // 方向計算

    const dx =
    targetX - startX;


    const dy =
    targetY - startY;



    const distance =
    Math.sqrt(
        dx*dx + dy*dy
    );



    // 飛行速度

    const speed = 18;



    this.vx =
    dx / distance * speed;



    this.vy =
    dy / distance * speed;



    // 回転

    this.rotationSpeed =
    0.25 + Math.random()*0.2;



    this.flip =
    Math.random()*Math.PI*2;



    // 倍率保存

    this.power =
    Game.power;


}



    update(){
        if(this.displayOnly){

        return;

    }

        this.rotation += this.rotationSpeed;


    if(!this.active){
        return;
    }


    this.x += this.vx;

    this.y += this.vy;


    this.vy += 0.2;



    // 隕石との距離

    const dx =
    this.x - Game.meteor.x;


    const dy =
    this.y - Game.meteor.y;


    const distance =
    Math.sqrt(
        dx*dx + dy*dy
    );



    if(
        distance < Game.meteor.radius
    ){


    let damage = 10;


if(Game.bonus){

    damage = 20 * this.power;

    Game.bonus = false;

}



Game.meteor.damage(damage);


        this.reset();

        Game.state="GAME";


    }

   




    if(this.y < -50){

    this.reset();

    Game.bonus = false;

    Game.power = 1;

    Game.state="GAME";

}



}



   draw(ctx){


    ctx.save();


    ctx.translate(
    this.x,
    this.y
);


// 横回転の計算

const scaleX =
Math.abs(
    Math.cos(this.rotation)
);


// 3D横回転 + サイズ変更

ctx.scale(
    scaleX * this.scale,
    this.scale
);


    // 厚み

    ctx.fillStyle="#8b5a00";


    ctx.beginPath();

    ctx.ellipse(
        0,
        5,
        this.radius,
        this.radius*0.85,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();



    // 表面

    const gold =
    ctx.createRadialGradient(
        -6,
        -6,
        2,
        0,
        0,
        this.radius
    );


    gold.addColorStop(
        0,
        "#fff4a0"
    );

    gold.addColorStop(
        0.4,
        "#ffd700"
    );

    gold.addColorStop(
        1,
        "#b88600"
    );


    ctx.fillStyle=gold;


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        this.radius,
        0,
        Math.PI*2
    );

    ctx.fill();



    // 縁

    ctx.strokeStyle="#fff0a0";

    ctx.lineWidth=2;

    ctx.stroke();



    // 中央模様

    ctx.fillStyle=
    "rgba(180,120,0,0.8)";


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        this.radius*0.35,
        0,
        Math.PI*2
    );

    ctx.fill();



    ctx.restore();

    


}


}
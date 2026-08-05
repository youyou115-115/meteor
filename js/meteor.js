/*
    Meteor Ver0.4
    meteor.js
*/


class Meteor{


constructor(){

    this.reset();

}



reset(){

    this.x = 400;
    this.y = 150;
    this.z = 1000;

    switch(Game.wave){

        case 1:
            this.maxHp = 100;
            this.speed = 5;
            this.type = 0;
            break;

        case 2:
            this.maxHp = 200;
            this.speed = 5.3;
            this.type = 1;
            break;

        default:
            this.maxHp = 100 + (Game.wave-1)*120;
            this.speed = 5 + Game.wave*0.2;
            this.type = 1;
            break;
    }

    this.hp = this.maxHp;

    this.radius = 20;
    this.damageFlash = 0;

    this.destroying = false;
    this.destroyPhase = 0;
    this.destroyTimer = 0;

    this.debris = [];
}



update(){



    // =====================
    // 破壊演出
    // =====================


    if(this.destroying){



        this.destroyTimer -= Game.deltaTime;



        // -----------------
        // ヒビ
        // -----------------

        if(this.destroyPhase === 1){



            if(this.destroyTimer <= 0){


                this.destroyPhase = 2;

                this.destroyTimer = 15;


            }


        }



        // -----------------
        // 中心爆発
        // -----------------

        else if(this.destroyPhase === 2){



            this.radius =
Math.min(
    this.radius * 1.02,
    250
);



            if(this.destroyTimer <= 0){



                this.createDebris();



                this.destroyPhase = 3;


                this.destroyTimer = 90;



            }


        }




        // -----------------
        // 破片落下
        // -----------------

        else if(this.destroyPhase === 3){



            for(let d of this.debris){


                d.update();


            }



            if(this.destroyTimer <= 0){


    Game.wave++;

Game.waveMessage =
"WAVE " + Game.wave;

Game.waveTimer = 90;

this.reset();

    this.x = 400;
    this.y = 150;
    this.z = 1000;
    this.hp = this.maxHp;

}


        }



        return;


    }







    // スロット中停止

    if(Roulette.active){

        return;

    }




    if(this.damageFlash > 0){

        this.damageFlash--;

    }




    this.z -= this.speed * Game.deltaTime;


if(this.z < 10){

    this.z = 10;

}


this.radius =
Math.min(
    20000 / this.z,
    250
);





    if(
    this.z < 50 &&
    Game.state !== "GAMEOVER"
){

    Game.state="GAMEOVER";

    Game.impactFlash = 30;

    Camera.hitShake(30);

}



}







damage(value){



    this.hp -= value;


    this.damageFlash = 5;




    if(this.hp <= 0 && !this.destroying){

    this.hp = 0;

    this.destroying=true;

    this.destroyPhase=1;

    this.destroyTimer=30;

}



}







createDebris(){



    this.debris=[];



    for(let i=0;i<20;i++){



        this.debris.push(

            new Debris(

                this.x,

                this.y

            )

        );


    }


}







draw(ctx){

       if(
        !Number.isFinite(this.radius) ||
        this.radius <= 0
    ){

        console.log(
            "radius error",
            this.radius,
            "z:",
            this.z
        );


        this.reset();

        return;

    }



    // =====================
    // 破片
    // =====================


    for(let d of this.debris){


        d.draw(ctx);


    }







    // 破片中は本体を少し残す

    if(
        this.destroying &&
        this.destroyPhase===3
    ){

        return;

    }







    // =====================
    // 炎
    // =====================



    const fire =
    ctx.createRadialGradient(

        this.x,

        this.y,

        this.radius*0.7,

        this.x,

        this.y,

        this.radius*1.8

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



    ctx.fillStyle=fire;



    ctx.beginPath();


    ctx.arc(

        this.x,

        this.y,

        this.radius*1.8,

        0,

        Math.PI*2

    );


    ctx.fill();







    // =====================
    // 岩
    // =====================



    ctx.beginPath();



    const r=this.radius;


    for(let i=0;i<10;i++){



        const angle =
        Math.PI*2*i/10;



        const offset =
        r*(0.85+Math.random()*0.15);



        const px =
        this.x+
        Math.cos(angle)*offset;



        const py =
        this.y+
        Math.sin(angle)*offset;



        if(i===0)

            ctx.moveTo(px,py);

        else

            ctx.lineTo(px,py);


    }



    ctx.closePath();





    const rock =
    ctx.createRadialGradient(

        this.x-r*0.3,

        this.y-r*0.4,

        5,

        this.x,

        this.y,

        r

    );



   if(this.type===0){

    rock.addColorStop(0,"#777");
    rock.addColorStop(0.5,"#333");
    rock.addColorStop(1,"#080808");

}
else{

    rock.addColorStop(0,"#ff8888");
    rock.addColorStop(0.5,"#aa2222");
    rock.addColorStop(1,"#330000");

}




    if(this.destroying){

    if(this.destroyPhase === 1){

        ctx.fillStyle="white";

    }
    else if(this.destroyPhase === 2){

        ctx.fillStyle =
        "rgba(255,255,255,0.8)";

    }
    else{

        ctx.fillStyle=rock;

    }

}
else if(this.damageFlash>0){

    ctx.fillStyle="white";

}
else{

    ctx.fillStyle=rock;

}




    ctx.fill();







    // =====================
    // 溶岩
    // =====================


    ctx.fillStyle=
    "rgba(255,80,20,0.8)";



    ctx.beginPath();


    ctx.arc(

        this.x+r*0.2,

        this.y-r*0.2,

        r*0.15,

        0,

        Math.PI*2

    );


    ctx.fill();

    // =====================
// HPバー
// =====================

if(!this.destroying){


    const barWidth = 120;

    const barHeight = 12;


    const hpRate =
this.hp / this.maxHp;



    // 背景

    ctx.fillStyle =
    "rgba(0,0,0,0.7)";


    ctx.fillRect(

        this.x - barWidth/2,

        this.y - this.radius - 30,

        barWidth,

        barHeight

    );




    // HP

    ctx.fillStyle="red";


    ctx.fillRect(

        this.x - barWidth/2,

        this.y - this.radius - 30,

        barWidth * hpRate,

        barHeight

    );




    // 枠

    ctx.strokeStyle="white";


    ctx.strokeRect(

        this.x - barWidth/2,

        this.y - this.radius - 30,

        barWidth,

        barHeight

    );


}




}



}
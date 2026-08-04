/*
    Meteor Ver0.2
    renderer.js
*/


const Renderer={


draw(){


    const ctx = Game.ctx;


    ctx.clearRect(
        0,
        0,
        800,
        700
    );



    // 背景

    ctx.fillStyle="#02020a";

    ctx.fillRect(
        0,
        0,
        800,
        700
    );



    // カメラ

    ctx.save();


    ctx.translate(
        Camera.getX(),
        Camera.getY()
    );



    // 危険演出

    if(Game.danger > 0){


        ctx.fillStyle =
        "rgba(255,0,0,0.1)";


        ctx.fillRect(
            0,
            0,
            800,
            700
        );


    }



    // 隕石

    Game.meteor.draw(ctx);



    // コイン

    Game.coin.draw(ctx);

    // ルーレット

Roulette.draw(ctx);





    ctx.restore();


if(Roulette.stopTimer > 0){


    ctx.fillStyle="white";


    ctx.font="60px sans-serif";


    ctx.textAlign="center";


    ctx.fillText(

        "POWER ×"+Roulette.result,

        400,

        120

    );


}

// 残機コイン

for(let coin of Game.coins){

    coin.draw(ctx);

}



    if(Game.state === "GAMEOVER"){

        if(Game.impactFlash > 0){


    ctx.fillStyle =
    "rgba(255,255,255,"+
    (Game.impactFlash / 30)+
    ")";


    ctx.fillRect(
        0,
        0,
        800,
        700
    );


}


    // 暗転

    ctx.fillStyle =
    "rgba(0,0,0,0.75)";


    ctx.fillRect(
        0,
        0,
        800,
        700
    );



    ctx.fillStyle="red";


    ctx.font="80px sans-serif";


    ctx.textAlign="center";


    ctx.fillText(
        "GAME OVER",
        400,
        320
    );



    ctx.fillStyle="white";


    ctx.font="30px sans-serif";


    ctx.fillText(
        "METEOR IMPACT",
        400,
        390
    );


}


}


};
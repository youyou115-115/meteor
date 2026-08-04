/*
    Meteor Ver0.5
    main.js
*/


Game.init();



const canvas =
document.getElementById("gameCanvas");

function resizeCanvas(){


    const canvas =
    document.getElementById("gameCanvas");


    const gameWidth = 800;
    const gameHeight = 700;


    const screenWidth =
    window.innerWidth;


    const screenHeight =
    window.innerHeight;



    const scaleX =
    screenWidth / gameWidth;


    const scaleY =
    screenHeight / gameHeight;



    // 小さい方を採用して比率維持

    const scale =
    Math.min(
        scaleX,
        scaleY
    );



    canvas.style.width =
    (gameWidth * scale) + "px";


    canvas.style.height =
    (gameHeight * scale) + "px";


}


window.addEventListener(
"resize",
resizeCanvas
);


resizeCanvas();





function rouletteInput(){



    // =====================
    // 操作禁止状態
    // =====================


    // コイン飛行中

    if(Game.coin.active){

        return;

    }



    // 結果表示中

    if(Roulette.stopTimer > 0){

        return;

    }

     // 隕石破壊演出中

    if(Game.meteor.destroying){

        return;

    }



    // コインなし

    if(Game.coinCount <= 0){

        return;

    }

    




    // =====================
    // スロット操作
    // =====================



    if(Roulette.active){


        Roulette.stop();


        return;

    }




    Roulette.start();



}





canvas.addEventListener(

"click",

()=>{


    rouletteInput();


}

);






canvas.addEventListener(

"touchstart",

(e)=>{


    e.preventDefault();


    rouletteInput();


},

{
    passive:false
}

);






function loop(time){



    if(Game.lastTime === 0){

        Game.lastTime = time;

    }



    Game.deltaTime =
    (time - Game.lastTime) / 16.666;



    Game.lastTime = time;



    // 異常値防止

    if(Game.deltaTime > 3){

        Game.deltaTime = 3;

    }



    Game.update();


    Renderer.draw();



    requestAnimationFrame(loop);


}


loop();
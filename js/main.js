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





function rouletteInput(event){


    // =====================
    // WAVE BONUS説明解除
    // =====================

   if(Game.showBonusHelp){

    Game.showBonusHelp=false;

    WaveBonusUI.active=false;
    WaveBonusUI.timer=0;

    WaveBonus.timer=0;

    return;

}

    // 以下そのまま

       // =====================
    // GAMEOVER → TITLE
    // =====================

    if(Game.state === "GAMEOVER"){


    Game.toTitle();


    return;


}


    // =====================
    // TITLE → START
    // =====================

    if(Game.state === "TITLE"){

        Game.start();

        return;

    }



    // =====================
    // 操作禁止状態
    // =====================


    // コイン飛行中

    if(Game.coin.active){

        return;

    }




     /// =====================
// 隕石破壊演出中
// =====================

if(
    !Game.bossWave &&
    Game.meteor.destroying
){

    return;

}




// ルーレット結果表示中は入力禁止
if(Roulette.resultTimer > 0){

    return;

}




    // =====================
    // スロット操作
    // =====================


// =====================
// BOSS WARNING中
// =====================
// WARNING中は完全に操作禁止

if(
    Game.bossWave &&
    Game.bossPhase === "WARNING"
){

    return;

}


// =====================
// ルーレット操作中
// =====================

if(Roulette.active){

    Roulette.stop();

    return;

}


// =====================
// BOSS BATTLE
// =====================

if(
    Game.bossWave &&
    Game.bossPhase === "BATTLE"
){

    Roulette.start();

    return;

}


// =====================
// 通常WAVE
// =====================

Roulette.start();

}





canvas.addEventListener(
"click",
(e)=>{

    rouletteInput(e);

}
);






canvas.addEventListener(
"touchstart",
(e)=>{

    e.preventDefault();

    rouletteInput(e);

},
{
    passive:false
});






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
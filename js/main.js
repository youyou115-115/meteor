/*
    Meteor Ver0.5
    main.js
*/


Game.init();



const canvas =
document.getElementById("gameCanvas");





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






function loop(){


    Game.update();


    Renderer.draw();



    requestAnimationFrame(loop);


}



loop();
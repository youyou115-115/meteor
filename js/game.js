/*
    Meteor Ver0.3
    game.js
*/


const Game={


canvas:null,

ctx:null,


meteor:null,

coin:null,

isMobile:false,


roulette:Roulette,


danger:0,

lastTime:0,

deltaTime:1,





// 残機コイン配列
coins:[],


// 状態管理
state:"TITLE",

impactFlash:0,


// 現在倍率
power:1,





init(){

    this.isMobile =
window.innerWidth < 700;



    this.canvas =
    document.getElementById("gameCanvas");



    this.canvas.width = 800;

    this.canvas.height = 700;



    this.ctx =
    this.canvas.getContext("2d");





    // =====================
    // 隕石生成
    // =====================

    this.meteor =
    new Meteor();





    // =====================
    // 攻撃用コイン
    // =====================

    this.coin =
    new Coin();





    // =====================
    // 残機コイン作成
    // =====================

    this.coins=[];



    for(let i=0;i<3;i++){



        const coin =
        new Coin();




        // 左下配置

        coin.x =
        50 + i * 35;


        coin.y =
        650;




        // 小型表示

        coin.scale =
        0.6;




        // 回転停止

        coin.rotationSpeed =
        0;




        // 表示専用

        coin.displayOnly =
        true;




        this.coins.push(
            coin
        );



    }

    this.state = "TITLE";

    if(Game.state === "GAMEOVER"){


    Game.state="TITLE";


    return;

}



},

start(){


    this.state="GAME";


    this.meteor.reset();


    this.coin.reset();


    Roulette.active=false;

    Roulette.stopTimer=0;


    Camera.shake=0;


    this.impactFlash=0;


    this.coinCount=3;


    this.coins=[];


    for(let i=0;i<3;i++){


        const coin = new Coin();


        coin.x=50+i*35;

        coin.y=650;

        coin.scale=0.6;

        coin.rotationSpeed=0;

        coin.displayOnly=true;


        this.coins.push(coin);


    }


},







update(){


    if(this.impactFlash > 0){

        this.impactFlash--;

    }



    // =====================
    // タイトル
    // =====================

    if(this.state === "TITLE"){


        Camera.update();

        return;

    }





    // =====================
    // ゲームオーバー
    // =====================

    if(this.state === "GAMEOVER"){


        Camera.update();

        return;

    }





    // =====================
    // ゲーム中
    // =====================


    this.meteor.update();


    this.coin.update();


    Roulette.update();


    Camera.update();



},
toTitle(){


    this.state="TITLE";


    this.meteor.reset();


    this.coin.reset();


    Roulette.active=false;

    Roulette.stopTimer=0;


    this.coinCount=3;


    this.power=1;


    this.impactFlash=0;


    Camera.shake=0;



    this.coins=[];


    for(let i=0;i<3;i++){


        const coin =
        new Coin();


        coin.x =
        50+i*35;


        coin.y=650;


        coin.scale=0.6;


        coin.rotationSpeed=0;


        coin.displayOnly=true;


        this.coins.push(
            coin
        );


    }


}




};
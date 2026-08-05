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

//=====================
// WAVE表示
//=====================

if(
    Game.state === "GAME" &&
    Game.waveTimer <= 0
){

    ctx.fillStyle = "white";
    ctx.font = "30px sans-serif";
    ctx.textAlign = "left";

    ctx.fillText(
        "WAVE " + Game.wave,
        20,
        40
    );

}


if(Game.state !== "TITLE"){

        // 飛行機

    for(let p of Game.planes){

        p.draw(ctx);

    }


    // 弾

    for(let b of Game.bullets){

        b.draw(ctx);

    }

    // 隕石

    Game.meteor.draw(ctx);


    // コイン

    Game.coin.draw(ctx);


    // ルーレット

    Roulette.draw(ctx);

}





    ctx.restore();



 if(Game.state === "GAMEOVER"){



// =====================
// 画面ひび割れ
// =====================

if(Game.screenCrack > 0){


ctx.save();


ctx.strokeStyle =
"rgba(255,255,255,0.9)";


ctx.lineWidth = 2;



ctx.beginPath();



for(let c of Game.cracks){


    let x=400;
    let y=350;


    const ex =
    x + Math.cos(c.angle)*c.length;


    const ey =
    y + Math.sin(c.angle)*c.length;



    ctx.moveTo(x,y);


    ctx.lineTo(
        ex,
        ey
    );



    // 枝

    if(c.branch > 0.4){


        const bx =
        x + Math.cos(c.angle+0.5)
        * c.length*0.6;


        const by =
        y + Math.sin(c.angle+0.5)
        * c.length*0.6;


        ctx.moveTo(
            ex*0.7+x*0.3,
            ey*0.7+y*0.3
        );


        ctx.lineTo(
            bx,
            by
        );

    }



}



ctx.stroke();



ctx.restore();


}




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

// =====================
// TITLE SCREEN
// =====================

if(Game.state === "TITLE"){



    // 背景

    ctx.fillStyle="#02020a";

    ctx.fillRect(
        0,
        0,
        800,
        700
    );




    // =====================
    // 星
    // =====================


    for(let i=0;i<80;i++){


        const x =
        (i * 97) % 800;


        const y =
        (i * 53) % 700;



        const size =
        1 + (i%3);



        ctx.fillStyle =
        "rgba(255,255,255,0.5)";


        ctx.fillRect(
            x,
            y,
            size,
            size
        );


    }






    // =====================
    // タイトル隕石
    // =====================



    const meteorX = 400;

const meteorY = 120;


    const fire =
ctx.createRadialGradient(
    meteorX,
    meteorY,
    20,
    meteorX,
    meteorY,
    100
);


    fire.addColorStop(
        0,
        "rgba(255,180,50,0.9)"
    );


    fire.addColorStop(
        0.5,
        "rgba(255,50,0,0.5)"
    );


    fire.addColorStop(
        1,
        "rgba(255,0,0,0)"
    );


    ctx.fillStyle=fire;


    ctx.beginPath();


    ctx.arc(
        meteorX,
        meteorY,
        100,
        0,
        Math.PI*2
    );


    ctx.fill();

    



  // =====================
// リアル隕石
// =====================


const r = 55;


ctx.save();


ctx.translate(
    meteorX,
    meteorY
);



// 不規則な岩形状

ctx.beginPath();


const points = 12;


for(let i=0;i<points;i++){


    const angle =
    Math.PI*2*i/points;


    const size =
    r*(0.85 + Math.random()*0.15);


    const x =
    Math.cos(angle)*size;


    const y =
    Math.sin(angle)*size;



    if(i===0){

        ctx.moveTo(x,y);

    }
    else{

        ctx.lineTo(x,y);

    }


}


ctx.closePath();



// 岩のグラデーション

const rock =
ctx.createRadialGradient(
    -20,
    -25,
    5,
    0,
    0,
    r
);


rock.addColorStop(
    0,
    "#999"
);


rock.addColorStop(
    0.4,
    "#555"
);


rock.addColorStop(
    1,
    "#111"
);


ctx.fillStyle=rock;

ctx.fill();




// クレーター

ctx.fillStyle=
"rgba(0,0,0,0.45)";


ctx.beginPath();

ctx.arc(
    -20,
    -15,
    13,
    0,
    Math.PI*2
);

ctx.fill();



ctx.beginPath();

ctx.arc(
    18,
    5,
    9,
    0,
    Math.PI*2
);

ctx.fill();



ctx.beginPath();

ctx.arc(
    -5,
    25,
    7,
    0,
    Math.PI*2
);

ctx.fill();








ctx.restore();





    // =====================
    // METEOR文字
    // =====================



    const glow =
    Math.sin(
        Date.now()/300
    )*15+30;



    ctx.shadowColor =
    "orange";


    ctx.shadowBlur =
    glow;



    ctx.fillStyle="#ffffff";


    ctx.font=
    "90px sans-serif";


    ctx.textAlign="center";


    ctx.fillText(
        "METEOR",
        400,
        300
    );



    ctx.shadowBlur=0;







    // サブタイトル


    ctx.fillStyle=
    "#ff9900";


    ctx.font=
    "24px sans-serif";


    ctx.fillText(
        "DEFEND THE EARTH",
        400,
        350
    );






    // =====================
    // START点滅
    // =====================


    const alpha =
    (Math.sin(
        Date.now()/300
    )+1)/2;



    ctx.fillStyle =
    `rgba(255,255,255,${alpha})`;



    ctx.font =
    "40px sans-serif";


    ctx.fillText(
        "TAP TO START",
        400,
        470
    );






    // 操作説明


    ctx.fillStyle=
    "rgba(255,255,255,0.6)";


    ctx.font=
    "20px sans-serif";


    ctx.fillText(
        "SLOT → THROW COIN → DESTROY METEOR",
        400,
        540
    );



}

if(Game.waveTimer > 0){

    const alpha =
    Math.min(
        1,
        Game.waveTimer / 20
    );

    ctx.save();

    ctx.globalAlpha = alpha;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 4;

    ctx.font = "80px sans-serif";
    ctx.textAlign = "center";

    ctx.strokeText(
        Game.waveMessage,
        400,
        350
    );

    ctx.fillText(
        Game.waveMessage,
        400,
        350
    );

    ctx.restore();

}


}


};
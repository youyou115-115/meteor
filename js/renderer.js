/*
    Meteor Ver0.2
    renderer.js
*/


const Renderer = {

draw(){

    const ctx = Game.ctx;


    ctx.clearRect(
        0,
        0,
        800,
        700
    );


    // =====================
    // 背景
    // =====================

    ctx.fillStyle = "#02020a";

    ctx.fillRect(
        0,
        0,
        800,
        700
    );


    // =====================
    // カメラ
    // =====================

    ctx.save();

    ctx.translate(
        Camera.getX(),
        Camera.getY()
    );


    // =====================
    // 危険演出
    // =====================

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


    // =====================
    // WAVE表示
    // =====================

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


    // =====================
    // ゲーム画面
    // =====================

    if(Game.state !== "TITLE"){


// =================================================
// 通常隕石
// =================================================

if(
    !Game.bossWave &&
    Game.meteor &&
    Game.state === "GAME"
){

    Game.meteor.draw(ctx);

}


        // =================================================
        // 飛行機
        // =================================================

        for(let p of Game.planes){

            p.draw(ctx);

        }


        // =================================================
        // 弾
        // =================================================

        for(let b of Game.bullets){

            b.draw(ctx);

        }


      
// =====================
// BOSS
// =====================

if(Game.bossWave){

    // 月
if(Game.boss){
    Game.boss.draw(ctx);
}

// 召喚隕石
for(let meteor of Game.bossMeteors){
    meteor.draw(ctx);
}

}




        // =================================================
        // コイン
        // =================================================

        Game.coin.draw(ctx);


        // =================================================
        // ルーレット
        // =================================================

        Roulette.draw(ctx);

    }


    // =====================
    // カメラ終了
    // =====================

    ctx.restore();


    // =====================================================
    // GAME OVER
    // =====================================================

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

                let x = 400;
                let y = 350;


                const ex =
                    x +
                    Math.cos(c.angle) *
                    c.length;


                const ey =
                    y +
                    Math.sin(c.angle) *
                    c.length;


                ctx.moveTo(
                    x,
                    y
                );


                ctx.lineTo(
                    ex,
                    ey
                );


                // 枝

                if(c.branch > 0.4){

                    const bx =
                        x +
                        Math.cos(
                            c.angle + 0.5
                        ) *
                        c.length *
                        0.6;


                    const by =
                        y +
                        Math.sin(
                            c.angle + 0.5
                        ) *
                        c.length *
                        0.6;


                    ctx.moveTo(
                        ex * 0.7 +
                        x * 0.3,

                        ey * 0.7 +
                        y * 0.3
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


        // =====================
        // インパクトフラッシュ
        // =====================

        if(Game.impactFlash > 0){

            ctx.fillStyle =
                "rgba(255,255,255," +
                (Game.impactFlash / 30) +
                ")";


            ctx.fillRect(
                0,
                0,
                800,
                700
            );

        }


        // =====================
        // 暗転
        // =====================

        ctx.fillStyle =
            "rgba(0,0,0,0.75)";


        ctx.fillRect(
            0,
            0,
            800,
            700
        );


        ctx.fillStyle = "red";

        ctx.font = "80px sans-serif";

        ctx.textAlign = "center";


        ctx.fillText(
            "GAME OVER",
            400,
            320
        );


        ctx.fillStyle = "white";

        ctx.font = "30px sans-serif";


        ctx.fillText(
            "METEOR IMPACT",
            400,
            390
        );

    }


    // =====================================================
    // TITLE SCREEN
    // =====================================================

    if(Game.state === "TITLE"){

        // 背景

        ctx.fillStyle = "#02020a";

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
                1 + (i % 3);


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


        ctx.fillStyle = fire;


        ctx.beginPath();

        ctx.arc(
            meteorX,
            meteorY,
            100,
            0,
            Math.PI * 2
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


        ctx.beginPath();


        const points = 12;


        for(let i=0;i<points;i++){

            const angle =
                Math.PI *
                2 *
                i /
                points;


            const size =
                r *
                (
                    0.85 +
                    Math.random() * 0.15
                );


            const x =
                Math.cos(angle) *
                size;


            const y =
                Math.sin(angle) *
                size;


            if(i === 0){

                ctx.moveTo(
                    x,
                    y
                );

            }
            else{

                ctx.lineTo(
                    x,
                    y
                );

            }

        }


        ctx.closePath();


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


        ctx.fillStyle = rock;

        ctx.fill();


        // クレーター

        ctx.fillStyle =
            "rgba(0,0,0,0.45)";


        ctx.beginPath();

        ctx.arc(
            -20,
            -15,
            13,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            18,
            5,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            -5,
            25,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();


        // =====================
        // METEOR文字
        // =====================

        const glow =
            Math.sin(
                Date.now() / 300
            ) *
            15 +
            30;


        ctx.shadowColor = "orange";

        ctx.shadowBlur = glow;


        ctx.fillStyle = "#ffffff";

        ctx.font = "90px sans-serif";

        ctx.textAlign = "center";


        ctx.fillText(
            "METEOR",
            400,
            300
        );


        ctx.shadowBlur = 0;


        // サブタイトル

        ctx.fillStyle = "#ff9900";

        ctx.font = "24px sans-serif";


        ctx.fillText(
            "DEFEND THE EARTH",
            400,
            350
        );


        // START

        const alpha =
            (
                Math.sin(
                    Date.now() / 300
                ) + 1
            ) / 2;


        ctx.fillStyle =
            `rgba(255,255,255,${alpha})`;


        ctx.font = "40px sans-serif";


        ctx.fillText(
            "TAP TO START",
            400,
            470
        );


        // 操作説明

        ctx.fillStyle =
            "rgba(255,255,255,0.6)";


        ctx.font = "20px sans-serif";


        ctx.fillText(
            "SLOT → THROW COIN → DESTROY METEOR",
            400,
            540
        );

    }


    // =====================================================
    // WAVE表示
    // =====================================================

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


    // =====================================================
    // ボーナス説明
    // =====================================================

    if(Game.showBonusHelp){

        WaveBonusUI.draw(ctx);

    }

    // =====================================================
// BOSS WARNING
// =====================================================

if(
    Game.bossWarningActive &&
    Game.bossPhase === "WARNING"
){

    ctx.save();


    // =====================
    // 画面を少し暗くする
    // =====================

    ctx.fillStyle =
        "rgba(0,0,0,0.55)";

    ctx.fillRect(
        0,
        0,
        800,
        700
    );


    // =====================
    // 赤い垂れ幕
    // =====================

    const curtainWidth =
        185 * Game.bossCurtain;


    // 左幕

    const leftGrad =
        ctx.createLinearGradient(
            0,
            0,
            curtainWidth,
            0
        );

    leftGrad.addColorStop(
        0,
        "#520000"
    );

    leftGrad.addColorStop(
        0.55,
        "#b00000"
    );

    leftGrad.addColorStop(
        1,
        "#ff2222"
    );


    ctx.fillStyle =
        leftGrad;

    ctx.fillRect(
        0,
        0,
        curtainWidth,
        700
    );


    // 左幕の影

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    for(let i=0;i<6;i++){

        ctx.fillRect(
            i * 32,
            0,
            12,
            700
        );

    }


    // 右幕

    const rightGrad =
        ctx.createLinearGradient(
            800 - curtainWidth,
            0,
            800,
            0
        );

    rightGrad.addColorStop(
        0,
        "#ff2222"
    );

    rightGrad.addColorStop(
        0.45,
        "#b00000"
    );

    rightGrad.addColorStop(
        1,
        "#520000"
    );


    ctx.fillStyle =
        rightGrad;

    ctx.fillRect(
        800 - curtainWidth,
        0,
        curtainWidth,
        700
    );


    // 右幕の影

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    for(let i=0;i<6;i++){

        ctx.fillRect(
            800 - i * 32 - 20,
            0,
            12,
            700
        );

    }


    // =====================
    // WARNING
    // =====================

    const warningTime =
        Game.bossWarningTimer;


    // 点滅
    const blink =
        Math.floor(
            warningTime / 8
        ) % 2;


    

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.font =
        "bold 82px sans-serif";


    ctx.shadowColor =
        "#ff0000";

    ctx.shadowBlur =
        35;


    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        "WARNING",
        400,
        280
    );


    // =====================
    // サブタイトル
    // =====================

    ctx.font =
        "bold 26px sans-serif";


    ctx.shadowColor =
        "#ff2222";

    ctx.shadowBlur =
        18;


    ctx.fillStyle =
        "#ff4444";


    ctx.fillText(
        "MOON DEVIL APPROACHING",
        400,
        350
    );


    // =====================
    // 赤い警告ライン
    // =====================

    ctx.shadowColor =
        "#ff0000";

    ctx.shadowBlur =
        15;

    ctx.fillStyle =
        "#ff2222";


    ctx.fillRect(
        220,
        395,
        360,
        4
    );


    ctx.restore();

}

// =====================================================
// GAME CLEAR
// =====================================================

if(Game.state === "CLEAR"){

    ctx.save();

    // =====================
    // 宇宙背景
    // =====================

    ctx.fillStyle = "#02020a";

    ctx.fillRect(
        0,
        0,
        800,
        700
    );


    // =====================
    // 星
    // =====================

    for(let i=0;i<100;i++){

        const x =
            (i * 137) % 800;

        const y =
            (i * 83) % 700;

        const twinkle =
            Math.sin(
                Game.clearAnimation * 0.08 +
                i
            );

        const size =
            1 +
            (i % 2) +
            Math.max(0,twinkle);

        ctx.fillStyle =
            "rgba(255,255,255,0.7)";

        ctx.fillRect(
            x,
            y,
            size,
            size
        );

    }


    // =====================
    // 地球
    // =====================

    const earthX = 400;
    const earthY = 390;

    const earthRadius = 115;


    // 大気

    const atmosphere =
        ctx.createRadialGradient(
            earthX,
            earthY,
            70,
            earthX,
            earthY,
            150
        );

    atmosphere.addColorStop(
        0,
        "rgba(40,120,255,0)"
    );

    atmosphere.addColorStop(
        0.75,
        "rgba(40,140,255,0.25)"
    );

    atmosphere.addColorStop(
        1,
        "rgba(0,100,255,0)"
    );

    ctx.fillStyle = atmosphere;

    ctx.beginPath();

    ctx.arc(
        earthX,
        earthY,
        150,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // 地球本体

    const earth =
        ctx.createRadialGradient(
            earthX - 35,
            earthY - 40,
            10,
            earthX,
            earthY,
            earthRadius
        );

    earth.addColorStop(
        0,
        "#4fa8ff"
    );

    earth.addColorStop(
        0.55,
        "#1261b5"
    );

    earth.addColorStop(
        1,
        "#03152d"
    );

    ctx.fillStyle = earth;

    ctx.beginPath();

    ctx.arc(
        earthX,
        earthY,
        earthRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =====================
    // 大陸
    // =====================

    ctx.fillStyle =
        "rgba(60,180,90,0.75)";

    ctx.beginPath();

    ctx.ellipse(
        350,
        350,
        45,
        22,
        -0.4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.ellipse(
        430,
        405,
        50,
        28,
        0.3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.ellipse(
        360,
        445,
        28,
        18,
        0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =====================
    // 援軍の軌道
    // =====================

    ctx.strokeStyle =
        "rgba(80,160,255,0.25)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.ellipse(
        earthX,
        earthY,
        220,
        100,
        -0.25,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    // =====================
    // 援軍
    // =====================

    const reinforcements = 6;

    for(let i=0;i<reinforcements;i++){

        const angle =
            Game.clearAnimation * 0.025 +
            i *
            Math.PI * 2 /
            reinforcements;


        const x =
            earthX +
            Math.cos(angle) *
            220;


        const y =
            earthY +
            Math.sin(angle) *
            100;


        ctx.save();

        ctx.translate(
            x,
            y
        );


        ctx.rotate(
            angle + Math.PI / 2
        );


        // エンジン光

        ctx.fillStyle =
            "rgba(255,180,60,0.8)";

        ctx.beginPath();

        ctx.moveTo(
            -4,
            15
        );

        ctx.lineTo(
            0,
            30 +
            Math.sin(
                Game.clearAnimation * 0.2
            ) * 5
        );

        ctx.lineTo(
            4,
            15
        );

        ctx.fill();


        // 機体

        ctx.fillStyle =
            "#d8e4f0";

        ctx.beginPath();

        ctx.moveTo(
            0,
            -15
        );

        ctx.lineTo(
            6,
            10
        );

        ctx.lineTo(
            0,
            7
        );

        ctx.lineTo(
            -6,
            10
        );

        ctx.closePath();

        ctx.fill();


        // 翼

        ctx.fillStyle =
            "#7890aa";

        ctx.beginPath();

        ctx.moveTo(
            -5,
            0
        );

        ctx.lineTo(
            -17,
            9
        );

        ctx.lineTo(
            -5,
            7
        );

        ctx.closePath();

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(
            5,
            0
        );

        ctx.lineTo(
            17,
            9
        );

        ctx.lineTo(
            5,
            7
        );

        ctx.closePath();

        ctx.fill();


        ctx.restore();

    }


    // =====================
    // GAME CLEAR
    // =====================

    const pulse =
        Math.sin(
            Game.clearAnimation * 0.08
        ) * 10 + 35;


    ctx.textAlign = "center";

    ctx.shadowColor =
        "#00aaff";

    ctx.shadowBlur = pulse;

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 76px sans-serif";


    ctx.fillText(
        "GAME CLEAR",
        400,
        120
    );


    ctx.shadowBlur = 0;


    ctx.fillStyle =
        "#66ccff";

    ctx.font =
        "bold 30px sans-serif";


    ctx.fillText(
        "EARTH DEFENDED",
        400,
        165
    );


    ctx.fillStyle =
        "rgba(255,255,255,0.8)";

    ctx.font =
        "22px sans-serif";


    ctx.fillText(
        "ALL METEORS HAVE BEEN DESTROYED",
        400,
        205
    );


    // =====================
    // 戻る表示
    // =====================

    const alpha =
        (
            Math.sin(
                Game.clearAnimation * 0.08
            ) + 1
        ) / 2;


    ctx.fillStyle =
        `rgba(255,255,255,${0.5 + alpha * 0.5})`;

    ctx.font =
        "22px sans-serif";


    ctx.fillText(
        "RETURNING TO TITLE...",
        400,
        650
    );


    ctx.restore();

}

}

};
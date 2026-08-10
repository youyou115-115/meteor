
/*
    Meteor Ver0.5
    renderer.js
*/

const Renderer = {

draw(){

    const ctx = Game.ctx;

    // =================================================
    // 基本サイズ
    // =================================================

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 700;


    // =================================================
    // 画面クリア
    // =================================================

    ctx.clearRect(
        0,
        0,
        Game.canvas.width,
        Game.canvas.height
    );


    // =================================================
    // 背景
    // =================================================

    ctx.fillStyle = "#02020a";

    ctx.fillRect(
        0,
        0,
        Game.canvas.width,
        Game.canvas.height
    );


    // =================================================
    // カメラ開始
    // =================================================

    ctx.save();

    if(
        Game.state === "GAME" ||
        Game.state === "GAMEOVER"
    ){

        ctx.translate(
            Camera.getX(),
            Camera.getY()
        );

    }


    // =================================================
    // 危険演出
    // =================================================

    if(Game.danger > 0){

        ctx.fillStyle =
            "rgba(255,0,0,0.1)";

        ctx.fillRect(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );

    }


    // =================================================
    // WAVE表示
    // =================================================

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


    // =================================================
    // ゲーム画面
    // =================================================

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


        // =================================================
        // BOSS
        // =================================================

        if(Game.bossWave){

            // -----------------------------
            // 月 / BOSS
            // -----------------------------

            if(Game.boss){

                Game.boss.draw(ctx);

            }


            // -----------------------------
            // ボス召喚隕石
            // -----------------------------

            for(let meteor of Game.bossMeteors){

                meteor.draw(ctx);

            }

        }


        // =================================================
        // コイン
        // =================================================

        if(Game.coin){

            Game.coin.draw(ctx);

        }


        // =================================================
        // ルーレット
        // =================================================

        Roulette.draw(ctx);

    }


    // =================================================
    // カメラ終了
    // =================================================

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

                const x = 400;
                const y = 350;


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
                GAME_WIDTH,
                GAME_HEIGHT
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
            GAME_WIDTH,
            GAME_HEIGHT
        );


        // =====================
        // GAME OVER
        // =====================

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

        // =====================
        // 背景
        // =====================

        ctx.fillStyle = "#02020a";

        ctx.fillRect(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );


        // =====================
        // 星
        // =====================

        for(let i=0;i<80;i++){

            const x =
                (i * 97) % GAME_WIDTH;


            const y =
                (i * 53) % GAME_HEIGHT;


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


        // =====================
        // クレーター
        // =====================

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


        // =====================
        // サブタイトル
        // =====================

        ctx.fillStyle = "#ff9900";

        ctx.font = "24px sans-serif";


        ctx.fillText(
            "DEFEND THE EARTH",
            400,
            350
        );


        // =====================
        // START
        // =====================

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


        // =====================
        // 操作説明
        // =====================

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
            GAME_WIDTH,
            GAME_HEIGHT
        );


        // =====================
        // 赤い垂れ幕
        // =====================

        const curtainWidth =
            185 * Game.bossCurtain;


        // =====================
        // 左幕
        // =====================

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
            GAME_HEIGHT
        );


        // 左幕の影

        ctx.fillStyle =
            "rgba(0,0,0,0.25)";


        for(let i=0;i<6;i++){

            ctx.fillRect(
                i * 32,
                0,
                12,
                GAME_HEIGHT
            );

        }


        // =====================
        // 右幕
        // =====================

        const rightGrad =
            ctx.createLinearGradient(
                GAME_WIDTH - curtainWidth,
                0,
                GAME_WIDTH,
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
            GAME_WIDTH - curtainWidth,
            0,
            curtainWidth,
            GAME_HEIGHT
        );


        // 右幕の影

        ctx.fillStyle =
            "rgba(0,0,0,0.25)";


        for(let i=0;i<6;i++){

            ctx.fillRect(
                GAME_WIDTH - i * 32 - 20,
                0,
                12,
                GAME_HEIGHT
            );

        }


        // =====================
        // WARNING
        // =====================

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
// METEOR FINISH
// ☄ METEOR役専用クリア演出
// =====================================================

if(Game.state === "SPECIAL_CLEAR"){

    ctx.save();

    // =================================================
    // 宇宙背景
    // =================================================

    ctx.fillStyle = "#000005";

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    // =================================================
    // 星
    // =================================================

    for(let i=0;i<120;i++){

        const x =
            (i * 137) % GAME_WIDTH;

        const y =
            (i * 83) % GAME_HEIGHT;

        const twinkle =
            Math.sin(
                Game.clearAnimation * 0.12 + i
            );

        const size =
            1 +
            (i % 2) +
            Math.max(0,twinkle);

        ctx.fillStyle =
            `rgba(255,255,255,${0.35 + Math.max(0,twinkle)*0.3})`;

        ctx.fillRect(
            x,
            y,
            size,
            size
        );

    }


    // =================================================
    // PHASE 0
    // 月登場
    // =================================================

    if(Game.specialClearPhase === 0){

        const progress =
            1 -
            Game.specialClearTimer / 120;

        // 上からゆっくり登場
        const moonY =
            500 -
            progress * 380;

        const moonX = 400;

        const moonRadius = 125;


        // 月の赤黒いオーラ
        const aura =
            ctx.createRadialGradient(
                moonX,
                moonY,
                60,
                moonX,
                moonY,
                190
            );

        aura.addColorStop(
            0,
            "rgba(255,40,20,0.35)"
        );

        aura.addColorStop(
            0.5,
            "rgba(120,0,0,0.18)"
        );

        aura.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle = aura;

        ctx.beginPath();

        ctx.arc(
            moonX,
            moonY,
            190,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =================================================
        // 月本体
        // =================================================

        const moon =
            ctx.createRadialGradient(
                moonX - 40,
                moonY - 45,
                10,
                moonX,
                moonY,
                moonRadius
            );

        moon.addColorStop(
            0,
            "#8d8d8d"
        );

        moon.addColorStop(
            0.45,
            "#555555"
        );

        moon.addColorStop(
            0.8,
            "#292929"
        );

        moon.addColorStop(
            1,
            "#090909"
        );

        ctx.fillStyle = moon;

        ctx.beginPath();

        ctx.arc(
            moonX,
            moonY,
            moonRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =================================================
        // クレーター
        // =================================================

        const craters = [

            [-55,-45,20],
            [48,-35,14],
            [-35,55,16],
            [55,45,10],
            [5,-70,9],
            [-75,15,8]

        ];


        for(const crater of craters){

            const x =
                moonX + crater[0];

            const y =
                moonY + crater[1];

            const r =
                crater[2];


            ctx.fillStyle =
                "rgba(0,0,0,0.38)";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                r,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.strokeStyle =
                "rgba(150,150,150,0.18)";

            ctx.lineWidth = 3;

            ctx.stroke();

        }


        // =================================================
        // 月の顔
        // =================================================

        ctx.strokeStyle =
            "#111";

        ctx.lineWidth = 5;

        ctx.lineCap = "round";


        // 目
        ctx.beginPath();

        ctx.moveTo(
            moonX - 55,
            moonY - 20
        );

        ctx.lineTo(
            moonX - 25,
            moonY - 25
        );

        ctx.moveTo(
            moonX + 25,
            moonY - 25
        );

        ctx.lineTo(
            moonX + 55,
            moonY - 20
        );

        ctx.stroke();


        // 鼻
        ctx.beginPath();

        ctx.moveTo(
            moonX,
            moonY - 8
        );

        ctx.lineTo(
            moonX - 4,
            moonY + 18
        );

        ctx.lineTo(
            moonX + 7,
            moonY + 20
        );

        ctx.stroke();


        // 口
        ctx.beginPath();

        ctx.moveTo(
            moonX - 42,
            moonY + 48
        );

        ctx.quadraticCurveTo(
            moonX,
            moonY + 65,
            moonX + 42,
            moonY + 48
        );

        ctx.stroke();


        // =================================================
        // METEOR FINISH
        // =================================================

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.font =
            "bold 68px sans-serif";

        ctx.shadowColor =
            "#ff2200";

        ctx.shadowBlur = 35;

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(
            "METEOR FINISH",
            400,
            100
        );

        ctx.shadowBlur = 0;

    }


    // =================================================
    // PHASE 1
    // 「それはあかんやろ」
    // =================================================

    else if(Game.specialClearPhase === 1){

        // 月を中央に固定

        const moonX = 400;
        const moonY = 230;
        const moonRadius = 125;


        // 赤いオーラ
        const aura =
            ctx.createRadialGradient(
                moonX,
                moonY,
                60,
                moonX,
                moonY,
                200
            );

        aura.addColorStop(
            0,
            "rgba(255,0,0,0.3)"
        );

        aura.addColorStop(
            1,
            "rgba(255,0,0,0)"
        );

        ctx.fillStyle = aura;

        ctx.beginPath();

        ctx.arc(
            moonX,
            moonY,
            200,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // 月
        const moon =
            ctx.createRadialGradient(
                moonX - 40,
                moonY - 45,
                10,
                moonX,
                moonY,
                moonRadius
            );

        moon.addColorStop(0,"#999");
        moon.addColorStop(0.5,"#555");
        moon.addColorStop(1,"#111");

        ctx.fillStyle = moon;

        ctx.beginPath();

        ctx.arc(
            moonX,
            moonY,
            moonRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // クレーター
        ctx.fillStyle =
            "rgba(0,0,0,0.4)";

        ctx.beginPath();

        ctx.arc(
            moonX - 50,
            moonY - 45,
            20,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            moonX + 45,
            moonY + 35,
            14,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // 顔
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        // 目
        ctx.beginPath();

        ctx.moveTo(
            moonX - 55,
            moonY - 20
        );

        ctx.lineTo(
            moonX - 25,
            moonY - 25
        );

        ctx.moveTo(
            moonX + 25,
            moonY - 25
        );

        ctx.lineTo(
            moonX + 55,
            moonY - 20
        );

        ctx.stroke();


        // 鼻
        ctx.beginPath();

        ctx.moveTo(
            moonX,
            moonY - 5
        );

        ctx.lineTo(
            moonX - 4,
            moonY + 18
        );

        ctx.stroke();


        // 口
        ctx.beginPath();

        ctx.moveTo(
            moonX - 40,
            moonY + 48
        );

        ctx.quadraticCurveTo(
            moonX,
            moonY + 58,
            moonX + 40,
            moonY + 48
        );

        ctx.stroke();


        // =================================================
        // セリフ
        // =================================================

        const pulse =
            Math.sin(
                Game.clearAnimation * 0.15
            ) * 5;


        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.font =
            "bold " +
            (54 + pulse) +
            "px sans-serif";

        ctx.shadowColor =
            "#ff0000";

        ctx.shadowBlur = 30;

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(
            "それはあかんやろ",
            400,
            470
        );


        ctx.shadowBlur = 0;


        ctx.font =
            "bold 28px sans-serif";

        ctx.fillStyle =
            "#ff4444";

        ctx.fillText(
            "MOON DEVIL",
            400,
            530
        );

    }


    // =================================================
    // PHASE 2
    // 爆発
    // =================================================

    else if(Game.specialClearPhase === 2){

        const progress =
            1 -
            Game.specialClearTimer / 90;


        const centerX = 400;
        const centerY = 250;


        // 爆発フラッシュ
        const flash =
            Math.max(
                0,
                1 - progress
            );


        ctx.fillStyle =
            `rgba(255,255,255,${flash * 0.8})`;

        ctx.fillRect(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );


        // 爆発リング
        for(let i=0;i<5;i++){

            const radius =
                progress *
                (80 + i * 45);

            const alpha =
                Math.max(
                    0,
                    1 -
                    progress -
                    i * 0.12
                );


            ctx.strokeStyle =
                `rgba(255,${80+i*30},0,${alpha})`;

            ctx.lineWidth =
                12 -
                progress * 8;

            ctx.beginPath();

            ctx.arc(
                centerX,
                centerY,
                radius,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        }


        // 爆発本体
        const explosion =
            ctx.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                260 * progress
            );

        explosion.addColorStop(
            0,
            "rgba(255,255,255,1)"
        );

        explosion.addColorStop(
            0.15,
            "rgba(255,220,80,0.95)"
        );

        explosion.addColorStop(
            0.45,
            "rgba(255,70,0,0.7)"
        );

        explosion.addColorStop(
            1,
            "rgba(255,0,0,0)"
        );

        ctx.fillStyle = explosion;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            260 * progress,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // 爆発光
        ctx.fillStyle =
            `rgba(255,255,255,${Math.max(0,1-progress)*0.8})`;

        ctx.fillRect(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );


        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.font =
            "bold 82px sans-serif";

        ctx.shadowColor =
            "#ff3300";

        ctx.shadowBlur = 40;

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(
            "METEOR FINISH",
            400,
            600
        );

        ctx.shadowBlur = 0;

    }


    // =================================================
    // PHASE 3
    // =================================================

    else if(Game.specialClearPhase === 3){

        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );

    }


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
            GAME_WIDTH,
            GAME_HEIGHT
        );


        // =====================
        // 星
        // =====================

        for(let i=0;i<100;i++){

            const x =
                (i * 137) % GAME_WIDTH;


            const y =
                (i * 83) % GAME_HEIGHT;


            const twinkle =
                Math.sin(
                    Game.clearAnimation * 0.08 +
                    i
                );


            const size =
                1 +
                (i % 2) +
                Math.max(
                    0,
                    twinkle
                );


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
        // GAME CLEAR文字
        // =====================

        const pulse =
            Math.sin(
                Game.clearAnimation * 0.08
            ) * 10 + 35;


        ctx.textAlign = "center";

        ctx.textBaseline = "alphabetic";

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


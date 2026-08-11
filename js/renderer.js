
/*
    Meteor Ver0.5
    renderer.js
*/


// =====================================================
// METEOR FINISH 用 月描画
// 指定された MOON DEVIL の顔を使用
// =====================================================

function drawFinishMoon(ctx, moonX, moonY, r, phase = 1, mouthOpen = false){

    ctx.save();

    ctx.translate(
        moonX,
        moonY
    );


    // =====================================================
    // 月本体
    // =====================================================

    const moon =
        ctx.createRadialGradient(

            -r * 0.38,
            -r * 0.42,
            r * 0.05,

            r * 0.12,
            r * 0.10,
            r * 1.15

        );


    if(phase === 1){

        moon.addColorStop(
            0,
            "#f4f4f4"
        );

        moon.addColorStop(
            0.30,
            "#d9d9d9"
        );

        moon.addColorStop(
            0.62,
            "#b4b4b4"
        );

        moon.addColorStop(
            0.84,
            "#858585"
        );

        moon.addColorStop(
            1,
            "#555555"
        );

    }
    else{

        moon.addColorStop(
            0,
            "#d88a8a"
        );

        moon.addColorStop(
            0.30,
            "#b05252"
        );

        moon.addColorStop(
            0.62,
            "#763232"
        );

        moon.addColorStop(
            0.84,
            "#481616"
        );

        moon.addColorStop(
            1,
            "#210707"
        );

    }


    ctx.fillStyle = moon;


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        r,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =====================================================
    // 月面クリップ
    // =====================================================

    ctx.save();


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        r,
        0,
        Math.PI * 2
    );

    ctx.clip();


    // =====================================================
    // クレーター
    // =====================================================

    const craters = [

        [-0.68,-0.62,0.045],
        [-0.48,-0.72,0.025],
        [-0.25,-0.78,0.038],
        [ 0.02,-0.74,0.022],
        [ 0.30,-0.70,0.045],
        [ 0.55,-0.58,0.032],

        [-0.80,-0.38,0.030],
        [-0.60,-0.40,0.055],
        [-0.36,-0.48,0.026],
        [ 0.42,-0.43,0.040],
        [ 0.67,-0.34,0.050],
        [ 0.82,-0.12,0.025],

        [-0.82,-0.05,0.048],
        [-0.65, 0.08,0.028],
        [ 0.63, 0.05,0.038],
        [ 0.78, 0.20,0.055],

        [-0.78, 0.30,0.038],
        [-0.58, 0.42,0.060],
        [ 0.55, 0.38,0.050],
        [ 0.76, 0.48,0.032],

        [-0.66, 0.65,0.055],
        [-0.40, 0.72,0.030],
        [-0.10, 0.70,0.045],
        [ 0.20, 0.68,0.028],
        [ 0.48, 0.65,0.050],
        [ 0.70, 0.70,0.025],

        [-0.88, 0.62,0.025],
        [ 0.88, 0.55,0.030],

        [-0.30,-0.30,0.018],
        [ 0.34,-0.27,0.025],

        [-0.42, 0.18,0.020],
        [ 0.38, 0.18,0.018],

        [-0.20, 0.48,0.022],
        [ 0.28, 0.45,0.018]

    ];


    for(let c of craters){

        const cx =
            c[0] * r;

        const cy =
            c[1] * r;

        const cr =
            c[2] * r;


        const crater =
            ctx.createRadialGradient(

                cx - cr * 0.28,
                cy - cr * 0.28,
                cr * 0.05,

                cx,
                cy,
                cr

            );


        crater.addColorStop(
            0,
            "rgba(255,255,255,0.10)"
        );

        crater.addColorStop(
            0.35,
            "rgba(130,130,130,0.10)"
        );

        crater.addColorStop(
            0.70,
            "rgba(50,50,50,0.20)"
        );

        crater.addColorStop(
            1,
            "rgba(30,30,30,0.42)"
        );


        ctx.fillStyle = crater;


        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            cr,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "rgba(50,50,50,0.12)";


        ctx.beginPath();

        ctx.arc(
            cx + cr * 0.10,
            cy + cr * 0.10,
            cr * 0.55,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // =====================================================
    // 非常に細かいクレーター
    // =====================================================

    const tinyCraters = [

        [-0.72,-0.75,0.010],
        [-0.61,-0.68,0.008],
        [-0.52,-0.58,0.012],
        [-0.42,-0.82,0.009],
        [-0.32,-0.67,0.011],
        [-0.18,-0.82,0.008],
        [-0.06,-0.70,0.010],
        [ 0.12,-0.82,0.008],
        [ 0.24,-0.62,0.011],
        [ 0.40,-0.78,0.009],
        [ 0.53,-0.67,0.012],
        [ 0.66,-0.73,0.008],

        [-0.82,-0.25,0.010],
        [-0.70,-0.15,0.008],
        [-0.56,-0.28,0.011],
        [-0.46,-0.12,0.008],

        [ 0.48,-0.18,0.010],
        [ 0.58,-0.28,0.008],
        [ 0.70,-0.18,0.012],
        [ 0.82,-0.25,0.008],

        [-0.82,0.08,0.010],
        [-0.70,0.18,0.008],
        [-0.57,0.30,0.012],

        [ 0.58,0.22,0.010],
        [ 0.70,0.30,0.008],
        [ 0.83,0.36,0.011],

        [-0.80,0.48,0.009],
        [-0.70,0.56,0.012],
        [-0.52,0.52,0.008],
        [-0.46,0.68,0.010],

        [ 0.45,0.55,0.010],
        [ 0.62,0.52,0.008],
        [ 0.78,0.62,0.011],

        [-0.25,0.62,0.008],
        [-0.08,0.74,0.011],
        [ 0.08,0.62,0.009],
        [ 0.25,0.74,0.010]

    ];


    for(let c of tinyCraters){

        const cx =
            c[0] * r;

        const cy =
            c[1] * r;

        const cr =
            c[2] * r;


        ctx.fillStyle =
            "rgba(45,45,45,0.18)";


        ctx.beginPath();

        ctx.arc(
            cx,
            cy,
            cr,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // =====================================================
    // 顔
    // =====================================================

    const eyeY =
        -r * 0.18;


    const eyeX =
        r * 0.32;


    // =====================================================
    // 目の周囲のくぼみ
    // =====================================================

    ctx.fillStyle =
        "rgba(55,55,55,0.28)";


    ctx.beginPath();

    ctx.ellipse(
        -eyeX,
        eyeY,
        r * 0.28,
        r * 0.075,
        -0.04,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        eyeX,
        eyeY,
        r * 0.28,
        r * 0.075,
        0.04,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =====================================================
    // 細く横長の目
    // =====================================================

    ctx.strokeStyle =
        "rgba(35,35,35,0.88)";


    ctx.lineWidth =
        r * 0.028;


    ctx.lineCap =
        "round";


    // 左目

    ctx.beginPath();

    ctx.moveTo(
        -r * 0.56,
        eyeY
    );

    ctx.quadraticCurveTo(
        -r * 0.32,
        eyeY - r * 0.075,
        -r * 0.08,
        eyeY
    );

    ctx.quadraticCurveTo(
        -r * 0.32,
        eyeY + r * 0.075,
        -r * 0.56,
        eyeY
    );

    ctx.stroke();


    // 右目

    ctx.beginPath();

    ctx.moveTo(
        r * 0.08,
        eyeY
    );

    ctx.quadraticCurveTo(
        r * 0.32,
        eyeY - r * 0.075,
        r * 0.56,
        eyeY
    );

    ctx.quadraticCurveTo(
        r * 0.32,
        eyeY + r * 0.075,
        r * 0.08,
        eyeY
    );

    ctx.stroke();


    // =====================================================
    // 目の内部
    // =====================================================

    ctx.fillStyle =
        "rgba(235,235,235,0.55)";


    ctx.beginPath();

    ctx.ellipse(
        -r * 0.32,
        eyeY,
        r * 0.17,
        r * 0.018,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        r * 0.32,
        eyeY,
        r * 0.17,
        r * 0.018,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =====================================================
    // 鼻
    // =====================================================

    ctx.strokeStyle =
        "rgba(55,55,55,0.38)";


    ctx.lineWidth =
        r * 0.035;


    ctx.beginPath();

    ctx.moveTo(
        -r * 0.035,
        -r * 0.12
    );

    ctx.quadraticCurveTo(
        -r * 0.055,
        r * 0.04,
        -r * 0.065,
        r * 0.22
    );

    ctx.stroke();


    // 鼻の右側

    ctx.strokeStyle =
        "rgba(245,245,245,0.35)";


    ctx.lineWidth =
        r * 0.018;


    ctx.beginPath();

    ctx.moveTo(
        r * 0.025,
        -r * 0.10
    );

    ctx.quadraticCurveTo(
        r * 0.04,
        r * 0.04,
        r * 0.045,
        r * 0.20
    );

    ctx.stroke();


    // =====================================================
    // 鼻先
    // =====================================================

    ctx.strokeStyle =
        "rgba(40,40,40,0.65)";


    ctx.lineWidth =
        r * 0.022;


    ctx.beginPath();

    ctx.moveTo(
        -r * 0.10,
        r * 0.22
    );

    ctx.quadraticCurveTo(
        -r * 0.05,
        r * 0.27,
        0,
        r * 0.23
    );

    ctx.quadraticCurveTo(
        r * 0.05,
        r * 0.27,
        r * 0.10,
        r * 0.22
    );

    ctx.stroke();


    // =====================================================
    // 鼻の穴
    // =====================================================

    ctx.fillStyle =
        "rgba(30,30,30,0.60)";


    ctx.beginPath();

    ctx.ellipse(
        -r * 0.055,
        r * 0.225,
        r * 0.022,
        r * 0.012,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(
        r * 0.055,
        r * 0.225,
        r * 0.022,
        r * 0.012,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =====================================================
    // 口
    // =====================================================

    ctx.strokeStyle =
        "rgba(45,45,45,0.78)";


    ctx.lineWidth =
        r * 0.022;


    ctx.lineCap =
        "round";


    ctx.beginPath();


    if(mouthOpen){

        ctx.moveTo(
            -r * 0.22,
            r * 0.39
        );

        ctx.quadraticCurveTo(
            0,
            r * 0.46,
            r * 0.22,
            r * 0.39
        );

    }
    else{

        ctx.moveTo(
            -r * 0.22,
            r * 0.39
        );

        ctx.quadraticCurveTo(
            0,
            r * 0.43,
            r * 0.22,
            r * 0.39
        );

    }


    ctx.stroke();


    // =====================================================
    // 口の両端
    // =====================================================

    ctx.fillStyle =
        "rgba(40,40,40,0.45)";


    ctx.beginPath();

    ctx.arc(
        -r * 0.22,
        r * 0.39,
        r * 0.018,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        r * 0.22,
        r * 0.39,
        r * 0.018,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // =====================================================
    // 口を開いたとき
    // =====================================================

    if(mouthOpen){

        ctx.fillStyle =
            "rgba(20,10,10,0.90)";


        ctx.beginPath();

        ctx.ellipse(
            0,
            r * 0.405,
            r * 0.22,
            r * 0.055,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.restore();
    ctx.restore();

}



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
// ☄ プレイヤー隕石 → 月へ接近 → 消失
// → 月面に細かいヒビ → 崩壊 → 大爆発
// → METEOR FINISH
// =====================================================

if(Game.state === "SPECIAL_CLEAR"){

    const W = GAME_WIDTH;
    const H = GAME_HEIGHT;

    ctx.save();

    // =================================================
    // 座標系リセット
    // =================================================

    ctx.setTransform(
        1,0,0,1,0,0
    );


    // =================================================
    // 800 x 700
    // =================================================

    const scale =
        Math.min(
            Game.canvas.width / W,
            Game.canvas.height / H
        );


    const offsetX =
        (Game.canvas.width - W * scale) / 2;


    const offsetY =
        (Game.canvas.height - H * scale) / 2;


    ctx.setTransform(
        scale,
        0,
        0,
        scale,
        offsetX,
        offsetY
    );


    // =================================================
    // 宇宙背景
    // =================================================

    ctx.fillStyle = "#000005";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    // =================================================
    // 星
    // =================================================

    for(let i = 0; i < 180; i++){

        const x =
            (i * 137) % W;

        const y =
            (i * 83) % H;


        const twinkle =
            Math.sin(
                Game.clearAnimation * 0.08 + i
            );


        const alpha =
            0.15 +
            Math.max(0,twinkle) * 0.5;


        ctx.fillStyle =
            `rgba(255,255,255,${alpha})`;


        ctx.fillRect(
            x,
            y,
            1 + (i % 2),
            1 + (i % 2)
        );

    }


    // =================================================
    // 月座標
    // =================================================

    const moonX = 400;
    const moonY = 300;
    const moonR = 100;


    // =================================================
    // ヒビ描画
    // =================================================

    function drawMoonCracks(progress){

        if(progress <= 0){
            return;
        }


        ctx.save();


        ctx.translate(
            moonX,
            moonY
        );


        // ---------------------------------------------
        // 月面内だけ
        // ---------------------------------------------

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            moonR * 0.98,
            0,
            Math.PI * 2
        );

        ctx.clip();


        ctx.strokeStyle =
            "rgba(15,15,15,0.9)";

        ctx.lineWidth = 1.6;

        ctx.lineCap = "round";

        ctx.lineJoin = "round";


        // =================================================
        // メインヒビ
        // =================================================

        const cracks = [

            [
                [0,0],
                [-7,-12],
                [-14,-25],
                [-28,-37],
                [-32,-53],
                [-46,-67],
                [-52,-84]
            ],

            [
                [0,0],
                [10,-8],
                [21,-17],
                [35,-28],
                [42,-44],
                [58,-57],
                [67,-76]
            ],

            [
                [0,0],
                [-5,13],
                [-13,26],
                [-25,38],
                [-31,54],
                [-46,66],
                [-55,82]
            ],

            [
                [0,0],
                [12,10],
                [24,20],
                [38,31],
                [46,45],
                [61,55],
                [73,70]
            ],

            [
                [0,0],
                [-15,3],
                [-28,9],
                [-43,7],
                [-58,16],
                [-72,12],
                [-88,22]
            ],

            [
                [0,0],
                [15,2],
                [29,7],
                [44,3],
                [59,10],
                [76,4],
                [90,14]
            ]

        ];


        for(let c of cracks){

            const visible =
                Math.min(
                    c.length,
                    Math.floor(
                        progress * c.length
                    ) + 1
                );


            if(visible < 2){
                continue;
            }


            ctx.beginPath();


            ctx.moveTo(
                c[0][0],
                c[0][1]
            );


            for(
                let i = 1;
                i < visible;
                i++
            ){

                ctx.lineTo(
                    c[i][0],
                    c[i][1]
                );

            }


            ctx.stroke();

        }


        // =================================================
        // 枝ヒビ
        // =================================================

        if(progress > 0.28){

            const branchProgress =
                Math.min(
                    1,
                    (progress - 0.28) / 0.72
                );


            const branches = [

                [-14,-25,-28,-12],
                [-28,-37,-48,-28],

                [21,-17,34,-3],
                [35,-28,56,-20],

                [-13,26,-31,20],
                [-25,38,-42,49],

                [24,20,42,31],
                [46,45,67,39],

                [-43,7,-51,-10],
                [-58,16,-72,29],

                [44,3,57,-10],
                [59,10,78,25]

            ];


            ctx.globalAlpha =
                branchProgress;


            for(let b of branches){

                ctx.beginPath();

                ctx.moveTo(
                    b[0],
                    b[1]
                );

                ctx.lineTo(
                    b[2],
                    b[3]
                );

                ctx.stroke();

            }

        }


        // =================================================
        // 細かいヒビ
        // =================================================

        if(progress > 0.55){

            const fineProgress =
                Math.min(
                    1,
                    (progress - 0.55) / 0.45
                );


            ctx.globalAlpha =
                fineProgress;


            const fineCracks = [

                [-32,-53,-44,-48],
                [-46,-67,-58,-62],

                [42,-44,52,-37],
                [58,-57,72,-51],

                [-31,54,-43,58],
                [-46,66,-61,62],

                [46,45,56,54],
                [61,55,78,57],

                [-58,16,-63,3],
                [-72,12,-83,2],

                [59,10,68,-2],
                [76,4,87,-7]

            ];


            for(let b of fineCracks){

                ctx.beginPath();

                ctx.moveTo(
                    b[0],
                    b[1]
                );

                ctx.lineTo(
                    b[2],
                    b[3]
                );

                ctx.stroke();

            }

        }


        ctx.restore();

    }


    // =================================================
    // FINISH用隕石描画
    // HPバーなし
    // =================================================

    function drawFinishMeteor(meteor,x,y,r){

        if(!meteor){
            return;
        }


        ctx.save();


        // =================================================
        // 炎
        // =================================================

        const fire =
            ctx.createRadialGradient(
                x,
                y,
                r * 0.5,
                x,
                y,
                r * 1.8
            );


        fire.addColorStop(
            0,
            "rgba(255,120,30,0.85)"
        );

        fire.addColorStop(
            0.5,
            "rgba(255,50,0,0.45)"
        );

        fire.addColorStop(
            1,
            "rgba(255,0,0,0)"
        );


        ctx.fillStyle = fire;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            r * 1.8,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =================================================
        // 岩
        // =================================================

        const points =
            meteor.randomMeteor
                ? 8 + Math.floor(Math.random() * 8)
                : 10;


        ctx.beginPath();


        for(let i = 0; i < points; i++){

            const angle =
                Math.PI * 2 * i / points;


            const offset =
                r *
                (
                    0.85 +
                    Math.random() * 0.15
                );


            const px =
                x +
                Math.cos(angle) * offset;


            const py =
                y +
                Math.sin(angle) * offset;


            if(i === 0){

                ctx.moveTo(
                    px,
                    py
                );

            }
            else{

                ctx.lineTo(
                    px,
                    py
                );

            }

        }


        ctx.closePath();


        // =================================================
        // 隕石カラー
        // =================================================

        const rock =
            ctx.createRadialGradient(
                x - r * 0.3,
                y - r * 0.4,
                5,
                x,
                y,
                r
            );


        if(meteor.type === 0){

            rock.addColorStop(
                0,
                "#777"
            );

            rock.addColorStop(
                0.5,
                "#333"
            );

            rock.addColorStop(
                1,
                "#080808"
            );

        }
        else if(meteor.type === 1){

            rock.addColorStop(
                0,
                "#ff8888"
            );

            rock.addColorStop(
                0.5,
                "#aa2222"
            );

            rock.addColorStop(
                1,
                "#330000"
            );

        }
        else if(meteor.type === 2){

            rock.addColorStop(
                0,
                "#8888ff"
            );

            rock.addColorStop(
                0.5,
                "#3333aa"
            );

            rock.addColorStop(
                1,
                "#111144"
            );

        }
        else if(meteor.type === 3){

            rock.addColorStop(
                0,
                "#88ff88"
            );

            rock.addColorStop(
                0.5,
                "#229922"
            );

            rock.addColorStop(
                1,
                "#113311"
            );

        }
        else if(meteor.type === 4){

            rock.addColorStop(
                0,
                "#ffff88"
            );

            rock.addColorStop(
                0.5,
                "#aa6622"
            );

            rock.addColorStop(
                1,
                "#442200"
            );

        }
        else{

            rock.addColorStop(
                0,
                "#ff88ff"
            );

            rock.addColorStop(
                0.5,
                "#882288"
            );

            rock.addColorStop(
                1,
                "#220022"
            );

        }


        ctx.fillStyle =
            rock;


        ctx.fill();


        // =================================================
        // 溶岩
        // =================================================

        ctx.fillStyle =
            "rgba(255,80,20,0.8)";


        ctx.beginPath();

        ctx.arc(
            x + r * 0.2,
            y - r * 0.2,
            r * 0.15,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();

    }


    // =================================================
    // PHASE 0
    //
    // 月登場
    // ↓
    // 隕石高速接近
    // ↓
    // 月直前で消失
    // =================================================

    if(Game.specialClearPhase === 0){

        // 次回CLEARに備えてリセット
        Game.finishLaughPlayed = false;


        const progress =
            Math.min(
                1,
                Math.max(
                    0,
                    1 -
                    Game.specialClearTimer / 70
                )
            );


        // =================================================
        // 月
        // =================================================

        drawFinishMoon(
            ctx,
            moonX,
            moonY,
            moonR,
            1,
            false
        );


        // =================================================
        // 月オーラ
        // =================================================

        const aura =
            ctx.createRadialGradient(
                moonX,
                moonY,
                moonR * 0.3,
                moonX,
                moonY,
                moonR * 2.2
            );


        aura.addColorStop(
            0,
            "rgba(255,30,10,0.20)"
        );

        aura.addColorStop(
            0.45,
            "rgba(150,0,0,0.08)"
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
            moonR * 2.2,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =================================================
        // 隕石
        // =================================================

        if(Game.meteor){

            const meteor =
                Game.meteor;


            const meteorX =
                400;


            const meteorY =
                700 -
                progress * 360;


            const meteorScale =
                0.45 +
                progress * 0.55;


            drawFinishMeteor(
                meteor,
                meteorX,
                meteorY,
                25 * meteorScale
            );

        }

        // ★ 白い円は完全削除

    }


    // =================================================
    // PHASE 1
    //
    // 月面に細かいヒビ
    // ↓
    // ヒビが全体へ拡大
    // =================================================

    else if(Game.specialClearPhase === 1){

        const progress =
            Math.min(
                1,
                Math.max(
                    0,
                    1 -
                    Game.specialClearTimer / 80
                )
            );


        // =================================================
        // 月
        // =================================================

        drawFinishMoon(
            ctx,
            moonX,
            moonY,
            moonR,
            2,
            false
        );


        // =================================================
        // 赤い内部発光
        // =================================================

        const redGlow =
            ctx.createRadialGradient(
                moonX,
                moonY,
                20,
                moonX,
                moonY,
                moonR * 1.3
            );


        redGlow.addColorStop(
            0,
            `rgba(
                255,
                30,
                20,
                ${0.08 + progress * 0.30}
            )`
        );


        redGlow.addColorStop(
            0.55,
            `rgba(
                180,
                0,
                0,
                ${progress * 0.15}
            )`
        );


        redGlow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.fillStyle =
            redGlow;


        ctx.beginPath();

        ctx.arc(
            moonX,
            moonY,
            moonR * 1.3,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =================================================
        // ヒビ
        // =================================================

        drawMoonCracks(
            progress
        );


        // =================================================
        // ヒビから赤い光
        // =================================================

        if(progress > 0.35){

            const glow =
                (
                    progress - 0.35
                ) / 0.65;


            ctx.strokeStyle =
                `rgba(
                    255,
                    60,
                    20,
                    ${glow * 0.55}
                )`;


            ctx.lineWidth = 4;

            ctx.shadowColor =
                "#ff2200";

            ctx.shadowBlur = 12;


            const glowCracks = [

                [0,0,-32,-53],
                [0,0,42,-44],
                [0,0,-31,54],
                [0,0,46,45],
                [0,0,-58,16],
                [0,0,59,10]

            ];


            for(let c of glowCracks){

                ctx.beginPath();

                ctx.moveTo(
                    moonX + c[0],
                    moonY + c[1]
                );

                ctx.lineTo(
                    moonX + c[2],
                    moonY + c[3]
                );

                ctx.stroke();

            }


            ctx.shadowBlur = 0;

        }

    }


    // =================================================
    // PHASE 2
    //
    // 月崩壊
    // ↓
    // 爆発
    // ↓
    // 破片飛散
    // =================================================

    else if(Game.specialClearPhase === 2){

        const progress =
            Math.min(
                1,
                Math.max(
                    0,
                    1 -
                    Game.specialClearTimer / 110
                )
            );


        // =================================================
        // 笑い声
        // 月崩壊開始時に一度だけ
        // =================================================

        if(!Game.finishLaughPlayed){

            Game.finishLaughPlayed = true;

            if(
                typeof Sound !== "undefined" &&
                Sound.bossLaugh
            ){

                Sound.bossLaugh();

            }

        }


        // =================================================
        // カメラ振動
        // =================================================

        const shakePower =
            progress * 24;


        const shakeX =
            (
                Math.random() - 0.5
            ) * shakePower;


        const shakeY =
            (
                Math.random() - 0.5
            ) * shakePower;


        ctx.save();


        ctx.translate(
            shakeX,
            shakeY
        );


        // =================================================
        // 崩壊する月
        // =================================================

        if(progress < 0.25){

            const moonScale =
                1 -
                progress * 1.5;


            drawFinishMoon(
                ctx,
                moonX,
                moonY,
                moonR * moonScale,
                2,
                false
            );


            drawMoonCracks(
                Math.min(
                    1,
                    progress * 5
                )
            );

        }


        // =================================================
        // 爆発進行
        // =================================================

        const explosionProgress =
            Math.min(
                1,
                progress / 0.75
            );


        // =================================================
        // 爆発リング
        // =================================================

        for(let i = 0; i < 12; i++){

            const ringProgress =
                Math.max(
                    0,
                    explosionProgress -
                    i * 0.04
                );


            const radius =
                ringProgress *
                (
                    70 +
                    i * 42
                );


            const alpha =
                Math.max(
                    0,
                    1 -
                    ringProgress
                );


            ctx.strokeStyle =
                `rgba(
                    255,
                    ${50 + i * 15},
                    20,
                    ${alpha}
                )`;


            ctx.lineWidth =
                3 +
                (1 - ringProgress) * 7;


            ctx.beginPath();

            ctx.arc(
                moonX,
                moonY,
                radius,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        }


        // =================================================
        // 中央爆発
        // =================================================

        if(progress > 0.03){

            const explosionRadius =
                30 +
                380 *
                explosionProgress;


            const explosion =
                ctx.createRadialGradient(
                    moonX,
                    moonY,
                    0,
                    moonX,
                    moonY,
                    explosionRadius
                );


            explosion.addColorStop(
                0,
                "rgba(255,255,255,1)"
            );

            explosion.addColorStop(
                0.06,
                "rgba(255,245,190,1)"
            );

            explosion.addColorStop(
                0.18,
                "rgba(255,140,20,0.98)"
            );

            explosion.addColorStop(
                0.40,
                "rgba(230,20,0,0.72)"
            );

            explosion.addColorStop(
                0.70,
                "rgba(100,0,0,0.28)"
            );

            explosion.addColorStop(
                1,
                "rgba(40,0,0,0)"
            );


            ctx.fillStyle =
                explosion;


            ctx.beginPath();

            ctx.arc(
                moonX,
                moonY,
                explosionRadius,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        // =================================================
        // 放射状爆発
        // =================================================

        if(progress > 0.05){

            for(let i = 0; i < 48; i++){

                const angle =
                    i *
                    Math.PI *
                    2 /
                    48;


                const inner =
                    35 *
                    explosionProgress;


                const outer =
                    (
                        150 +
                        (i % 7) * 55
                    ) *
                    explosionProgress;


                const alpha =
                    Math.max(
                        0,
                        1 -
                        explosionProgress
                    );


                ctx.strokeStyle =
                    `rgba(
                        255,
                        ${70 + (i % 5) * 30},
                        20,
                        ${alpha}
                    )`;


                ctx.lineWidth =
                    2 +
                    (i % 3);


                ctx.beginPath();

                ctx.moveTo(
                    moonX +
                    Math.cos(angle) * inner,

                    moonY +
                    Math.sin(angle) * inner
                );


                ctx.lineTo(
                    moonX +
                    Math.cos(angle) * outer,

                    moonY +
                    Math.sin(angle) * outer
                );


                ctx.stroke();

            }

        }


        // =================================================
        // 月の破片
        // =================================================

        if(progress > 0.08){

            const fragmentProgress =
                Math.min(
                    1,
                    (progress - 0.08) / 0.68
                );


            const fragments = [

                [-2.95,115,18],
                [-2.60,160,13],
                [-2.25,210,20],
                [-1.90,260,12],

                [-1.55,180,17],
                [-1.20,250,14],
                [-0.82,300,20],
                [-0.42,225,13],

                [0.00,310,18],
                [0.40,250,14],
                [0.78,300,20],
                [1.15,220,12],

                [1.50,190,19],
                [1.90,275,14],
                [2.30,225,18],
                [2.70,170,12]

            ];


            for(
                let i = 0;
                i < fragments.length;
                i++
            ){

                const f =
                    fragments[i];


                const distance =
                    f[1] *
                    fragmentProgress;


                const x =
                    moonX +
                    Math.cos(f[0]) *
                    distance;


                const y =
                    moonY +
                    Math.sin(f[0]) *
                    distance;


                ctx.save();


                ctx.translate(
                    x,
                    y
                );


                ctx.rotate(
                    Game.clearAnimation *
                    (
                        0.05 +
                        i * 0.011
                    )
                );


                ctx.shadowColor =
                    "#ff3300";

                ctx.shadowBlur =
                    15;


                const fragmentScale =
                    1 -
                    fragmentProgress *
                    0.35;


                ctx.scale(
                    fragmentScale,
                    fragmentScale
                );


                ctx.fillStyle =
                    "#777";


                ctx.beginPath();


                ctx.moveTo(
                    -f[2],
                    0
                );


                ctx.lineTo(
                    0,
                    -f[2] * 0.75
                );


                ctx.lineTo(
                    f[2],
                    f[2] * 0.25
                );


                ctx.lineTo(
                    f[2] * 0.25,
                    f[2]
                );


                ctx.closePath();


                ctx.fill();


                ctx.strokeStyle =
                    "rgba(255,80,20,0.82)";


                ctx.lineWidth = 2;


                ctx.stroke();


                ctx.restore();

            }

        }


        ctx.restore();


        // =================================================
        // 最後の白フラッシュ
        // =================================================

        if(progress > 0.76){

            const flash =
                Math.min(
                    1,
                    (progress - 0.76) / 0.24
                );


            ctx.fillStyle =
                `rgba(
                    255,
                    255,
                    255,
                    ${flash}
                )`;


            ctx.fillRect(
                0,
                0,
                W,
                H
            );

        }

    }


// =================================================
// PHASE 3
//
// 爆発終了
// ↓
// 白フラッシュ
// ↓
// 暗転
// ↓
// METEOR FINISH
// =================================================

else if(Game.specialClearPhase === 3){

    const progress =
        Math.min(
            1,
            Math.max(
                0,
                1 -
                Game.specialClearTimer / 100
            )
        );


    // =================================================
    // 背景
    // =================================================

    ctx.fillStyle =
        "#000005";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    // =================================================
    // 爆発直後の白フラッシュ
    // 少しだけ残す
    // =================================================

    if(progress < 0.12){

        const flash =
            1 -
            progress / 0.12;


        ctx.fillStyle =
            `rgba(
                255,
                255,
                255,
                ${flash * 0.9}
            )`;


        ctx.fillRect(
            0,
            0,
            W,
            H
        );

    }


    // =================================================
    // 暗転からタイトル登場
    // =================================================

    if(progress > 0.18){

        const titleProgress =
            Math.min(
                1,
                (progress - 0.18) / 0.32
            );


        // ---------------------------------------------
        // なめらかなイージング
        // ---------------------------------------------

        const ease =
            1 -
            Math.pow(
                1 - titleProgress,
                3
            );


        // =================================================
        // 背景の赤い光
        // =================================================

        const glow =
            ctx.createRadialGradient(
                W / 2,
                350,
                0,
                W / 2,
                350,
                360
            );


        glow.addColorStop(
            0,
            `rgba(
                180,
                0,
                0,
                ${0.22 * ease}
            )`
        );


        glow.addColorStop(
            0.35,
            `rgba(
                100,
                0,
                0,
                ${0.10 * ease}
            )`
        );


        glow.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.beginPath();

        ctx.arc(
            W / 2,
            350,
            360,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =================================================
        // タイトル
        // =================================================

        ctx.save();


        ctx.translate(
            W / 2,
            350
        );


        // ---------------------------------------------
        // 登場時に少し大きい
        // ---------------------------------------------

        const titleScale =
            1.25 -
            ease * 0.25;


        ctx.scale(
            titleScale,
            titleScale
        );


        // ---------------------------------------------
        // 少しだけ右上がり
        // ---------------------------------------------

        ctx.rotate(
            -0.025
        );


        ctx.globalAlpha =
            ease;


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        // =================================================
        // フォント
        // =================================================

        ctx.font =
            "italic 78px Impact, Arial Black, sans-serif";


        // =================================================
        // 外側の黒い太縁
        // =================================================

        ctx.lineWidth =
            14;


        ctx.lineJoin =
            "round";


        ctx.strokeStyle =
            "#080808";


        ctx.strokeText(
            "METEOR FINISH",
            0,
            0
        );


        // =================================================
        // 赤い発光
        // =================================================

        ctx.shadowColor =
            "#ff1800";


        ctx.shadowBlur =
            35;


        ctx.lineWidth =
            8;


        ctx.strokeStyle =
            "#ff2200";


        ctx.strokeText(
            "METEOR FINISH",
            0,
            0
        );


        // =================================================
        // 白文字
        // =================================================

        ctx.shadowColor =
            "#ffffff";


        ctx.shadowBlur =
            12;


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(
            "METEOR FINISH",
            0,
            0
        );


        // =================================================
        // 上側の白ハイライト
        // =================================================

        ctx.shadowBlur =
            0;


        ctx.lineWidth =
            2;


        ctx.strokeStyle =
            "rgba(255,255,255,0.75)";


        ctx.strokeText(
            "METEOR FINISH",
            0,
            -1
        );


        ctx.restore();


        // =================================================
        // タイトル横の赤いスピードライン
        // =================================================

        if(titleProgress > 0.15){

            const lineProgress =
                Math.min(
                    1,
                    (titleProgress - 0.15) / 0.45
                );


            ctx.save();


            ctx.globalAlpha =
                lineProgress * 0.8;


            ctx.strokeStyle =
                "#ff2200";


            ctx.lineWidth = 2;


            ctx.shadowColor =
                "#ff2200";


            ctx.shadowBlur =
                10;


            // -----------------------------------------
            // 左
            // -----------------------------------------

            ctx.beginPath();

            ctx.moveTo(
                80,
                350
            );

            ctx.lineTo(
                260 * lineProgress,
                350
            );

            ctx.stroke();


            // -----------------------------------------
            // 右
            // -----------------------------------------

            ctx.beginPath();

            ctx.moveTo(
                W - 80,
                350
            );

            ctx.lineTo(
                W -
                260 * lineProgress,
                350
            );

            ctx.stroke();


            ctx.restore();

        }


        // =================================================
        // 下側の赤いライン
        // =================================================

        if(titleProgress > 0.35){

            const lineAlpha =
                Math.min(
                    1,
                    (titleProgress - 0.35) / 0.25
                );


            ctx.save();


            ctx.globalAlpha =
                lineAlpha * 0.65;


            ctx.strokeStyle =
                "#ff2200";


            ctx.lineWidth = 2;


            ctx.beginPath();

            ctx.moveTo(
                180,
                405
            );


            ctx.lineTo(
                W - 180,
                405
            );


            ctx.stroke();


            ctx.restore();

        }

    }


    // =================================================
    // 最後まで残る小さな赤い光
    // =================================================

    if(progress > 0.55){

        const finalGlow =
            Math.min(
                1,
                (progress - 0.55) / 0.25
            );


        ctx.save();


        ctx.globalAlpha =
            finalGlow * 0.18;


        const finalLight =
            ctx.createRadialGradient(
                W / 2,
                350,
                20,
                W / 2,
                350,
                300
            );


        finalLight.addColorStop(
            0,
            "#ff2200"
        );


        finalLight.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.fillStyle =
            finalLight;


        ctx.fillRect(
            0,
            0,
            W,
            H
        );


        ctx.restore();

    }

}
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


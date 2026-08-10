
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

    // ================================
    // 背景
    // ================================

    ctx.fillStyle = "#000005";

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    // ================================
    // 星
    // ================================

    for(let i = 0; i < 100; i++){

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
            (i % 2);

        ctx.fillStyle =
            `rgba(255,255,255,${0.35 + Math.max(0,twinkle) * 0.3})`;

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
            Math.min(
                1,
                Math.max(
                    0,
                    1 -
                    Game.specialClearTimer / 70
                )
            );


        const moonX = 400;

        const moonY =
            500 -
            progress * 150;

        const moonRadius =
            20 +
            progress * 105;


        // =============================
        // オーラ
        // =============================

        const aura =
            ctx.createRadialGradient(
                moonX,
                moonY,
                moonRadius * 0.4,
                moonX,
                moonY,
                moonRadius * 1.8
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
            moonRadius * 1.8,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =============================
        // 月本体
        // =============================

        const moon =
            ctx.createRadialGradient(
                moonX - moonRadius * 0.35,
                moonY - moonRadius * 0.4,
                moonRadius * 0.05,
                moonX,
                moonY,
                moonRadius
            );


        moon.addColorStop(
            0,
            "#999999"
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


        // =============================
        // クレーター
        // =============================

        const craters = [

            [-0.45,-0.35,0.16],
            [ 0.40,-0.28,0.11],
            [-0.30, 0.43,0.13],
            [ 0.42, 0.38,0.08],
            [ 0.03,-0.55,0.07]

        ];


        for(const c of craters){

            const cx =
                moonX +
                c[0] *
                moonRadius;

            const cy =
                moonY +
                c[1] *
                moonRadius;

            const cr =
                c[2] *
                moonRadius;


            ctx.fillStyle =
                "rgba(0,0,0,0.38)";

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


        // =============================
        // 顔
        // =============================

        ctx.strokeStyle = "#111111";

        ctx.lineWidth =
            Math.max(
                2,
                moonRadius * 0.035
            );

        ctx.lineCap = "round";


        // 目

        ctx.beginPath();

        ctx.moveTo(
            moonX - moonRadius * 0.42,
            moonY - moonRadius * 0.12
        );

        ctx.lineTo(
            moonX - moonRadius * 0.18,
            moonY - moonRadius * 0.16
        );

        ctx.moveTo(
            moonX + moonRadius * 0.18,
            moonY - moonRadius * 0.16
        );

        ctx.lineTo(
            moonX + moonRadius * 0.42,
            moonY - moonRadius * 0.12
        );

        ctx.stroke();


        // 鼻

        ctx.beginPath();

        ctx.moveTo(
            moonX,
            moonY - moonRadius * 0.06
        );

        ctx.lineTo(
            moonX - moonRadius * 0.025,
            moonY + moonRadius * 0.15
        );

        ctx.stroke();


        // 口

        ctx.beginPath();

        ctx.moveTo(
            moonX - moonRadius * 0.32,
            moonY + moonRadius * 0.38
        );

        ctx.quadraticCurveTo(
            moonX,
            moonY + moonRadius * 0.48,
            moonX + moonRadius * 0.32,
            moonY + moonRadius * 0.38
        );

        ctx.stroke();


        // =============================
        // タイトル
        // =============================

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.font =
            "bold 62px sans-serif";

        ctx.shadowColor =
            "#ff2200";

        ctx.shadowBlur = 30;

        ctx.fillStyle =
            "#ffffff";

        ctx.fillText(
            "METEOR FINISH",
            400,
            90
        );

        ctx.shadowBlur = 0;

    }


    // =================================================
    // PHASE 1
    // =================================================

    else if(Game.specialClearPhase === 1){

        const moonX = 400;

        const moonY = 230;

        const moonRadius = 125;


        // =============================
        // オーラ
        // =============================

        const aura =
            ctx.createRadialGradient(
                moonX,
                moonY,
                50,
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


        // =============================
        // 月
        // =============================

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
            "#999999"
        );

        moon.addColorStop(
            0.5,
            "#555555"
        );

        moon.addColorStop(
            1,
            "#111111"
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


        // =============================
        // クレーター
        // =============================

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


        // =============================
        // 顔
        // =============================

        ctx.strokeStyle = "#111111";

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


        // =============================
        // セリフ
        // =============================

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
            "☄はあかんやろ",
            400,
            470
        );

        // =================================================
// 月の亀裂演出
// =================================================

const crackProgress =
    Math.min(
        1,
        Math.max(
            0,
            1 -
            Game.specialClearTimer / 100
        )
    );


// 亀裂の位置
const cracks = [

    [-5,-10, -55,-70],
    [5,-5, 55,-75],
    [-5,0, -75,5],
    [5,5, 75,10],
    [-5,5, -55,75],
    [5,0, 55,80]

];


ctx.save();

ctx.lineCap = "round";


// 赤い発光
ctx.shadowColor = "#ff2200";
ctx.shadowBlur = 20;

ctx.strokeStyle =
    `rgba(255,40,0,${crackProgress})`;

ctx.lineWidth = 7;


for(const c of cracks){

    const sx =
        moonX + c[0];

    const sy =
        moonY + c[1];

    const ex =
        moonX +
        c[2] *
        crackProgress;

    const ey =
        moonY +
        c[3] *
        crackProgress;


    ctx.beginPath();

    ctx.moveTo(
        sx,
        sy
    );

    ctx.lineTo(
        ex,
        ey
    );

    ctx.stroke();

}


// 黒い亀裂を重ねる
ctx.shadowBlur = 0;

ctx.strokeStyle = "#080808";

ctx.lineWidth = 3;


for(const c of cracks){

    const sx =
        moonX + c[0];

    const sy =
        moonY + c[1];

    const ex =
        moonX +
        c[2] *
        crackProgress;

    const ey =
        moonY +
        c[3] *
        crackProgress;


    ctx.beginPath();

    ctx.moveTo(
        sx,
        sy
    );

    ctx.lineTo(
        ex,
        ey
    );

    ctx.stroke();

}


ctx.restore();


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
// 月本体 → 破片 → 赤い爆発 → 白フラッシュ
// =================================================

else if(Game.specialClearPhase === 2){

    const progress =
        1 -
        Math.max(
            0,
            Game.specialClearTimer / 110
        );


    const centerX = 400;
    const centerY = 250;


    // =============================================
    // ① 月が一瞬縮む
    // =============================================

    const shrinkProgress =
        Math.min(
            1,
            progress * 5
        );


    const moonScale =
        1 -
        shrinkProgress * 0.35;


    // =============================================
    // ② 月本体
    // =============================================

    if(progress < 0.22){

        const radius =
            125 * moonScale;


        const moon =
            ctx.createRadialGradient(
                centerX - 40,
                centerY - 45,
                10,
                centerX,
                centerY,
                radius
            );


        moon.addColorStop(
            0,
            "#aaaaaa"
        );

        moon.addColorStop(
            0.45,
            "#666666"
        );

        moon.addColorStop(
            0.8,
            "#252525"
        );

        moon.addColorStop(
            1,
            "#080808"
        );


        ctx.fillStyle = moon;


        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =========================================
        // 赤い内部光
        // =========================================

        const innerGlow =
            progress / 0.22;


        const glow =
            ctx.createRadialGradient(
                centerX,
                centerY,
                20,
                centerX,
                centerY,
                125
            );


        glow.addColorStop(
            0,
            `rgba(255,255,180,${innerGlow * 0.9})`
        );

        glow.addColorStop(
            0.35,
            `rgba(255,60,0,${innerGlow * 0.6})`
        );

        glow.addColorStop(
            1,
            "rgba(255,0,0,0)"
        );


        ctx.fillStyle = glow;


        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            125,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // =============================================
    // ③ 月の破片
    // =============================================

    if(progress > 0.08){

        const fragmentProgress =
            Math.min(
                1,
                (progress - 0.08) / 0.55
            );


        const fragments = [

            {
                angle:-2.7,
                distance:190,
                size:22
            },

            {
                angle:-2.1,
                distance:240,
                size:15
            },

            {
                angle:-1.55,
                distance:210,
                size:20
            },

            {
                angle:-1.0,
                distance:260,
                size:14
            },

            {
                angle:-0.45,
                distance:230,
                size:24
            },

            {
                angle:0.05,
                distance:280,
                size:16
            },

            {
                angle:0.55,
                distance:220,
                size:20
            },

            {
                angle:1.0,
                distance:270,
                size:13
            },

            {
                angle:1.55,
                distance:240,
                size:21
            },

            {
                angle:2.1,
                distance:290,
                size:15
            },

            {
                angle:2.55,
                distance:220,
                size:18
            },

            {
                angle:3.0,
                distance:260,
                size:13
            }

        ];


        for(let i=0;i<fragments.length;i++){

            const f =
                fragments[i];


            const distance =
                f.distance *
                fragmentProgress;


            const x =
                centerX +
                Math.cos(f.angle) *
                distance;


            const y =
                centerY +
                Math.sin(f.angle) *
                distance;


            const rotation =
                Game.clearAnimation *
                (
                    0.08 +
                    i * 0.01
                );


            ctx.save();


            ctx.translate(
                x,
                y
            );


            ctx.rotate(
                rotation
            );


            // =====================================
            // 破片の赤い光
            // =====================================

            ctx.shadowColor =
                "#ff2200";

            ctx.shadowBlur =
                15;


            ctx.fillStyle =
                "#777";


            ctx.beginPath();


            ctx.moveTo(
                -f.size,
                0
            );

            ctx.lineTo(
                0,
                -f.size * 0.7
            );

            ctx.lineTo(
                f.size,
                f.size * 0.3
            );

            ctx.lineTo(
                f.size * 0.2,
                f.size
            );

            ctx.closePath();


            ctx.fill();


            // =====================================
            // 破片の赤い縁
            // =====================================

            ctx.shadowBlur = 0;

            ctx.strokeStyle =
                "rgba(255,50,10,0.8)";

            ctx.lineWidth = 2;


            ctx.stroke();


            ctx.restore();

        }

    }


    // =============================================
    // ④ 爆発リング
    // =============================================

    const explosionProgress =
        Math.min(
            1,
            Math.max(
                0,
                (progress - 0.12) /
                0.65
            )
        );


    for(let i=0;i<7;i++){

        const radius =
            explosionProgress *
            (
                70 +
                i * 45
            );


        const alpha =
            Math.max(
                0,
                1 -
                explosionProgress -
                i * 0.08
            );


        ctx.strokeStyle =
            `rgba(255,${50 + i * 25},10,${alpha})`;


        ctx.lineWidth =
            Math.max(
                2,
                12 -
                explosionProgress * 9
            );


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


    // =============================================
    // ⑤ 赤い爆発本体
    // =============================================

    if(progress > 0.12){

        const explosionRadius =
            320 *
            explosionProgress;


        const explosion =
            ctx.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                Math.max(
                    1,
                    explosionRadius
                )
            );


        explosion.addColorStop(
            0,
            "rgba(255,255,255,1)"
        );

        explosion.addColorStop(
            0.08,
            "rgba(255,230,120,1)"
        );

        explosion.addColorStop(
            0.25,
            "rgba(255,80,0,0.95)"
        );

        explosion.addColorStop(
            0.55,
            "rgba(220,0,0,0.65)"
        );

        explosion.addColorStop(
            1,
            "rgba(80,0,0,0)"
        );


        ctx.fillStyle =
            explosion;


        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            Math.max(
                1,
                explosionRadius
            ),
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // =============================================
    // ⑥ 爆発の光線
    // =============================================

    if(progress > 0.15){

        const beamProgress =
            Math.min(
                1,
                (progress - 0.15) /
                0.6
            );


        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );


        for(let i=0;i<24;i++){

            const angle =
                i *
                Math.PI *
                2 /
                24;


            const inner =
                80 *
                beamProgress;


            const outer =
                (
                    180 +
                    (i % 4) * 55
                ) *
                beamProgress;


            ctx.strokeStyle =
                `rgba(255,${60 + (i%3)*40},20,${1 - beamProgress})`;


            ctx.lineWidth =
                3 +
                (i % 3);


            ctx.beginPath();

            ctx.moveTo(
                Math.cos(angle) *
                inner,

                Math.sin(angle) *
                inner
            );


            ctx.lineTo(
                Math.cos(angle) *
                outer,

                Math.sin(angle) *
                outer
            );


            ctx.stroke();

        }


        ctx.restore();

    }


    // =============================================
    // ⑦ 最後に白フラッシュ
    // =============================================

    const whiteFlash =
        Math.max(
            0,
            (progress - 0.72) /
            0.28
        );


    if(whiteFlash > 0){

        ctx.fillStyle =
            `rgba(255,255,255,${whiteFlash})`;


        ctx.fillRect(
            0,
            0,
            GAME_WIDTH,
            GAME_HEIGHT
        );

    }


    // =============================================
    // ⑧ METEOR FINISH
    // =============================================

    if(progress > 0.82){

        const textAlpha =
            Math.min(
                1,
                (progress - 0.82) /
                0.18
            );


        ctx.save();

        ctx.globalAlpha =
            textAlpha;


        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";


        ctx.font =
            "bold 82px sans-serif";


        ctx.shadowColor =
            "#ff2200";

        ctx.shadowBlur =
            40;


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(
            "METEOR FINISH",
            400,
            600
        );


        ctx.restore();

    }

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


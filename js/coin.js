
/*
Meteor Ver0.2
coin.js
*/

class Coin{

    constructor(){

        this.reset();

    }


    reset(){

        this.rotation = 0;
        this.rotationSpeed = 0;
        this.flip = 0;


        this.x = 400;

        this.y = 620;


        this.radius = 18;


        this.scale = 1;


        this.vx = 0;
        this.vy = 0;


        this.active = false;


        this.displayOnly = false;


    }


    throw(){

        // =====================
        // ルーレット非表示
        // =====================

        Roulette.visible = false;


        this.active = true;


        // =====================
        // 現在位置
        // =====================

        const startX =
            this.x;

        const startY =
            this.y;


        let targetX;
        let targetY;


        // =====================================================
        // BOSS戦
        // =====================================================

        if(Game.bossWave){

            // =====================
            // まず召喚隕石を探す
            // =====================

            const targetMeteor =
                Game.bossMeteors.find(
                    meteor =>
                        meteor.active
                );


            if(targetMeteor){

                // 召喚隕石を狙う

                targetX =
                    targetMeteor.x;

                targetY =
                    targetMeteor.y;

            }


            // =====================
            // 召喚隕石がいない
            // =====================

            else if(
    Game.boss &&
    Game.boss.active &&
    (
        Game.boss.attackState === "CHANCE" ||
        Game.boss.phase === 2
    )
){

                // 攻撃チャンス中だけ
                // 月を狙える

                targetX =
                    Game.boss.x;

                targetY =
                    Game.boss.y;

            }


            // =====================
            // 攻撃対象なし
            // =====================

            else{

                // コインを飛ばさない

                this.active = false;

                return;

            }

        }


        // =====================================================
        // 通常戦
        // =====================================================

        else{

            targetX =
                Game.meteor.x;

            targetY =
                Game.meteor.y;

        }


        // =====================
        // 方向計算
        // =====================

        const dx =
            targetX - startX;


        const dy =
            targetY - startY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if(distance <= 0){

            this.active = false;

            return;

        }


        // =====================
        // 飛行速度
        // =====================

        const speed = 72;


        this.vx =
            dx / distance *
            speed;


        this.vy =
            dy / distance *
            speed;


        // =====================
        // 回転
        // =====================

        this.rotationSpeed =
            (
                0.35 +
                Math.random() * 0.25
            ) * 4;


        this.flip =
            Math.random() *
            Math.PI * 2;


        // =====================
        // 倍率保存
        // =====================

        this.power =
            Game.power;

    }


    update(){

        const dt =
            Game.deltaTime;


        this.rotation +=
            this.rotationSpeed *
            dt;


        if(!this.active){

            return;

        }


        // =====================
        // 移動
        // =====================

        this.x +=
            this.vx * dt;


        this.y +=
            this.vy * dt;


        this.vy +=
            0.8 * dt;


        // =====================================================
        // BOSS戦
        // =====================================================

        if(Game.bossWave){

            // =====================
            // 召喚隕石との判定
            // =====================

            for(
                let meteor of Game.bossMeteors
            ){

                if(!meteor.active){

                    continue;

                }


                const dx =
                    this.x -
                    meteor.x;


                const dy =
                    this.y -
                    meteor.y;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if(
                    distance <
                    meteor.radius +
                    this.radius
                ){

                    let damage = 10;


                    // =====================
                    // ボーナス
                    // =====================

                    if(Game.bonus){

                        damage =
                            20 *
                            this.power;


                        Game.bonus = false;

                    }

                    // =====================
// 第2形態デバフ
// 次の攻撃だけ半減
// =====================

if(Game.boss.nextAttackHalf){

    damage *= 0.5;

    Game.boss.nextAttackHalf = false;

}


                    // =====================
                    // 召喚隕石にダメージ
                    // =====================

                    meteor.damage(
                        damage
                    );


                    Sound.coinHit();


                    this.reset();


                    Game.state =
                        "GAME";


                    return;

                }

            }


            // =================================================
// 月への攻撃
// =================================================

if(
    Game.boss &&
    Game.boss.active &&
    (
        Game.boss.attackState === "CHANCE" ||
        Game.boss.phase === 2
    )
){

    const dx =
        this.x -
        Game.boss.x;


    const dy =
        this.y -
        Game.boss.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if(
        distance <
        Game.boss.radius +
        this.radius
    ){

        let damage = 10;


        // =====================
        // ボーナス
        // =====================

        if(Game.bonus){

            damage =
                20 *
                this.power;


            Game.bonus = false;

        }


        // =====================
        // 第2形態デバフ
        // 次の攻撃だけ半減
        // =====================

        if(Game.boss.nextAttackHalf){

            damage *= 0.5;

            Game.boss.nextAttackHalf = false;

        }


        // =====================
        // 月にダメージ
        // =====================

        Game.boss.damage(
            damage
        );


        Sound.coinHit();


        this.reset();


        Game.state =
            "GAME";


        return;

    }

}


            // =====================
            // BOSS戦では
            // Game.meteorを絶対に参照しない
            // =====================

            if(this.y < -50){

                this.reset();

                Game.bonus = false;

                Game.power = 1;

                Game.state =
                    "GAME";

            }


            return;

        }


        // =====================================================
        // 通常戦
        // =====================================================

        const dx =
            this.x -
            Game.meteor.x;


        const dy =
            this.y -
            Game.meteor.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if(
            distance <
            Game.meteor.radius +
            this.radius
        ){

            let damage = 10;


            // =====================
            // ボーナス
            // =====================

            if(Game.bonus){

                damage =
                    20 *
                    this.power;


                Game.bonus = false;

            }


            // =====================
            // 通常隕石
            // =====================

            Game.meteor.damage(
                damage
            );


            Sound.coinHit();


            this.reset();


            Game.state =
                "GAME";


            return;

        }


        // =====================
        // 画面外
        // =====================

        if(this.y < -50){

            this.reset();

            Game.bonus = false;

            Game.power = 1;

            Game.state =
                "GAME";

        }

    }


    draw(ctx){

    // =====================
    // スロットチャージゲージ
    // =====================

    if(
        Game.state === "GAME" &&
        Game.bossPhase !== "WARNING"
    ){

        const barWidth = 70;
        const barHeight = 7;

        const rate =
            Math.max(
                0,
                Math.min(
                    1,
                    Game.slotCharge /
                    Game.slotChargeMax
                )
            );


        // =====================
        // ゲージ位置
        // =====================

        const barX = 400;
        const barY = 585;


        // 背景
        ctx.fillStyle =
            "rgba(0,0,0,0.75)";

        ctx.fillRect(
            barX - barWidth / 2,
            barY,
            barWidth,
            barHeight
        );


        // チャージ
        ctx.fillStyle =
            "#ffd83d";

        ctx.fillRect(
            barX - barWidth / 2,
            barY,
            barWidth * rate,
            barHeight
        );


        // 枠
        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 1;

        ctx.strokeRect(
            barX - barWidth / 2,
            barY,
            barWidth,
            barHeight
        );

    }


    // =====================
    // コイン描画
    // =====================

    ctx.save();


    ctx.translate(
        this.x,
        this.y
    );

        // =====================
        // 横回転
        // =====================

        const scaleX =
            Math.abs(
                Math.cos(
                    this.rotation
                )
            );


        ctx.scale(
            scaleX * this.scale,
            this.scale
        );


        // =====================
        // 厚み
        // =====================

        ctx.fillStyle =
            "#8b5a00";


        ctx.beginPath();

        ctx.ellipse(
            0,
            5,
            this.radius,
            this.radius * 0.85,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =====================
        // 表面
        // =====================

        const gold =
            ctx.createRadialGradient(
                -6,
                -6,
                2,
                0,
                0,
                this.radius
            );


        gold.addColorStop(
            0,
            "#e8c878"
        );


        gold.addColorStop(
            0.45,
            "#b88632"
        );


        gold.addColorStop(
            1,
            "#5c3a12"
        );


        ctx.fillStyle =
            gold;


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =====================
        // 縁
        // =====================

        ctx.strokeStyle =
            "#fff0a0";


        ctx.lineWidth = 2;

        ctx.stroke();


        ctx.strokeStyle =
            "#e6c46a";


        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            this.radius * 0.85,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        // =====================
        // 中央刻印
        // =====================

        ctx.fillStyle =
            "#6b4518";


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            this.radius * 0.3,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#f1d27a";


        ctx.lineWidth = 2;


        ctx.beginPath();

        ctx.moveTo(-5,0);

        ctx.lineTo(0,-7);

        ctx.lineTo(5,0);

        ctx.stroke();


        ctx.restore();

    }

}


/*
    Meteor
    waveBonusUI.js
*/


const WaveBonusUI = {


    timer:0,

    active:false,


    start(){

        if(!WaveBonus){
            return;
        }


        this.active=true;

        this.timer=180; // 3秒表示


    },



    update(){

        if(!this.active){
            return;
        }


        this.timer -= Game.deltaTime;


        if(this.timer <= 0){

            this.active=false;

        }


    },



    draw(ctx){


        if(!this.active){
            return;
        }



        ctx.save();



        // 背景

        ctx.fillStyle="rgba(0,0,0,0.65)";

        ctx.roundRect(
            120,
            420,
            560,
            170,
            20
        );

        ctx.fill();



        ctx.textAlign="center";



        ctx.fillStyle="white";

        ctx.font=
        "bold 28px sans-serif";


        ctx.fillText(
            "SPECIAL NUMBER",
            400,
            455
        );



        ctx.font=
        "22px sans-serif";



        // 緑

        ctx.fillStyle="#66ff99";

        ctx.fillText(
            "GREEN  "+WaveBonus.green+
            " : 隕石を押し返す",
            400,
            500
        );



        // 青

        ctx.fillStyle="#55aaff";

        ctx.fillText(
            "BLUE  "+WaveBonus.blue+
            " : スロット速度低下",
            400,
            535
        );



        // 黄

        ctx.fillStyle="#ffff66";

        ctx.fillText(
            "YELLOW  "+WaveBonus.yellow+
            " : 援軍強化UP",
            400,
            570
        );



        ctx.restore();



    }



};

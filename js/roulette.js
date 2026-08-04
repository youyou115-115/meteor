/*
    Meteor Ver0.5
    roulette.js
*/


const Roulette = {


    active:false,


    position:0,


    speed:30,


    result:1,


    stopTimer:0,



    values:[

        1,
        2,
        3,
        5,
        10

    ],





    start(){


        this.active = true;


        this.speed = 30;


    },





    update(){


    // 停止後の表示時間カウント

    if(this.stopTimer > 0){

        this.stopTimer--;

    }



    // 停止中なら回転処理なし

    if(!this.active){

        return;

    }



    // スロット回転

    this.position += this.speed;



    if(this.position > 100000){

        this.position = 0;

    }



},






    stop(){


        this.active = false;



        const index =

        Math.floor(

            this.position / 60

        )
        %
        this.values.length;



        this.result =

        this.values[index];



        this.stopTimer = 120;

        Game.power = this.result;


// 少し表示してから攻撃

setTimeout(()=>{


    // 残機チェック

    if(Game.coins.length <= 0){

        console.log("残機なし");

        return;

    }



    // 残機を消費

    Game.coins.pop();


    Game.coinCount =
    Game.coins.length;



    Game.state="THROW";


    Game.coin.throw();



},800);



        console.log(

            "POWER ×",

            this.result

        );



    },







    getColor(value){


        if(value === 10){

            return "#ffd700";

        }


        if(value === 5){

            return "#ff3300";

        }


        if(value === 3){

            return "#00cc66";

        }


        if(value === 2){

            return "#3399ff";

        }


        return "#aaaaaa";


    },








    draw(ctx){



        if(
            !this.active &&
            this.stopTimer <=0
        ){

            return;

        }





        const x = 400;

        const y = 470;






        ctx.save();






        // =====================
        // 筐体
        // =====================



        ctx.fillStyle="#080808";


        ctx.fillRect(

            x-120,

            y-150,

            240,

            300

        );





        // 外枠

        ctx.strokeStyle="#777";


        ctx.lineWidth=8;


        ctx.strokeRect(

            x-120,

            y-150,

            240,

            300

        );







        // ランプ風

        ctx.fillStyle="red";


        ctx.beginPath();


        ctx.arc(

            x,

            y-120,

            10,

            0,

            Math.PI*2

        );


        ctx.fill();







        // =====================
        // リール部分
        // =====================


        ctx.fillStyle="#222";


        ctx.fillRect(

            x-80,

            y-90,

            160,

            180

        );






        // 真ん中判定枠

        ctx.strokeStyle="orange";


        ctx.lineWidth=5;


        ctx.strokeRect(

            x-80,

            y-30,

            160,

            60

        );








        ctx.textAlign="center";

        ctx.textBaseline="middle";

        ctx.font="40px sans-serif";







        for(let i=-1;i<=1;i++){



            let index =

            Math.floor(

                this.position / 60

            )
            + i;





            index =

            ((index %

            this.values.length)

            +

            this.values.length)

            %

            this.values.length;





            const value =

            this.values[index];





            ctx.fillStyle =

            this.getColor(value);





            ctx.fillText(

                "×"+value,

                x,

                y+i*60

            );



        }








        ctx.restore();




    }


};
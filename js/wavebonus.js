/*
    Meteor
    waveBonus.js
*/


const WaveBonus = {


    green:null,
    blue:null,
    yellow:null,
   

    


    active:false,
     current:null,
     waitInput:false,


    message:"",
    timer:0,



    init(){

        this.green=null;
        this.blue=null;
        this.yellow=null;

        this.active=false;

        this.current=null;
        this.timer=0;

    },



    generate(){


        // 3種類の数字をランダム決定

        const numbers=[];


        while(numbers.length < 3){

            const n =
            Math.floor(
                Math.random()*9
            )+1;


            if(!numbers.includes(n)){

                numbers.push(n);

            }

        }



        this.green = numbers[0];

        this.blue = numbers[1];

        this.yellow = numbers[2];



        this.active=true;



        this.message =
`
SPECIAL BONUS

🟢 GREEN  : ${this.green}
🔵 BLUE   : ${this.blue}
🟡 YELLOW : ${this.yellow}


3つ揃えると効果発動！
`;



        this.timer=180; // 3秒


    },



    update(){

        if(this.timer>0){

            this.timer -= Game.deltaTime;

        }

    },



    draw(ctx){


        if(this.timer<=0){

            return;

        }



        ctx.save();



        ctx.fillStyle =
        "rgba(0,0,0,0.75)";


        ctx.fillRect(
            100,
            180,
            600,
            260
        );



        ctx.textAlign="center";

        ctx.textBaseline="middle";


        ctx.fillStyle="#ffffff";

        ctx.font=
        "bold 32px sans-serif";


        ctx.fillText(
            "SPECIAL BONUS",
            400,
            230
        );



        ctx.font=
        "bold 28px sans-serif";



        ctx.fillStyle="#66ff99";

        ctx.fillText(
            "🟢 GREEN  : "+this.green+
            "  隕石を押し返す",
            400,
            300
        );



        ctx.fillStyle="#55aaff";

        ctx.fillText(
            "🔵 BLUE   : "+this.blue+
            "  スロット減速",
            400,
            350
        );



        ctx.fillStyle="#ffff66";

        ctx.fillText(
            "🟡 YELLOW : "+this.yellow+
            "  援軍強化",
            400,
            400
        );



        ctx.restore();

    }



};

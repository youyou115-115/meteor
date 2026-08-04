/*
    Meteor Ver1.1
    roulette.js
*/


const Roulette = {


    grid:[],


    active:false,

    

     mode:"IDLE",


    stopTimer:0,


    result:1,


    phase:0,

    resultTimer:0,


    phaseTimer:0,
    scrollSpeed:20,

offset:[0,0,0],

stopped:[false,false,false],

    visible:false,

    reels:[
    [],
    [],
    []
],

reelPos:[
    0,
    0,
    0
],

reelSpeed:[
    0,
    0,
    0
],

   


    highlightLines:[],
    targetNumber:null,




    init(){


        this.reels=[];


for(let x=0;x<3;x++){

    this.reels[x]=[];


    for(let i=0;i<30;i++){

        this.reels[x].push(
            this.randomNumber()
        );

    }

}

    },



    randomNumber(){


        return Math.floor(Math.random()*9)+1;


    },





    start(){

    if(this.active){
        return;
    }


    this.mode="SPIN";

     this.visible=true;

    this.active=true;

        // ★追加
    this.stopped=[
        false,
        false,
        false
    ];


    // ★追加
    this.offset=[
        0,
        0,
        0
    ];

    this.reelPos=[
    0,
    0,
    0
];


this.reelSpeed=[
    0.01,
    0.01,
    0.01
];

    this.phase=0;


    this.highlightLines=[];



},





    update(){

if(this.resultTimer > 0){

    this.resultTimer--;

    if(this.resultTimer <= 0){

        Game.coin.throw();

        this.visible=false;

        this.mode="IDLE";

    }

    return;

}

        if(this.stopTimer>0){


            this.stopTimer--;

        }
        
           if(this.mode !== "SPIN"){

        return;

    }



        if(!this.active){

            return;

        }




        // =====================
// リール回転
// =====================

for(let x=0;x<3;x++){


    if(this.stopped[x]){

        continue;

    }


    this.reelPos[x] +=
    this.reelSpeed[x] *
    Game.deltaTime;



    if(this.reelPos[x] >= 1){


        this.reelPos[x] -= 1;


        // リールを進める

        this.reels[x].push(
            this.randomNumber()
        );


        this.reels[x].shift();


    }


}


        // 停止演出


        if(this.phaseTimer>0){


    this.phaseTimer -= Game.deltaTime;


    if(this.phaseTimer<=0 && this.phase===3){

        this.finish();

    }


    return;

}


    },







   stop(){


    if(!this.active){

        return;

    }



    // 左

    if(this.phase===0){

    this.stopColumn(0);

    this.stopped[0]=true;


    const pos =
    Math.floor(
        this.reelPos[0] *
        this.reels[0].length
    );


    this.targetNumber =
    this.reels[0][
        pos
    ];


    this.phase=1;

    return;

}



    if(this.phase===1){

    this.stopColumn(1);

    this.stopped[1]=true;


    // 40%で左に合わせる

    if(Math.random() < 0.4){


        const pos =
        Math.floor(
            this.reelPos[1] *
            this.reels[1].length
        );


        this.reels[1][pos] =
        this.targetNumber;


    }


    this.phase=2;

    return;

}



    // 右

    if(this.phase===2){

    this.stopColumn(2);


    // 20%で揃える

    if(Math.random() < 0.2){


        const pos =
        Math.floor(
            this.reelPos[2] *
            this.reels[2].length
        );


        this.reels[2][pos] =
        this.targetNumber;


    }


    this.phase=3;

    this.phaseTimer=20;

    return;

}


},






   stopColumn(column){


    this.stopped[column]=true;



    // =====================
    // リール補正
    // =====================

    let rate = 0;


    if(column === 0){

        // 左リール 50%
        rate = 0.5;

    }
    else if(column === 1){

        // 中央リール 40%
        rate = 0.4;

    }
    else if(column === 2){

        // 右リール 30%
        rate = 0.3;

    }



    if(Math.random() < rate){


        const pos =
        Math.floor(
            this.reelPos[column] *
            this.reels[column].length
        );


        // 表示されている数字
        const value =
        this.reels[column][
            pos
        ];



        // 同じ数字を次の位置にも配置

        this.reels[column][
            (pos+1) %
            this.reels[column].length
        ] = value;



    }



},





    finish(){

        const resultGrid=[];


for(let y=0;y<3;y++){

    for(let x=0;x<3;x++){


        const pos =
Math.floor(this.reelPos[x] * this.reels[x].length);


        let value =
this.reels[x][
(pos+y) % this.reels[x].length
];


if(value === undefined){

    value = this.randomNumber();

}


resultGrid.push(value);


    }

}



        this.result=1;


        this.highlightLines=[];




        const lines=[



            [0,1,2],

            [3,4,5],

            [6,7,8],



            [0,3,6],

            [1,4,7],

            [2,5,8],



            [0,4,8],

            [2,4,6]


        ];





        for(let line of lines){



            const a=resultGrid[line[0]];

const b=resultGrid[line[1]];

const c=resultGrid[line[2]];



            if(
                a===b &&
                b===c
            ){



                this.result =
                Math.max(
                    this.result,
                    a
                );



                this.highlightLines.push(
                    line
                );


            }


        }



        Game.power=this.result;



       this.stopTimer=60;


this.mode="RESULT";


this.active=false;


// ルーレット終了
this.mode="RESULT";

this.active=false;


// コイン投げ待機
Game.state="READY";

// 結果表示時間
this.resultTimer = 60;

Game.power = this.result;


// 2以上が揃った時だけ強化
if(this.result > 1){

    Game.bonus = true;

}
else{

    Game.bonus = false;

}



    },







    draw(ctx){

        if(!this.visible){

        return;

    }



        const startX=295;
        const startY=220;
        const size=70;




        for(let y=0;y<3;y++){


            for(let x=0;x<3;x++){



                const index =
                y*3+x;



                let glow=false;




                for(let line of this.highlightLines){


                    if(
                        line.includes(index)
                    ){

                        glow=true;

                    }


                }





                if(glow){


                    ctx.fillStyle=
                    "orange";


                }
                else{


                    ctx.fillStyle=
                    "rgba(0,0,0,0.7)";


                }




                ctx.fillRect(

                    startX+x*size,

                    startY+y*size,

                    size-5,

                    size-5

                );





                ctx.strokeStyle="white";


                ctx.strokeRect(

                    startX+x*size,

                    startY+y*size,

                    size-5,

                    size-5

                );





                ctx.fillStyle="white";


                ctx.font="45px sans-serif";


                ctx.textAlign="center";


                ctx.textBaseline="middle";



                ctx.save();


ctx.beginPath();

ctx.rect(
    startX+x*size,
    startY+y*size,
    size-5,
    size-5
);

ctx.clip();



const pos =
Math.floor(
    this.reelPos[x] *
    this.reels[x].length
);


let value =
this.reels[x][
(pos+y) % this.reels[x].length
];


if(value === undefined){

    value = this.randomNumber();

}



ctx.fillText(

    value,

    startX+x*size+32,

    startY+y*size+32

);


ctx.restore();



            }


        }




        if(this.stopTimer>0){



            ctx.fillStyle="yellow";


            ctx.font="55px sans-serif";


            ctx.textAlign="center";


            ctx.fillText(

                "POWER ×"+this.result,

                400,

                120

            );


        }



    }


};
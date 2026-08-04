/*
    Meteor Ver0.4
    debris.js
*/


class Debris{


    constructor(x,y){


        this.x = x;
        this.y = y;


        this.vx =
        (Math.random()-0.5)*10;


        this.vy =
        -Math.random()*8;


        this.size =
        4 + Math.random()*8;


        this.life = 90;


        this.rotation =
        Math.random()*Math.PI*2;


    }



    update(){


        this.x += this.vx;

        this.y += this.vy;


        this.vy += 0.25;


        this.life--;


        this.rotation += 0.1;


    }



    draw(ctx){



        if(this.life <= 0){

            return;

        }



        ctx.save();



        ctx.translate(
            this.x,
            this.y
        );


        ctx.rotate(
            this.rotation
        );



        // 炎

        ctx.fillStyle=
        "rgba(255,80,20,0.8)";


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            this.size*1.5,
            0,
            Math.PI*2
        );

        ctx.fill();




        // 岩

        ctx.fillStyle="#444";


        ctx.fillRect(

            -this.size/2,
            -this.size/2,

            this.size,
            this.size

        );



        ctx.restore();


    }



}
/*
    Meteor Ver0.1
    bullet.js
*/


class Bullet{


constructor(x,y,angle){

    this.x=x;
    this.y=y;

    this.angle=angle;

    this.speed=15;

    this.vx =
    Math.cos(angle)*this.speed;


    this.vy =
    Math.sin(angle)*this.speed;


    this.active=true;

}



update(){


    this.x += this.vx;

    this.y += this.vy;



    const dx =
    this.x-Game.meteor.x;


    const dy =
    this.y-Game.meteor.y;


    const d =
    Math.sqrt(
        dx*dx+
        dy*dy
    );


    if(d<Game.meteor.radius){


        Game.meteor.damage(5);

        Sound.planeShot();

        this.active=false;

    }


}



draw(ctx){


    ctx.fillStyle="#ffff66";


    ctx.fillRect(
        this.x,
        this.y-2,
        12,
        4
    );


}



}
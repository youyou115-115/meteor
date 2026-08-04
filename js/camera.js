/*
    Meteor
    camera.js
*/


const Camera = {


    shake:0,


    update(){

    if(this.shake > 0){

        this.shake -= 1;

        if(this.shake < 0){

            this.shake = 0;

        }

    }

},



    hitShake(power){

        this.shake = power;

    },



    getX(){

        return (
            Math.random() - 0.5
        ) * this.shake;

    },



    getY(){

        return (
            Math.random() - 0.5
        ) * this.shake;

    }



};
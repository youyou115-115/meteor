const Sound = {


ctx:null,

master:null,

bgmTimer:null,

star(){

    this.beep(
        880,
        0.15,
        "triangle"
    );

    setTimeout(()=>{

        this.beep(
            1320,
            0.25,
            "triangle"
        );

    },100);

},
meteor(){

    if(!this.ctx){
        return;
    }


    const now=this.ctx.currentTime;


    // 爆発低音

    const osc =
    this.ctx.createOscillator();


    const gain =
    this.ctx.createGain();


    osc.type="sawtooth";


    osc.frequency.setValueAtTime(
        120,
        now
    );


    osc.frequency.exponentialRampToValueAtTime(
        30,
        now+0.5
    );


    gain.gain.setValueAtTime(
        0.7,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.5
    );


    osc.connect(gain);

    gain.connect(this.master);


    osc.start(now);

    osc.stop(now+0.5);



},

miss(){

    this.beep(
        180,
        0.18,
        "square"
    );

},
seven(){

    // 上昇するファンファーレ風

    this.beep(
        784,
        0.12,
        "triangle"
    );

    setTimeout(()=>{

        this.beep(
            988,
            0.12,
            "triangle"
        );

    },120);

    setTimeout(()=>{

        this.beep(
            1319,
            0.22,
            "triangle"
        );

    },240);

},
nine(){

    this.beep(
        440,
        0.08,
        "triangle"
    );

    setTimeout(()=>{

        this.beep(
            660,
            0.10,
            "triangle"
        );

    },90);

    setTimeout(()=>{

        this.beep(
            990,
            0.15,
            "sawtooth"
        );

    },180);

},

success(power){

   const base = 700 + power * 35;

    this.beep(base,0.06,"triangle");

    setTimeout(()=>{
        this.beep(base+120,0.08,"triangle");
    },60);

    setTimeout(()=>{
        this.beep(base+260,0.14,"triangle");
    },120);

},

hit(){

    this.beep(
        600,
        0.12,
        "square"
    );

},

stop(level=1){

    if(!this.ctx){
        return;
    }


    const now =
    this.ctx.currentTime;


    // 停止段階で音量・低さ変更

    let low = 180;
    let volume = 0.4;


    if(level===2){

        low = 140;
        volume = 0.5;

    }
    else if(level===3){

        low = 90;
        volume = 0.65;

    }



    // ノイズ（ガシャ）

    const bufferSize =
    this.ctx.sampleRate * 0.08;


    const buffer =
    this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate
    );


    const data =
    buffer.getChannelData(0);


    for(let i=0;i<bufferSize;i++){

        data[i] =
        (Math.random()*2-1)
        *
        (1-i/bufferSize);

    }


    const noise =
    this.ctx.createBufferSource();


    const noiseGain =
    this.ctx.createGain();


    noise.buffer=buffer;


    noiseGain.gain.setValueAtTime(
        volume,
        now
    );


    noiseGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.08
    );


    noise.connect(noiseGain);

    noiseGain.connect(this.master);


    noise.start(now);



    // 低音インパクト

    const osc =
    this.ctx.createOscillator();


    const gain =
    this.ctx.createGain();


    osc.type="square";


    osc.frequency.setValueAtTime(
        low,
        now
    );


    osc.frequency.exponentialRampToValueAtTime(
        40,
        now+0.15
    );


    gain.gain.setValueAtTime(
        volume,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.15
    );


    osc.connect(gain);
    gain.connect(this.master);


    osc.start(now);

    osc.stop(now+0.16);

},


init(){

    this.ctx =
    new AudioContext();


    this.master =
    this.ctx.createGain();

    this.master.gain.value=0.3;

    this.master.connect(
        this.ctx.destination
    );

},



startTitleBGM(){

    if(!this.ctx){
        return;
    }


    if(this.bgmTimer){
        return;
    }


    const start = ()=>{


        let step=0;


        const notes=[
            146.8,
            174.6,
            220,
            261.6
        ];


        this.bgmTimer=setInterval(()=>{


            this.beep(
                notes[step%4],
                0.5,
                "sawtooth"
            );


            step++;


        },500);


    };



    if(this.ctx.state==="suspended"){


        this.ctx.resume()
        .then(()=>{

            start();

        });


    }
    else{


        start();


    }


},




stopBGM(){

    clearInterval(
        this.bgmTimer
    );

    this.bgmTimer=null;

},




beep(freq,time,type="square"){


    if(!this.ctx){
        return;
    }


    const osc =
    this.ctx.createOscillator();


    const gain =
    this.ctx.createGain();


    osc.type=type;


    osc.frequency.value=freq;


    gain.gain.setValueAtTime(
        0.001,
        this.ctx.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.3,
        this.ctx.currentTime+0.02
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime+time
    );


    osc.connect(gain);

    gain.connect(this.master);


    osc.start();

    osc.stop(
        this.ctx.currentTime+time
    );

}


};
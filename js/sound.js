const Sound = {


ctx:null,

master:null,

bgmTimer:null,

battleTimer:null,
battleStep:0,
battleTimer:null,
battleStep:0,
battleBeat:0,

battleKick(){

    if(!this.ctx)return;


    const now=this.ctx.currentTime;


    const osc =
    this.ctx.createOscillator();


    const gain =
    this.ctx.createGain();


    osc.type="sine";


    osc.frequency.setValueAtTime(
        90,
        now
    );


    osc.frequency.exponentialRampToValueAtTime(
        35,
        now+0.15
    );


    gain.gain.setValueAtTime(
        0.8,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.15
    );


    osc.connect(gain);
    gain.connect(this.master);


    osc.start(now);

    osc.stop(now+0.15);

},

battleAlarm(){

    if(!this.ctx)return;


    this.beep(
    bassNotes[step],
    0.45,
    "triangle"
);


    setTimeout(()=>{

        this.beep(
            120,
            0.3,
            "sawtooth"
        );

    },250);

},

startBattleBGM(){

    if(!this.ctx){
        return;
    }


    if(this.battleTimer){
        return;
    }


    if(this.ctx.state==="suspended"){

        this.ctx.resume();

    }



    const bassNotes=[
        55,55,65,55,
        55,73,65,55
    ];



    const melody=[
        220,
        0,
        261,
        0,
        196,
        0,
        174,
        0
    ];



    this.battleStep=0;



    this.battleTimer=setInterval(()=>{


        const step=this.battleStep%8;



        //====================
        // ドラム
        //====================

     this.battleKick();



        //====================
        // ベース
        //====================

        this.beep(
            bassNotes[step],
            0.25,
            "sawtooth"
        );



        //====================
        // SFシンセ
        //====================

        this.beep(
    melody[step],
    0.35,
    "sine"
);



        this.battleStep++;


    },200);

    this.battleBeat++;


if(this.battleBeat % 16 === 0){

    this.battleAlarm();

}


},

stopBattleBGM(){

    if(this.battleTimer){

        clearInterval(
            this.battleTimer
        );

        this.battleTimer=null;

    }

},

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

meteorCharge(){

    if(!this.ctx){
        return;
    }


    const now =
    this.ctx.currentTime;


    const osc =
    this.ctx.createOscillator();


    const gain =
    this.ctx.createGain();


    osc.type = "sawtooth";


    // 低い唸りから上昇
    osc.frequency.setValueAtTime(
        80,
        now
    );


    osc.frequency.exponentialRampToValueAtTime(
        180,
        now + 1.5
    );


    gain.gain.setValueAtTime(
        0.05,
        now
    );


    gain.gain.linearRampToValueAtTime(
        0.35,
        now + 1.2
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now + 2
    );


    osc.connect(gain);

    gain.connect(this.master);


    osc.start(now);

    osc.stop(
        now + 2
    );

},

meteorBreak(){

    if(!this.ctx)return;

    const now=this.ctx.currentTime;


    //====================
    // 爆発瞬間（衝撃）
    //====================

    const bufferSize =
    this.ctx.sampleRate * 0.2;


    const buffer =
    this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate
    );


    const data =
    buffer.getChannelData(0);


    for(let i=0;i<bufferSize;i++){

        const decay =
        1 - i / bufferSize;


        data[i] =
        (Math.random()*2-1)
        *
        decay
        *
        decay;

    }


    const noise =
    this.ctx.createBufferSource();


    const noiseGain =
    this.ctx.createGain();


    noise.buffer=buffer;


    noiseGain.gain.setValueAtTime(
        1.0,
        now
    );


    noiseGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.2
    );


    noise.connect(noiseGain);
    noiseGain.connect(this.master);


    noise.start(now);



    //====================
    // ドカーン低音
    //====================

    const boom =
    this.ctx.createOscillator();


    const boomGain =
    this.ctx.createGain();


    boom.type="sine";


    boom.frequency.setValueAtTime(
        70,
        now
    );


    boom.frequency.exponentialRampToValueAtTime(
        20,
        now+0.8
    );


    boomGain.gain.setValueAtTime(
        1.2,
        now
    );


    boomGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.8
    );


    boom.connect(boomGain);
    boomGain.connect(this.master);


    boom.start(now);

    boom.stop(now+0.8);



    //====================
    // 低い余韻
    //====================

    const tail =
    this.ctx.createOscillator();


    const tailGain =
    this.ctx.createGain();


    tail.type="triangle";


    tail.frequency.setValueAtTime(
        90,
        now
    );


    tail.frequency.exponentialRampToValueAtTime(
        35,
        now+1.5
    );


    tailGain.gain.setValueAtTime(
        0.5,
        now
    );


    tailGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+1.5
    );


    tail.connect(tailGain);
    tailGain.connect(this.master);


    tail.start(now);

    tail.stop(now+1.5);

},
coinHit(){

    if(!this.ctx){
        return;
    }


    const now=this.ctx.currentTime;


    // =====================
    // 重い衝撃音
    // =====================

    const osc =
    this.ctx.createOscillator();

    const gain =
    this.ctx.createGain();


    osc.type="square";


    osc.frequency.setValueAtTime(
        160,
        now
    );


    osc.frequency.exponentialRampToValueAtTime(
        50,
        now+0.18
    );


    gain.gain.setValueAtTime(
        0.7,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.18
    );


    osc.connect(gain);
    gain.connect(this.master);


    osc.start(now);
    osc.stop(now+0.18);



    // =====================
    // 金属の響き
    // =====================

    const osc2 =
    this.ctx.createOscillator();


    const gain2 =
    this.ctx.createGain();


    osc2.type="triangle";


    osc2.frequency.setValueAtTime(
        320,
        now
    );


    osc2.frequency.exponentialRampToValueAtTime(
        120,
        now+0.25
    );


    gain2.gain.setValueAtTime(
        0.35,
        now
    );


    gain2.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.25
    );


    osc2.connect(gain2);
    gain2.connect(this.master);


    osc2.start(now);
    osc2.stop(now+0.25);

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
planeCrash(){

    if(!this.ctx)return;


    const now=this.ctx.currentTime;


    const osc =
    this.ctx.createOscillator();


    const gain =
    this.ctx.createGain();


    osc.type="sawtooth";


    osc.frequency.setValueAtTime(
        300,
        now
    );


    osc.frequency.exponentialRampToValueAtTime(
        60,
        now+0.4
    );


    gain.gain.setValueAtTime(
        0.5,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.4
    );


    osc.connect(gain);

    gain.connect(this.master);


    osc.start(now);

    osc.stop(now+0.4);

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
    0.15,
    this.ctx.currentTime+0.05
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

},

planeShot(){

    if(!this.ctx){
        return;
    }


    const now =
    this.ctx.currentTime;


    const osc =
    this.ctx.createOscillator();


    const gain =
    this.ctx.createGain();


    osc.type="square";


    osc.frequency.setValueAtTime(
        900,
        now
    );


    osc.frequency.exponentialRampToValueAtTime(
        300,
        now+0.08
    );


    gain.gain.setValueAtTime(
        0.15,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.08
    );


    osc.connect(gain);

    gain.connect(this.master);


    osc.start(now);

    osc.stop(now+0.1);

},
missile(){

    if(!this.ctx){
        return;
    }


    const now =
    this.ctx.currentTime;


    // 発射音（上昇するSFレーザー系）

    const osc =
    this.ctx.createOscillator();


    const gain =
    this.ctx.createGain();


    osc.type="sawtooth";


    osc.frequency.setValueAtTime(
        180,
        now
    );


    osc.frequency.exponentialRampToValueAtTime(
        900,
        now+0.15
    );


    gain.gain.setValueAtTime(
        0.35,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.2
    );


    osc.connect(gain);
    gain.connect(this.master);


    osc.start(now);

    osc.stop(now+0.2);


},

explosion(){

    if(!this.ctx){
        return;
    }


    const now =
    this.ctx.currentTime;


    // 爆発ノイズ

    const bufferSize =
    this.ctx.sampleRate * 0.3;


    const buffer =
    this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate
    );


    const data =
    buffer.getChannelData(0);


    for(let i=0;i<bufferSize;i++){

        const decay =
        1-i/bufferSize;


        data[i] =
        (Math.random()*2-1)
        *
        decay;

    }


    const noise =
    this.ctx.createBufferSource();


    const gain =
    this.ctx.createGain();


    noise.buffer=buffer;


    gain.gain.setValueAtTime(
        1,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.3
    );


    noise.connect(gain);
    gain.connect(this.master);


    noise.start(now);



    // 重低音

    const boom =
    this.ctx.createOscillator();


    const boomGain =
    this.ctx.createGain();


    boom.type="sine";


    boom.frequency.setValueAtTime(
        90,
        now
    );


    boom.frequency.exponentialRampToValueAtTime(
        25,
        now+0.5
    );


    boomGain.gain.setValueAtTime(
        0.8,
        now
    );


    boomGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.5
    );


    boom.connect(boomGain);
    boomGain.connect(this.master);


    boom.start(now);
    boom.stop(now+0.5);

},
meteorHit(){

    if(!this.ctx){
        return;
    }


    const now =
    this.ctx.currentTime;



    // =====================
    // 衝撃ノイズ
    // =====================

    const bufferSize =
    this.ctx.sampleRate * 0.25;


    const buffer =
    this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate
    );


    const data =
    buffer.getChannelData(0);


    for(let i=0;i<bufferSize;i++){

        const decay =
        1 - i/bufferSize;


        data[i] =
        (Math.random()*2-1)
        *
        decay;

    }


    const noise =
    this.ctx.createBufferSource();


    const noiseGain =
    this.ctx.createGain();


    noise.buffer=buffer;


    noiseGain.gain.setValueAtTime(
        1.2,
        now
    );


    noiseGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.25
    );


    noise.connect(noiseGain);

    noiseGain.connect(this.master);


    noise.start(now);



    // =====================
    // 重低音インパクト
    // =====================

    const boom =
    this.ctx.createOscillator();


    const boomGain =
    this.ctx.createGain();


    boom.type="sine";


    boom.frequency.setValueAtTime(
        55,
        now
    );


    boom.frequency.exponentialRampToValueAtTime(
        18,
        now+0.6
    );


    boomGain.gain.setValueAtTime(
        1.5,
        now
    );


    boomGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.8
    );


    boom.connect(boomGain);

    boomGain.connect(this.master);


    boom.start(now);

    boom.stop(now+0.8);



    // =====================
    // 金属衝撃音
    // =====================

    const metal =
    this.ctx.createOscillator();


    const metalGain =
    this.ctx.createGain();


    metal.type="triangle";


    metal.frequency.setValueAtTime(
        400,
        now
    );


    metal.frequency.exponentialRampToValueAtTime(
        80,
        now+0.3
    );


    metalGain.gain.setValueAtTime(
        0.5,
        now
    );


    metalGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.3
    );


    metal.connect(metalGain);

    metalGain.connect(this.master);


    metal.start(now);

    metal.stop(now+0.35);


},
gameOver(){

    if(!this.ctx){
        return;
    }


    const now =
    this.ctx.currentTime;



    // =====================
    // 衝突直前の低周波
    // =====================

    const rumble =
    this.ctx.createOscillator();


    const rumbleGain =
    this.ctx.createGain();


    rumble.type="sawtooth";


    rumble.frequency.setValueAtTime(
        80,
        now
    );


    rumble.frequency.exponentialRampToValueAtTime(
        25,
        now+1.5
    );


    rumbleGain.gain.setValueAtTime(
        0.6,
        now
    );


    rumbleGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+1.5
    );


    rumble.connect(rumbleGain);
    rumbleGain.connect(this.master);


    rumble.start(now);
    rumble.stop(now+1.5);




    // =====================
    // 爆発インパクト
    // =====================

    const bufferSize =
    this.ctx.sampleRate*0.5;


    const buffer =
    this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate
    );


    const data =
    buffer.getChannelData(0);



    for(let i=0;i<bufferSize;i++){

        const decay =
        1-i/bufferSize;


        data[i] =
        (
        Math.random()*2-1
        )
        *
        decay;

    }



    const noise =
    this.ctx.createBufferSource();


    const noiseGain =
    this.ctx.createGain();


    noise.buffer=buffer;


    noiseGain.gain.setValueAtTime(
        1,
        now+0.15
    );


    noiseGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+0.8
    );


    noise.connect(noiseGain);
    noiseGain.connect(this.master);


    noise.start(now+0.15);




    // =====================
    // ドォン低音
    // =====================

    const boom =
    this.ctx.createOscillator();


    const boomGain =
    this.ctx.createGain();


    boom.type="sine";


    boom.frequency.setValueAtTime(
        90,
        now+0.15
    );


    boom.frequency.exponentialRampToValueAtTime(
        25,
        now+1
    );


    boomGain.gain.setValueAtTime(
        1,
        now+0.15
    );


    boomGain.gain.exponentialRampToValueAtTime(
        0.01,
        now+1
    );


    boom.connect(boomGain);
    boomGain.connect(this.master);


    boom.start(now+0.15);
    boom.stop(now+1);



    // =====================
    // 警報っぽい金属音
    // =====================

    setTimeout(()=>{

        this.beep(
            220,
            0.4,
            "square"
        );

    },600);


},


};
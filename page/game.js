// JAVASCRIPT CODE //
var firebaseConfig = {
        apiKey: "AIzaSyBF7U58Q_1T0ZeSsoK8mAS3A32ulNXQ600",
        authDomain: "uas-project-a1325.firebaseapp.com",
        databaseURL: "https://uas-project-a1325.firebaseio.com",
        projectId: "uas-project-a1325",
        storageBucket: "uas-project-a1325.appspot.com",
        messagingSenderId: "120290898498",
        appId: "1:120290898498:web:033a8c09390268999773db",
        measurementId: "G-7Q0T26PPRS"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
      firebase.auth.Auth.Persistence.LOCAL;

const heli = document.getElementById('heliscue');
			var ctx = heli.getContext("2d");
			var mywid = window.innerWidth;
			var myhei = window.innerHeight;
			ctx.canvas.width= mywid;
			ctx.canvas.height = myhei;
var sethei = myhei/2;

let frames = 0;
const DEGREE = Math.PI/180;

const sprite1 = new Image();
sprite1.src = "img/sprite.png";

const sprite = new Image();
sprite.src = "img/heli_sprite11.png";

const HELIS = new Audio();
HELIS.src = "audio/sfx_heli2.wav";
//HELIS.play();
const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const DUAR = new Audio();
DUAR.src = "audio/sfx_meledak.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

//toogle 
var inp = 0;

console.log(inp);
//load best from db
//here update
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var curUser = firebase.auth().currentUser;
        var db = firebase.database().ref().child('users');
        db.orderByChild("id").equalTo(curUser.uid).on("value",function(snapshot){
            var snap = snapshot.val();
            var key = Object.keys(snap);
            var em = snap[key].email;
            var sc = snap[key].score;
            console.log("email: "+em);
            console.log("score: "+sc);
            localStorage.setItem("best", sc);
        });
    } else {
        console.log("Go Login");
    }
});

window.onload = function(){
			
			draw();
			window.addEventListener('resize',draw,false);
		
			console.log('masuk onload');
		}

const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}
const startBtn = {
    x : mywid/2.5,
    y : myhei/2,
    w : 83,
    h : 29
}
const backBtn = {
    x : 1,
    y : 1,
    w : 83,
    h : 29
}
console.log("btn x : ",startBtn.x);

console.log("btn y : ",startBtn.y);

heli.addEventListener("click",function(evt){
    let rect = heli.getBoundingClientRect();
    let clickX = evt.clientX - rect.left;
    let clickY = evt.clientY - rect.top;
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
     switch(state.current){
        case state.getReady:
            state.current = state.game;
           HELIS.play();

            
           if(clickX >= backBtn.x && clickX <= backBtn.x + backBtn.w && clickY >= backBtn.y && clickY <= backBtn.y + backBtn.h){
           
                window.location.href ="main.html";
            

            
        
        }
            break;
             case state.game:
            if(helikopter.y - helikopter.radius <= 0) return;
            helikopter.flap();
           HELIS.play();
            FLAP.play();


             
           if(clickX >= backBtn.x && clickX <= backBtn.x + backBtn.w && clickY >= backBtn.y && clickY <= backBtn.y + backBtn.h){

                window.location.href ="main.html";
          

        }
            break;
               case state.over:
            
                if(clickX >= backBtn.x && clickX <= backBtn.x + backBtn.w && clickY >= backBtn.y && clickY <= backBtn.y + backBtn.h){
                
                        window.location.href ="main.html";
                

                }
           

            // CHECK IF WE CLICK ON THE START BUTTON
               if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                helikopter.speedReset();
               score.reset();
              
                state.current = state.getReady;
            }
            break;
        }
    }else{
        alert("Go Online");
        window.location.href="../index.html";
    }
});
});

const bgound = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : myhei/1.7 ,
    
   draw : function(){
       ctx.drawImage(sprite1, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
       ctx.drawImage(sprite1, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
    
}

const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: myhei/1.2,
    
    dx : 2,
    
    draw : function(){
        ctx.drawImage(sprite1, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(sprite1, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    
    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/3);
        }
    }
}
const helikopter = {
	animation : [
		{sX:0,sY:380},
		{sX:180,sY:380},
		{sX:360,sY:380},
		{sX:540,sY:380},
		{sX:720,sY:380},
		{sX:900,sY:380},
		{sX:1080,sY:380},
	],
	x : mywid/4,
	y : myhei/2,
	w : 176,
	h : 85, 
	//radius : 12,
	frame : 0,
	radius : 12,
    
    //frame : 0,
    rotation : 0,
    gravity : 0.25,
    jump : 4.6,
    speed : 0,
	draw : function(){
		let helikopter = this.animation[this.frame];
		ctx.save();
		ctx.translate(this.x,this.y);
		ctx.drawImage(sprite,helikopter.sX,helikopter.sY,this.w,this.h,- this.w/2, - this.h/2, this.w, this.h);
		ctx.restore();
	},
	  flap : function(){
        this.speed = - this.jump;
    },
	update: function(){

		        // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;
        
       
       if(state.current == state.getReady){
            this.y = myhei/2; // RESET POSITION OF THE helikopter AFTER GAME OVER
           this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            //pembatas dengan ground
           if(this.y + this.h/2 >= heli.height - fg.h){
              this.y = heli.height - fg.h - this.h/2;
                if(state.current == state.game){
                  state.current = state.over;
                  HELIS.pause();
                   DUAR.play();

                }
            }
            // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE helikopter IS FALLING DOWN
            if(this.speed >= this.jump){
              // this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
              // this.rotation = -25 * DEGREE;
            }
        }

	},
	 speedReset : function(){
        this.speed = 0;
    }
}

const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : mywid/4,
    y : myhei/4,
    
    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(sprite1, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : mywid/5,
    y : myhei/4,
    
    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(sprite1, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);   
        }
    }
    
}

const pipes = {
    position : [],
    
    top : {
        sX : 553,
        sY : 0
    },
    bottom:{
        sX : 502,
        sY : 0
    },
    
    w : 53,
    h : 400 ,
    gap : 150,
    maxYPos :-200,

    dx : 3,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
           // console.log('max Y Pos : ',maxYPos[i]);
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // top pipe
            ctx.drawImage(sprite1, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // bottom pipe
            ctx.drawImage(sprite1, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x :mywid,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let bottomPipeYPos = p.y + this.h + this.gap;
            
            // COLLISION DETECTION
            // TOP PIPE
            if(helikopter.x + helikopter.radius > p.x && helikopter.x - helikopter.radius < p.x + this.w && helikopter.y + helikopter.radius > p.y && helikopter.y - helikopter.radius < p.y + this.h){
                state.current = state.over;
                 HELIS.pause();
                DUAR.play();
            }
            // BOTTOM PIPE
            if(helikopter.x + helikopter.radius > p.x && helikopter.x - helikopter.radius < p.x + this.w && helikopter.y + helikopter.radius > bottomPipeYPos && helikopter.y - helikopter.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                 HELIS.pause();
                DUAR.play();
            }
            
            // MOVE THE PIPES TO THE LEFT
            p.x -= this.dx;
//here update            
           if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
                SCORE_S.play();
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        var curUser = firebase.auth().currentUser;
                        var db = firebase.database().ref().child('users');
                        db.orderByChild("id").equalTo(curUser.uid).on("value",function(snapshot){
                            var snap = snapshot.val();
                            var key = Object.keys(snap);
                            var sc = snap[key].score;
                            console.log("score: "+sc);
                            score.best = Math.max(score.value, sc);
                            localStorage.setItem("best", score.best);
                        });
                    } else {
                        score.best = Math.max(score.value, score.best);
                        localStorage.setItem("best", score.best);
                        console.log("Go Login");
                    }
                });
           }
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}
const backbutton = {
    sX : 100,
    sY : 340,
    w : 50,
    h : 50,
    x : 1,
    y : 1,
    
    draw: function(){
       
            ctx.drawImage(sprite1, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);   
        
    }
    
}
const score= {

    best : parseInt(localStorage.getItem("best"))||0,
    value : 0,
    lastIn : 0,
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";;
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, heli.width/2, 50);
            ctx.strokeText(this.value, heli.width/2, 50);
//here update            
        }else if(state.current == state.over){
            // SCORE VALUE
            if(inp == 0 ){
                firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    var curUser = firebase.auth().currentUser;
                    console.log("Email: "+curUser.email);
                    console.log("ID: "+curUser.uid);
                    console.log("best: " +parseInt(localStorage.getItem("best")));
                    firebase.database().ref('/users/'+curUser.uid).update({
                      email: curUser.email,
                      id: curUser.uid,
                      score: parseInt(localStorage.getItem("best"))
                    });
                    
                }else{
                    console.log("Offline game");
                }
            });
                inp=1;
            }
            
            ctx.font = "25px Teko";
            ctx.fillText(this.value, mywid/1.5, myhei/2.55);
            ctx.strokeText(this.value, mywid/1.5, myhei/2.55);
            // BEST SCORE
            ctx.fillText(this.best, mywid/1.5, myhei/2.15);
            ctx.strokeText(this.best, mywid/1.5, myhei/2.15);
        }
    },
    
    reset : function(){
        this.value = 0;
        this.inp = 0;
        console.log("Input after start: "+inp);
        }
    }

function draw(){
    ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0,0,mywid,myhei);	
   bgound.draw();
   pipes.draw();
   fg.draw();
   helikopter.draw();   
   getReady.draw();
   gameOver.draw();
    score.draw();
    backbutton.draw();
}

// UPDATE
function update(){
   
     pipes.update();
    fg.update();
     helikopter.update();
   // pipes.update();
    
}

// LOOP
function loop(){
	firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        update();
        draw();
        frames++;
        requestAnimationFrame(loop);
      } else {
        
        update();
        draw();
        frames++;
        requestAnimationFrame(loop);
      }
    });
}
loop();

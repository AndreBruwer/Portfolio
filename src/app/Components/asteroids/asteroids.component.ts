import { Component, OnInit } from '@angular/core';
import { gsap, TweenMax } from 'gsap';
// import * as TL from '../../../assets/js/TweenLite.js';
// import * as EasePack from '../../../assets/js/EasePack.js';

@Component({
  selector: 'app-asteroids',
  templateUrl: './asteroids.component.html',
  styleUrls: ['./asteroids.component.css']
})

export class AsteroidsComponent implements OnInit {
  width:number;
  height:number;
  name:string = "andre";
  canvas;
  canvas_container;
  ctx;
  game = false;
  rocks = [];
  animateGame:boolean = false;
  shuttle: Shuttle;
  lazarBolts = [];
  gsap;
  fps = 30;
  frame;
  stars = [];
  coin;
  score = {coins:0,rocks:0};
  eventSet = false;
  lives = 3;
  frameNr = 0;

  keysPressed = {};
  constructor() {}

  ngOnInit(): void {
    this.canvas_container = document.getElementById("asteroid-canvas-container");
    this.canvas = document.getElementById("asteroid-canvas");
    this.width = this.canvas_container.clientWidth;
    this.height = this.canvas_container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = (this.width*0.57);
    this.ctx = this.canvas.getContext('2d');

    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Click to Start game",this.canvas.width/2-120,this.canvas.height/2);
    this.eventSet = false;
  }
  ngOnDestroy(){
    document.onkeydown = null;
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  }







  resize(){
    return;
    this.width = this.canvas_container.clientWidth;
    this.height = this.canvas_container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = (this.width*0.6);
  }
  RotatePoint(cPoint, angle, point){
    let s = Math.sin(angle*Math.PI/180);
    let c = Math.cos(angle*Math.PI/180);
    // translate point back to origin:
    point.x -= cPoint.x;
    point.y -= cPoint.y;
    // rotate point
    let xnew = point.x * c - point.y * s;
    let ynew = point.x * s + point.y * c;
    // translate point back:
    point.x = xnew + cPoint.x;
    point.y = ynew + cPoint.y;
    return point;
  }
  GetDistance(point1, point2){
    return Math.sqrt(Math.pow(point2.x-point1.x,2) + Math.pow(point2.y - point1.y,2));
  }

  StartGame(){
    if(this.animateGame == false){
      this.lives = 3;
      this.score = {coins:0,rocks:0};
      this.rocks = [];
      this.stars = [];
      this.lazarBolts = [];
      this.animateGame = true;
      this.shuttle = new Shuttle(this.canvas.width/2, this.canvas.height/2, this.ctx, this.canvas);
      if(this.eventSet == false){
        document.addEventListener("keydown", e => {
          
          if(e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key == 'ArrowDown' || e.key == 'ArrowRight' || e.key == ' ' || e.key == 'Escape'){
            e.preventDefault();
            this.keysPressed[e.key] = true;

            // if(e.key == ' '){
            //   this.shoot();
            // }
            // else if (this.keysPressed['ArrowUp']) {
            //   if(e.key == 'ArrowLeft'){
            //     this.turnLeft();
            //   }
            //   if(e.key == 'ArrowRight'){
            //     this.turnRight();
            //   }
            //   this.accelerate();
            // }
            // else if (this.keysPressed['ArrowDown']) {
            //   if(e.key == 'ArrowLeft'){
            //     this.turnLeft();
            //   }
            //   if(e.key == 'ArrowRight'){
            //     this.turnRight();
            //   }
            //   this.decelerate();
            // }
            // else if (this.keysPressed['ArrowLeft']) {
            //   this.turnLeft();
            //   if(e.key == 'ArrowUp'){
            //     this.accelerate();
            //   }
            //   if(e.key == 'ArrowDown'){
            //     this.turnRight();
            //   }
            // }
            // else if (this.keysPressed['ArrowRight']) {
            //   this.turnRight();

            //   if(e.key == 'ArrowUp'){
            //     this.accelerate();
            //   }
            //   if(e.key == 'ArrowDown'){
            //     this.decelerate();
            //   }
            // }
          }
        });
        document.addEventListener('keyup', (e) => {
          delete this.keysPressed[e.key];
       });
        this.eventSet = true;
      }
      for(let i = 0; i< 100; i++){
        this.stars.push(new Star({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height},this.ctx));
      }
      this.coin = new Coin(Math.random()*this.canvas.width,Math.random()*this.canvas.height,this.ctx)

      

      for(let i = 0;i< 20;i++){
        this.rocks.push(new Rock(Math.random() * (40 + this.canvas.width) -20,Math.random() * (40 + this.canvas.height) -20,this.ctx,10,this.canvas,true));
      }
      this.drawFrame(1000/this.fps, this.ctx);
      this.canvas.scrollIntoView();
      this.canvas.focus();
    }
  }
  StopGame(){
    this.animateGame = false;
    
    clearTimeout(this.frame);
    
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Click to Start game",this.canvas.width/2-120,this.canvas.height/2);
    
  }

//controls
  turnLeft(){
    this.shuttle.angle = this.shuttle.angle + 360/24*-1;
    this.shuttle.turnShip();
  }
  turnRight(){
    this.shuttle.angle = this.shuttle.angle + 360/24;
    this.shuttle.turnShip();
  }
  accelerate(){
    this.shuttle.Accelerate();
  }
  decelerate(){
    this.shuttle.Decelerate();
  }
  shoot(){
    if(this.lazarBolts.length <= 20)
    this.lazarBolts.push(new LazarBolt(this.shuttle.core.x,this.shuttle.core.y,this.ctx,this.canvas, this.shuttle.angle,this.shuttle.momentum));
  }
  getDistance(point1, point2){
    return Math.sqrt(Math.pow((point2.x - point1.x),2) + Math.pow((point2.y - point1.y),2));
  }
  calculateCollisions(){
    //lazer and coin
    for(let i = 0; i < this.lazarBolts.length; i++){
      let bolt = this.lazarBolts[i];
      if(this.getDistance(bolt.core, this.coin.core) <= 10){
        this.lazarBolts.splice(i,1);
        this.coin = new Coin(Math.random()*this.canvas.width,Math.random()*this.canvas.height,this.ctx);
        this.score.coins++;
        break;
      }
    }  
    //lazer and rocks
    for(let i = 0; i < this.lazarBolts.length; i++){
      let bolt = this.lazarBolts[i];
      for(let j = 0; j< this.rocks.length;j++){
        if(this.getDistance(bolt.core,  this.rocks[j].core) <= this.rocks[j].radius){
          this.rocks.push(new Rock(Math.random() * (40 + this.canvas.width) -20,Math.random() * (40 + this.canvas.height) -20,this.ctx,10,this.canvas,true));
          this.rocks.splice(j,1);
          this.lazarBolts.splice(i,1);
          
          this.score.rocks++;
          break;
        }
      }
    }
    for(let i = 0;i< this.rocks.length ;i++){
      if(this.getDistance(this.shuttle.core,  this.rocks[i].core) <= this.rocks[i].radius+10){
        this.lives--;
        if(this.lives == 0){
          this.StopGame();
        }
        else{
          this.rocks.push(new Rock(Math.random() * (40 + this.canvas.width) -20,Math.random() * (40 + this.canvas.height) -20,this.ctx,10,this.canvas,true));
          this.rocks.splice(i,1);
        }
      }
    }
  }

  drawFrame(ms:number,ctx){
    ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    if(this.animateGame == true){
      this.frameNr++;
      if(this.frameNr == this.fps){
        this.frameNr = 0;
      }
      if(this.frameNr % 2 == 0){
        if(this.keysPressed['ArrowUp']){
          this.accelerate();
        }
        if(this.keysPressed['ArrowDown']){
          this.decelerate();
        }
        if(this.keysPressed['ArrowLeft']){
          this.turnLeft();
        }
        if(this.keysPressed['ArrowRight']){
          this.turnRight();
        }
      }
      if(this.frameNr % 3 == 0){
        if(this.keysPressed[' ']){
          this.shoot();
        }
      }
      //draw
      //starts
      this.stars.forEach(star =>{
        star.draw();
      })
      //shuttle
      this.shuttle.draw(this.lives);
      //projectiles
      for(let i = 0; i < this.lazarBolts.length; i++){
        let bolt = this.lazarBolts[i];
        if(bolt.core.x < -20 || bolt.core.x > this.canvas.width+20 || bolt.core.y < -20 || bolt.core.y > this.canvas.height+20){
          this.lazarBolts.splice(i,1);
          i--;
        }
        else{
          bolt.draw();
        }
      }
      //boulders
      this.coin.draw();
      //repeat
      
      for(let i = 0;i<this.rocks.length;i++){
        if(this.rocks[i].core.x > this.canvas.width+30 || this.rocks[i].core.x < -30 || this.rocks[i].core.y > this.canvas.height+30 || this.rocks[i].core.y < -30){
          this.rocks.splice(i,1);
          if(this.rocks.length <= 20)
            this.rocks.push(new Rock(Math.random() * (40 + this.canvas.width) -20,Math.random() * (40 + this.canvas.height) -20,this.ctx,10,this.canvas,true));
          i--;
        }
        else{
          this.rocks[i].draw();
        }
        
      }

      //colisions
      this.calculateCollisions();
      this.frame = setTimeout(() =>{this.drawFrame(ms,ctx)},ms)
    }
    else{
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.ctx.font = "30px Arial";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Click to Start game",this.canvas.width/2-120,this.canvas.height/2);
    }
  }
}

class Coin{
  core = {x:0,y:0};
  ctx;
  constructor(posX, posY, ctx){
    this.core = {x:posX, y:posY};
    this.ctx = ctx;
  }
  draw(){
    this.ctx.beginPath();
    this.ctx.arc(this.core.x, this.core.y, 10, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'gold';
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
  }
}
class Rock{
  core = {x:0,y:0};
  points = [];
  heights = [];
  flamePoints = [];
  angle = 0;
  rotationSpeed = 3;
  momentum = {x:0,y:0};
  ctx;
  radius;
  edges = 24;
  constructor(posX, posY,ctx, rad, canvas, randomPos:boolean){
    rad = rad-2 + Math.random() * 15;
    if(randomPos == true){
      let pos = Math.random();
      if(pos < 0.25){
        posY = -20;
      }else if(pos < 0.5){
        posX = -20;
      }else if(pos < 0.75){
        posY = canvas.height+20;
      }else{
        posX = canvas.width+20
      }
    }
    

    this.core = {x:posX,y:posY};
    this.ctx = ctx;
    this.radius = rad;
    this.rotationSpeed = Math.random()*5;
    if(Math.random() < 0.5){
      this.rotationSpeed *= -1;
    }

    this.momentum = {x:Math.random()*3, y:Math.random()*3};
    if(Math.random() < 0.5){
      this.momentum.x *= -1;
    }
    if(Math.random() < 0.5){
      this.momentum.y *= -1;
    }

    
    for(let i = 0;i<this.edges;i++){
      this.heights.push({x:0,y:-(rad + Math.random()*rad/3)})
      this.points.push(this.heights[i]);
      this.points[i] = this.RotatePoint({x:0,y:0} ,360/this.edges*i,this.points[i]);
    }
  }
  draw(){
    this.core = {x:this.core.x + this.momentum.x,y:this.core.y + this.momentum.y};
    this.angle += this.rotationSpeed;
    this.angle = this.angle % 360;
    for(let i = 0;i<this.points.length;i++){
      this.points[i] = {x:this.heights[i].x + this.core.x,y:this.heights[i].y + this.core.y}
      this.points[i] = this.RotatePoint({x:this.core.x,y:this.core.y} ,this.angle,this.points[i]);
    }

    this.ctx.beginPath();
    this.points.forEach(point => {
      this.ctx.lineTo(point.x,point.y);
    })
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
  }
  RotatePoint(cPoint, angle, point){
    let s = Math.sin(angle*Math.PI/180);
    let c = Math.cos(angle*Math.PI/180);
    // translate point back to origin:
    point.x -= cPoint.x;
    point.y -= cPoint.y;
    // rotate point
    let xnew = point.x * c - point.y * s;
    let ynew = point.x * s + point.y * c;
    // translate point back:
    point.x = xnew + cPoint.x;
    point.y = ynew + cPoint.y;
    
    return point;
  }
}
class Star{
  core = {x:0,y:0};
  ctx;
  constructor(core, ctx){
    this.core = core;
    this.ctx = ctx;
  }
  draw(){
    let chance = Math.floor(Math.random()*200);
    let outerSize = 7/2;
    let innerSize = 4/2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.core.x-outerSize, this.core.y);
    this.ctx.lineTo(this.core.x+outerSize, this.core.y);
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.core.x, this.core.y-outerSize);
    this.ctx.lineTo(this.core.x, this.core.y+outerSize);
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.core.x-innerSize, this.core.y-innerSize);
    this.ctx.lineTo(this.core.x+innerSize, this.core.y+innerSize);
    this.ctx.strokeStyle = 'yellow';
    if(chance <= 1)
      this.ctx.strokeStyle = 'red';
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.core.x-innerSize, this.core.y+innerSize);
    this.ctx.lineTo(this.core.x+innerSize, this.core.y-innerSize);
    this.ctx.strokeStyle = 'yellow';
    if(chance <= 1)
      this.ctx.strokeStyle = 'red';
    this.ctx.stroke();
  }
}
class LazarBolt{
  core = {x:0,y:0};
  points = [];
  angle = 0;
  momentum = {x:0,y:0};
  ctx;
  canvas;
  constructor(posX, posY, ctx, canvas, angle, shuttleMom){
    this.angle = angle;
    this.canvas = canvas;
    this.ctx = ctx;
    //core
    this.core = {x:posX,y:posY};

    this.points.push({x:this.core.x,y:this.core.y-5});
    this.points.push({x:this.core.x,y:this.core.y+5});
    this.momentum = {x:0,y:-5};
    this.momentum = this.RotatePoint({x:0,y:0},this.angle,this.momentum);
    this.momentum.x += shuttleMom.x;
    this.momentum.y += shuttleMom.y;
  }
  draw(){
    length = 10;
    this.core.x = this.core.x + this.momentum.x;
    this.core.y = this.core.y + this.momentum.y;
    this.points[0] = {x:this.core.x,y:this.core.y-(length/2)};
    this.points[1] = {x:this.core.x,y:this.core.y+(length/2)};

    for(let i = 0;i<this.points.length;i++){
      this.points[i] = this.RotatePoint(this.core,this.angle,this.points[i]);
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    this.ctx.lineTo(this.points[1].x, this.points[1].y);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'lime';
    this.ctx.stroke();
  }
  RotatePoint(cPoint, angle, point){
    let s = Math.sin(angle*Math.PI/180);
    let c = Math.cos(angle*Math.PI/180);
    // translate point back to origin:
    point.x -= cPoint.x;
    point.y -= cPoint.y;
    // rotate point
    let xnew = point.x * c - point.y * s;
    let ynew = point.x * s + point.y * c;
    // translate point back:
    point.x = xnew + cPoint.x;
    point.y = ynew + cPoint.y;
    
    return point;
  }
}
class Shuttle{
  core = {x:0,y:0};
  points = [];
  flamePoints = [];
  angle = 0;
  momentum = {x:0,y:0};
  ctx;
  canvas;
  flames:boolean = false;
  constructor(posX, posY, ctx, canvas){
    this.canvas = canvas;
    this.ctx = ctx;
    //core
    this.core = {x:posX,y:posY};

    this.points.push({x:this.core.x,y:this.core.y-20});
    this.points.push({x:this.core.x+10,y:this.core.y+10});
    this.points.push({x:this.core.x+3,y:this.core.y+10});
    this.points.push({x:this.core.x+3,y:this.core.y+15});
    this.points.push({x:this.core.x-3,y:this.core.y+15});
    this.points.push({x:this.core.x-3,y:this.core.y+10});
    this.points.push({x:this.core.x-10,y:this.core.y+10});
    this.points.push({x:this.core.x,y:this.core.y-20});

    this.flamePoints.push({x:this.core.x-5,y:this.core.y+18});
    this.flamePoints.push({x:this.core.x+5,y:this.core.y+18});
    this.flamePoints.push({x:this.core.x+7,y:this.core.y+25});
    this.flamePoints.push({x:this.core.x+2,y:this.core.y+21});
    this.flamePoints.push({x:this.core.x,y:this.core.y+25});
    this.flamePoints.push({x:this.core.x-2,y:this.core.y+21});
    this.flamePoints.push({x:this.core.x-7,y:this.core.y+25});
  }
  draw(lives:number){
    this.core.x = this.core.x + this.momentum.x;
    this.core.y = this.core.y + this.momentum.y;
    this.points[0] = {x:this.core.x,y:this.core.y-20};
    this.points[1] = {x:this.core.x+10,y:this.core.y+10};
    this.points[2] = {x:this.core.x+3,y:this.core.y+10};
    this.points[3] = {x:this.core.x+3,y:this.core.y+15};
    this.points[4] = {x:this.core.x-3,y:this.core.y+15};
    this.points[5] = {x:this.core.x-3,y:this.core.y+10};
    this.points[6] = {x:this.core.x-10,y:this.core.y+10};
    this.points[7] = {x:this.core.x,y:this.core.y-20};

    this.flamePoints[0] = {x:this.core.x-5,y:this.core.y+18};
    this.flamePoints[1] = {x:this.core.x+5,y:this.core.y+18};
    this.flamePoints[2] = {x:this.core.x+7,y:this.core.y+25};
    this.flamePoints[3] = {x:this.core.x+2,y:this.core.y+21};
    this.flamePoints[4] = {x:this.core.x,y:this.core.y+25};
    this.flamePoints[5] = {x:this.core.x-2,y:this.core.y+21};
    this.flamePoints[6] = {x:this.core.x-7,y:this.core.y+25};
    
    this.turnShip();


    this.ctx.beginPath();
    this.points.forEach(point => {
      this.ctx.lineTo(point.x,point.y);
    })
    this.ctx.fillStyle = 'white';
    this.ctx.fill();

    //flames
    if(this.flames == true){
      this.ctx.beginPath();
      this.flamePoints.forEach(point => {
        this.ctx.lineTo(point.x,point.y);
      })
      this.ctx.fillStyle = 'red';
      this.ctx.fill();
      this.flames = false;
    }
    //core
    this.ctx.beginPath();
    this.ctx.arc(this.core.x, this.core.y, 4, 0, 2 * Math.PI, false);
    if(lives == 3)
      this.ctx.fillStyle = 'blue';
    else if(lives == 2)
      this.ctx.fillStyle = 'yellow';
    else if(lives == 1)
      this.ctx.fillStyle = 'red';
    this.ctx.fill();
    
    //if outside of bounds
    let buffer = 15;
    if(this.core.x < -buffer){
      this.core.x = this.canvas.width+buffer;
    }
    else if(this.core.x > this.canvas.width+buffer){
      this.core.x = -buffer
    }
    if(this.core.y < -buffer){
      this.core.y = this.canvas.height+buffer;
    }
    else if(this.core.y > this.canvas.height+buffer){
      this.core.y = -buffer;
    }
  }
  turnShip(){
    for(let i = 0;i<this.points.length;i++){
      this.points[i] = this.RotatePoint(this.core,this.angle,this.points[i]);
    }
    for(let i = 0;i<this.flamePoints.length;i++){
      this.flamePoints[i] = this.RotatePoint(this.core,this.angle,this.flamePoints[i]);
    }
  }
  Accelerate(){
    let max = 20;
    let accel = {x:0,y:-1};
    accel = this.RotatePoint({x:0,y:0},this.angle,accel);
    if(this.momentum.x + accel.x > -max && this.momentum.x + accel.x < max){
      this.momentum.x = this.momentum.x + accel.x;
    }
    if(this.momentum.y + accel.y > -max && this.momentum.y + accel.y < max){
      this.momentum.y = this.momentum.y + accel.y;
    }
    
    this.flames = true;
  }
  Decelerate(){
    let decel = 0.9;
    this.momentum.x = this.momentum.x * decel;
    this.momentum.y = this.momentum.y * decel;
    if(this.momentum.x < 0.05 && this.momentum.x > -0.1){
      this.momentum.x = 0;
    }
    if(this.momentum.y < 0.05 && this.momentum.y > -0.1){
      this.momentum.y = 0;
    }
  }
  RotatePoint(cPoint, angle, point){
    let s = Math.sin(angle*Math.PI/180);
    let c = Math.cos(angle*Math.PI/180);
    // translate point back to origin:
    point.x -= cPoint.x;
    point.y -= cPoint.y;
    // rotate point
    let xnew = point.x * c - point.y * s;
    let ynew = point.x * s + point.y * c;
    // translate point back:
    point.x = xnew + cPoint.x;
    point.y = ynew + cPoint.y;
    
    return point;
  }
}





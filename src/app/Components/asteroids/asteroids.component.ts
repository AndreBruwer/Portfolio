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
  constructor() {}

  ngOnInit(): void {
    this.canvas_container = document.getElementById("asteroid-canvas-container");
    this.canvas = document.getElementById("asteroid-canvas");
    this.width = this.canvas_container.clientWidth;
    this.height = this.canvas_container.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = (this.width*0.6);
    this.ctx = this.canvas.getContext('2d');

    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Click to Start game",this.canvas.width/3,this.canvas.height/2);
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
      this.animateGame = true;
      this.shuttle = new Shuttle(this.canvas.width/2, this.canvas.height/2, this.ctx, this.canvas);
      document.addEventListener("keydown", e => {
        if(e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key == 'ArrowDown' || e.key == 'ArrowRight' || e.key == ' '){
          e.preventDefault();
          if (e.key === 'ArrowUp') {
            //up arrow
            this.accelerate();
          }
          if (e.key == 'ArrowDown') {
            // down arrow
            this.decelerate();
          }
          if (e.key === 'ArrowLeft') {
            // left arrow
            this.turnLeft();
          }
          if (e.key == 'ArrowRight') {
            // right arrow
            this.turnRight();
          }
          if (e.key == ' ') {
            //space
            this.shoot();
          }
        }
      });
      for(let i = 0; i< 100; i++){
        this.stars.push(new Star({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height},this.ctx));
      }
      this.drawFrame(1000/this.fps, this.ctx);
      this.canvas.scrollIntoView();
      this.canvas.focus();
    }
  }
  StopGame(){
    this.animateGame = false;
    document.onkeydown = null;
    clearTimeout(this.frame);
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("Click to Start game",this.canvas.width/3,this.canvas.height/2);
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
    this.lazarBolts.push(new LazarBolt(this.shuttle.core.x,this.shuttle.core.y,this.ctx,this.canvas, this.shuttle.angle));
  }

  drawFrame(ms:number,ctx){
    ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
    if(this.animateGame == true){
      //starts
      this.stars.forEach(star =>{
        star.draw();
      })
      //shuttle
      this.shuttle.draw();
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

      //repeat
      this.frame = setTimeout(() =>{this.drawFrame(ms,ctx)},ms)
    }
  }
}
class Rock{
  core = {x:0,y:0};
  points = [];
  flamePoints = [];
  angle = 0;
  momentum = {x:0,y:0};
  ctx;
  canvas;
  radius;
  constructor(){
    
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
    let chance = Math.floor(Math.random()*100);
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
  constructor(posX, posY, ctx, canvas, angle){
    this.angle = angle;
    this.canvas = canvas;
    this.ctx = ctx;
    //core
    this.core = {x:posX,y:posY};

    this.points.push({x:this.core.x,y:this.core.y-5});
    this.points.push({x:this.core.x,y:this.core.y+5});
    this.momentum = {x:0,y:-5};
    this.momentum = this.RotatePoint({x:0,y:0},this.angle,this.momentum);
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
    this.ctx.strokeStyle = 'white';
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
  draw(){
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
    this.ctx.fillStyle = 'blue';
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





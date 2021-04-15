import { Component, OnInit } from '@angular/core';
import * as TL from '../../../assets/js/TweenLite.js';
import * as EasePack from '../../../assets/js/EasePack.js';

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
  animateGame:boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.canvas_container = document.getElementById("asteroid-canvas-container");
    this.canvas = document.getElementById("asteroid-canvas");
    this.resize();
  }
  resize(){
    this.width = this.canvas_container.clientWidth;
    this.height = this.canvas_container.clientHeight;
    this.canvas.style.width = this.width+"px";
    this.canvas.style.height = (this.width*0.6)+"px";
  }




  StartGame(){
    if(this.game === false){
      this.initGame();
      this.initAnimation();
    }
  }
  initGame(){
    this.ctx = this.canvas.getContext('2d');
    this.game = true;
    
    var px = 10;//position
    var py = 10;
    var xdir = 0;//direction
    var ydir = 0;
    var vx = (0) * xdir;//vector
    var vy = (0) * ydir;
    var p = { x: px, x_vector: vx, y: py, y_vector: vy, active: 1, circle: null};
    this.rocks.push(p)

    for (let i in this.rocks) {
      this.rocks[i].circle = new Circle(this.rocks[i].px, this.rocks[i].py,2, 'rgba(255,255,255,1)', this.ctx);
  }
    
  }
  initAnimation() {
    this.animate();
    for (let i in this.rocks) {
      this.shiftPoint(this.rocks[i]);
    }
  }
  animate() {
    if (this.animateGame) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // drawLines(points[0], points[1]);
        for (var i in this.rocks) {
            this.rocks[i].circle.draw();
        }
    }
    // findNearest();
    requestAnimationFrame(this.animate);
  }
  shiftPoint(p) {
    TL.TweenLite.to(p, 
      2, 
      { x: p.x + p.x_vector,
      y: p.y + p.y_vector, 
      ease: "Linear.easeNone",
      onComplete: function () {
      this.shiftPoint(p);
      } }
  );
  }
  

}
class Circle {
  posX;
  posY;
  rad;
  color;
  ctx;
  constructor(posX, posY, rad, color, ctx){
    this.posX = posX;
    this.posY = posY;
    this.rad = rad;
    this.color = color;
    this.ctx = ctx;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.posX,this.posY, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'rgba(256,256,256,)';
    this.ctx.fill();
  };
}



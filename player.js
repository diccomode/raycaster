import { Vector, Matrix } from "./vec_mat.js";
import { Ray, Raycaster } from "./ray.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.pos = new Vector(this.game.map.CELL_SIZE * this.game.map.getLength()/2,
            this.game.height - (this.game.map.CELL_SIZE*this.game.map.getLength()/2));
        this.pos_init = this.pos;
        //map coords
        this.mapX = Math.floor(this.pos.x/this.game.map.CELL_SIZE);
        this.mapY = Math.floor((this.pos.y - this.game.map.y_offset)/this.game.map.CELL_SIZE);

        this.dir = new Vector(0,1);
        this.planemx = new Matrix(2,2);
        this.planemx.rotMx(Math.PI/2);
        this.plane = this.planemx.multiplyVec(this.dir);
        this.size = Math.round(this.game.map.CELL_SIZE/2);

        this.rays = new Raycaster(this.game, this, this.game.width); //adjust how many rays
        this.rays.setRaysDir(this.dir,this.plane);

        //define initial vertices of cube, transform them to reference units wrt center
        this.vertices_ref = [
            new Vector(this.pos.x - (this.size/2.0), this.pos.y - (this.size/2.0)),
            new Vector(this.pos.x + (this.size/2.0), this.pos.y - (this.size/2.0)),
            new Vector(this.pos.x + (this.size/2.0), this.pos.y + (this.size/2.0)),
            new Vector(this.pos.x - (this.size/2.0), this.pos.y + (this.size/2.0)),
        ]

        for(let i=0; i<this.vertices_ref.length;i++) {
            this.vertices_ref[i] = this.vertices_ref[i].subtract(this.pos_init).unit();
        }

        this.vertices=[];
        this.acc_multiplier = 0.005; //should be far less than 1
        this.acc = this.game.map.CELL_SIZE * this.acc_multiplier; //to keep consistent movement on resize
        this.acc_v = new Vector(0,0);
        this.vel_v = new Vector(0,0);
        this.ang_vel = 0;
        this.angle = 0;
        this.mx = new Matrix(2,2);
        this.friction = 0.1;
    }
    drawPlayer(ctx) {
        //draw rays
        ctx.beginPath();
        ctx.strokeStyle= '#e41311';
        this.rays.drawRays(this.pos,ctx);
        ctx.closePath(); 


        //draw shape
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        ctx.lineTo(this.vertices[1].x, this.vertices[1].y);
        ctx.lineTo(this.vertices[2].x, this.vertices[2].y);
        ctx.lineTo(this.vertices[3].x, this.vertices[3].y);
        ctx.lineTo(this.vertices[0].x, this.vertices[0].y);
        ctx.stroke();
        ctx.fillStyle = '#0000ff';
        ctx.fill();
        ctx.closePath();
        //this.rays.drawWalls(ctx);
    }
    update(input){
        this.acc = this.game.map.CELL_SIZE * this.acc_multiplier; // could add this to resize func but its fine here for now
        if (input.includes('w') && !input.includes('s')) {
            this.acc_v = this.dir;
        }
        if (input.includes('s') && !input.includes('w')) {
            this.acc_v = this.dir.mult(-1);
        }
        if (input.includes('a') && !input.includes('d')) {
            this.acc_v = this.acc_v.add(this.plane.mult(-1));
        }
        if (input.includes('d') && !input.includes('a')) {
            this.acc_v = this.acc_v.add(this.plane);
        }
        if (input.includes('q')) {
            this.ang_vel = -0.04;
        }
        if (input.includes('e')) {
            this.ang_vel = 0.04;
        }
        if (!(input.includes('s') || input.includes('w') || input.includes('a') || input.includes('d'))) {
            this.acc_v = this.acc_v.mult(0);
        }
        if (!(input.includes('q') || input.includes('e'))) {
            this.ang_vel=0;
        }
        //movement
        this.vel_v = this.vel_v.add(this.acc_v.unit().mult(this.acc));
        this.vel_v = this.vel_v.mult((1-this.friction));
        this.angle += this.ang_vel;
        if (this.angle> 2*Math.PI) this.angle -= 2*Math.PI; //clamping angle
        if (this.angle < 0) this.angle+= 2*Math.PI;
        this.pos = this.pos.add(this.vel_v);
        this.mapX = Math.floor(this.pos.x/this.game.map.CELL_SIZE);
        this.mapY = Math.floor((this.pos.y - this.game.map.y_offset)/this.game.map.CELL_SIZE);

        //rotation
        this.mx.rotMx(this.angle);
        this.dir = this.mx.multiplyVec(new Vector(0,1)); 
        this.plane = this.planemx.multiplyVec(this.dir); //90 FOV when |plane| and |dir| are same
        let newDir;

        this.rays.setRaysDir(this.dir, this.plane);
        this.rays.cast();

        //simple loop, already have reference vectors and rotation mx set up  
        for(let i = 0; i < this.vertices_ref.length; i++){
            newDir = this.mx.multiplyVec(this.vertices_ref[i]);
            this.vertices[i] = this.pos.add(newDir.mult(this.size/2.0));
        }
    }
}
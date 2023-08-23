import { Vector, Matrix } from "./vec_mat.js";

export class Ray {
    constructor(dir = new Vector(0,0)) {
        this.dir = dir;
        this.hit=false;
        this.sideDistx=0;
        this.sideDisty=0;
        this.deltaDistx=0;
        this.deltaDisty=0;
        this.side = 0;
        this.wallDist = 0;
        
    }
    setDir(newdir) {
        this.dir=newdir;
    }
    drawRay(origin, ctx) {
        ctx.beginPath();
        let newdir = this.dir.mult(this.wallDist);
        ctx.moveTo(origin.x+newdir.x, origin.y+newdir.y);
        ctx.lineTo(origin.x, origin.y);
        ctx.stroke();
        ctx.closePath();
    }
}

export class Raycaster {
    constructor(game, player, width = this.game.width) {
        this.game = game;
        this.width = width;
        this.player = player;
        this.rays = new Array(this.width);
        for (let i=0; i < this.rays.length; i++) this.rays[i]=new Ray();
        this.mapX = player.mapX;
        this.mapY = player.mapY;
        this.stepX = 0;
        this.stepY = 0;
    }
    setRaysDir(dir, plane) {
        for(let i=0; i < this.width; i++) {
            this.rays[i].setDir(dir.add(plane.mult(2*i/(this.width -1) - 1)));
        }
    }
    cast() {    //my implementation of DDA, I originally didnt have this working right because I needed to scale by cell size in the correct places
        this.rays.forEach(ray => {
            this.mapX = this.player.mapX;
            this.mapY = this.player.mapY;
            ray.sideDistx=0;
            ray.sideDisty=0;
            ray.hit = false;
            ray.deltaDistx = (ray.dir.x == 0) ? 1e30 : Math.abs(1/ray.dir.x);
            ray.deltaDisty = (ray.dir.y == 0) ? 1e30 : Math.abs(1/ray.dir.y);
            if (ray.dir.x < 0) {
                this.stepX = -1;
                ray.sideDistx = (this.game.player.pos.x - this.mapX*this.game.map.CELL_SIZE) * ray.deltaDistx ;
            } else {
                this.stepX = 1;
                ray.sideDistx = ((this.mapX + 1) * this.game.map.CELL_SIZE - this.game.player.pos.x) * ray.deltaDistx;
            } if (ray.dir.y<0){
                this.stepY = -1;
                ray.sideDisty = ((this.game.player.pos.y - this.game.map.y_offset) - this.mapY*this.game.map.CELL_SIZE) * ray.deltaDisty ;
            } else {
                this.stepY = 1;
                ray.sideDisty = ((this.mapY+1)*this.game.map.CELL_SIZE - (this.game.player.pos.y - this.game.map.y_offset)) * ray.deltaDisty;
            }
            while(ray.hit==false) {
                if (ray.sideDistx < ray.sideDisty) {
                    ray.sideDistx += ray.deltaDistx*this.game.map.CELL_SIZE;
                    this.mapX += this.stepX;
                    ray.side = 0;
                }
                else {
                    ray.sideDisty += ray.deltaDisty*this.game.map.CELL_SIZE;
                    this.mapY += this.stepY;
                    ray.side = 1;
                }
                if (this.game.map.data[this.mapY][this.mapX] > 0) {
                    ray.hit = true;
                    if (ray.side == 0) {
                        ray.wallDist = ray.sideDistx - ray.deltaDistx*this.game.map.CELL_SIZE;
                    }
                    else{ ray.wallDist = ray.sideDisty - ray.deltaDisty*this.game.map.CELL_SIZE; 
                    }
                }
            }
        })
    }
    drawRays(origin, ctx){
        this.rays.forEach(ray => {
            ray.drawRay(origin,ctx);
        })
    }
    drawWalls(ctx){
        let wallHeight =0;
        let drawStart = 0;
        let drawEnd = 0;
        for (let i=0; i < this.rays.length; i++) {

            wallHeight = (this.game.height*this.game.map.CELL_SIZE)/this.rays[i].wallDist;
            drawStart = -wallHeight/2 + this.game.height/2;
            if (drawStart < 0) drawStart = 0;
            drawEnd = wallHeight/2 + this.game.height/2;
            if (drawEnd >= this.game.height) drawEnd=this.game.height -1;
            if (this.rays[i].side == 0) ctx.strokeStyle = '#cc1111';
            else ctx.strokeStyle = '#770000';
            ctx.beginPath();
            ctx.moveTo(this.game.width - this.rays.length + i,drawStart);
            ctx.lineTo(this.game.width - this.rays.length + i, drawEnd);
            ctx.stroke();
        }
    }
}
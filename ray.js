import { Vector, Matrix } from "./vec_mat.js";

export class Ray {
    constructor(dir = new Vector(0,0)) {
        this.dir = dir;
        this.hit=false;
    }
    setDir(newdir) {
        this.dir=newdir;
    }
    drawRay(origin, ctx) {
        ctx.beginPath();
        ctx.moveTo(origin.x+this.dir.x, origin.y+this.dir.y);
        ctx.lineTo(origin.x, origin.y);
        ctx.stroke();
        ctx.closePath();
    }
}
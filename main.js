import { Map } from "./map.js"
import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Vector, Matrix } from "./vec_mat.js";

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height= window.innerHeight;
const ctx = canvas.getContext('2d');

const mapdata= [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,0,0,0,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

class Game {
    constructor(width, height){
        this.width=width;
        this.height=height;
        this.FrameTimer = 0;
        this.FrameInterval = 1000.0/70.0; //looks shitty at 60 fps for some reason
        this.map = new Map(this, mapdata, 0.3);

        window.addEventListener("resize", () => { //kind of a mess, handles resize
            canvas.width = window.innerWidth;   
            canvas.height = window.innerHeight;
            //canvas always has current values, game object still has old values, I will take advantage of this here to get rel values
            let relx = this.player.pos.x / (this.map.CELL_SIZE*this.map.getLength());
            let rely = (this.player.pos.y - (this.map.y_offset)) / (this.map.getLength() * this.map.CELL_SIZE);
            this.width = canvas.width;
            this.height = canvas.height;
            this.map.w = this.map.scale*this.width;
            this.map.h = this.map.scale*this.height;
            this.map.CELL_SIZE = Math.round((this.map.w >= this.map.h ? this.map.h : this.map.w) / this.map.getLength());
            this.map.y_offset = this.height - this.map.CELL_SIZE*this.map.getLength();

            //updating player coords after map resize
            this.player.size = Math.round(this.map.CELL_SIZE/2);
            this.player.pos.x = relx * this.map.getLength()*this.map.CELL_SIZE;
            this.player.pos.y = (this.map.y_offset) + (rely * this.map.getLength()*this.map.CELL_SIZE);
        });
        this.input = new InputHandler(this);
        this.player = new Player(this);
    }
    update(deltatime){
        this.FrameTimer += deltatime;
        if (this.FrameTimer > this.FrameInterval) {
            this.map.drawMinimap(ctx);
            this.player.update(this.input.keys);
            this.player.drawPlayer(ctx);
            this.FrameTimer = 0;
        }
    }
}

const game = new Game(canvas.width, canvas.height);

let lastTime=0;

function animate(timestamp) {
    const deltatime = timestamp - lastTime;
    lastTime = timestamp;
    game.update(deltatime);
    requestAnimationFrame(animate);
}

animate(0);

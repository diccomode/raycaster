export class Map {
    constructor(game, data, s = 1) {
        this.game = game;
        this.data = data;
        this.scale = s; //1 = full width or height, whichever is smaller (map is always a cube for now)
        this.h = this.scale*this.game.height;
        this.w = this.scale*this.game.width;
        this.CELL_SIZE = Math.round(( this.w >= this.h ? this.h : this.w) / this.data.length);
        this.y_offset = this.game.height - this.CELL_SIZE*this.data.length;
    }
    getLength() {
        return this.data.length;
    }
    setScale(s) {
        this.scale = s;
    }
    drawMinimap(ctx) {
        ctx.clearRect(0,0,this.game.width,this.game.height);
        ctx.fillStyle = '#a0a0a0';
        ctx.fillRect(0,0,this.game.width, this.game.height);
        ctx.fillStyle = '#55a002';
        let x = 0;
        let y = this.game.height - this.data.length*this.CELL_SIZE;
    
        for(let i=0;i<this.data.length;i++) {
            for (let j=0;j < this.data.length;j++) {
                if (this.data[i][j] == 1) {
                    ctx.fillRect(x+j*this.CELL_SIZE,y+i*this.CELL_SIZE,this.CELL_SIZE, this.CELL_SIZE);
                    ctx.strokeRect(x+j*this.CELL_SIZE,y+i*this.CELL_SIZE,this.CELL_SIZE,this.CELL_SIZE);
                }
            }
        }
        
    }
}
export class Vector {
    constructor(x,y) {
        this.x=x;
        this.y=y;
    }

    add(v) {
        return new Vector(this.x+v.x, this.y+v.y);
    }

    subtract(v) {
        return new Vector(this.x-v.x, this.y-v.y);
    }

    mag() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    mult(n) {
        return new Vector(this.x*n, this.y*n);
    }

    normal() {
        return new Vector(-this.y, this.x).unit();
    }

    unit() {
        if (this.mag() === 0) {
            return new Vector(0,0);
        }
        else {
        return new Vector(this.x/this.mag(), this.y/this.mag());
        }
    }

    static dot(v1, v2) {    //Static methods are not called on instances of the class, called on class itself
        return v1.x*v2.x + v1.y*v2.y;
    }
}

export class Matrix {
    constructor(rows, cols) {
        this.rows=rows;
        this.cols=cols;
        this.data = [];

        for (let i=0; i<this.rows;i++) {
            this.data[i] = [];
            for (let j=0; j<this.cols; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    multiplyVec(vec) {
        let result = new Vector(0,0);
        result.x= this.data[0][0]*vec.x + this.data[0][1]*vec.y;
        result.y= this.data[1][0]*vec.x + this.data[1][1]*vec.y;
        return result;
    }
    rotMx(angle) {
        this.data[0][0] = Math.cos(angle);
        this.data[0][1] = -Math.sin(angle);
        this.data[1][0] = Math.sin(angle);
        this.data[1][1] = Math.cos(angle);
    }
}
export class InputHandler {
    constructor(game){
        this.keys=[];
        this.game = game;
        window.addEventListener('keydown', e => {
        //this is to make sure a given input is only added to the array once
            switch(e.key) {
                case 's':
                    if(this.keys.indexOf(e.key) === -1){
                        this.keys.push(e.key);
                    } break;
                case 'w':
                    if(this.keys.indexOf(e.key) === -1){
                        this.keys.push(e.key);
                    } break;
                case 'a':
                    if(this.keys.indexOf(e.key) === -1){
                        this.keys.push(e.key);
                    } break;
                case 'd':
                    if(this.keys.indexOf(e.key) === -1){
                        this.keys.push(e.key);
                    } break;
                case 'q':
                    if(this.keys.indexOf(e.key) === -1){
                        this.keys.push(e.key);
                    } break;
                case 'e':
                    if(this.keys.indexOf(e.key) === -1){
                        this.keys.push(e.key);
                    } break;
            }
        });
        window.addEventListener('keyup', e => {
            switch(e.key) {
                case 's':
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    break;
                case 'w':
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    break;
                case 'a':
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    break;
                case 'd':
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    break;
                case 'z':
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    break;
                case 'q':
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    break;
                case 'e':
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                    break;
            }
        });
    }
}
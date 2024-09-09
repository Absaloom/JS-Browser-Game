export class InputHandler {
    constructor(game) {
        this.game = game
        this.keys = [];
        // erkennt welche tasten gedrückt wurden
        window.addEventListener('keydown', e => {
            // dient dazu das nur bestimmte tastenbefehle in das array geschrieben werden und auch nur 1x und nich 20x wenn man es gedrückt hält
            if((    e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Enter'
                ) && this.keys.indexOf(e.key) === -1){ 
                        this.keys.push(e.key);
            } else if(e.key === 'd')this.game.debug = !this.game.debug;

        });
        // entfernt letzten eintrag beim aufhören des drückens einer taste aus dem array
        window.addEventListener('keyup', e => {
            if(     e.key === 'ArrowDown' ||  
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Enter') {
                this.keys.splice(this.keys.indexOf(e.key), 1)
            }

        })
    }
}
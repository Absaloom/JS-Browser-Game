import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimations.js";
// job von Player klasse ist draw und update charakter
export class Player {
    // game von main.js
    constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    // höhe des spiels - char höhe --> setzt den char auf den boden des feldes
    // in dem fall etwas höher durch groundmargin damit man auf einen weg läuft
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.vy = 0;
    this.weight = 1;

    // document.getElementById('player') nicht nötigt da durch id vergabe "player" als global elemnt verfügbar wurde
    // id wird als variable name benutzt
    this.image = player;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 5;
    // game läuft auf 60fps, aber animation der bilder ist 20 fps
    this.fps = 20;
    this.frameInterval = 1000/this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    // max speed in pixel / frame
    this.maxSpeed = 10;

    // springend, sitzend rennend etc. states... this referenziert die komplette player class
    // wurde nachträglich zu game geändert damit particles in playerState funktionieren
    this.states= [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];



    }
    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input)
        // horizontal movement
        this.x += this.speed;
        // includes Methode bestimmt ob das Array ein value beinhaltet --> returned true oder false
        if(input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft')  && this.currentState !== this.states[6]) this.speed = - this.maxSpeed;
        else this.speed = 0;

        // horizontal boundaries 
        // begrenzung für den linken und dann rechten canvas rand
        if(this.x <0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        // vertikal movement
        // if (input.includes('ArrowUp') && this.onGround()) this.vy -= 25;
        this.y += this.vy;
        // wenn player nicht auf den boden ist wird gravity hinzugefügt die vy entgegenwirkt
        if(!this.onGround()) this.vy += this.weight;
        else this.vy =0;

        
        // vertical boundaries
        if(this.y > this.game.height - this.height - this.game.groundMargin) 
            this.y = this.game.height - this.height - this.game.groundMargin ;

        // sprite animation
        if(this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        // if(this.frameX < this.maxFrame) this.frameX++;
        // else this.frameX = 0;
    }
    draw(context) {
        if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        // html canvas method um animationen zu erstellen
        // image, sx, sy, sw, sh, x, y, w, h
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    // funktion die es erlaubt das der char seine states ändern kann....mit enter method wird die enter methode des jeweiligen states aufgerufen
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }
    // collision detection between rectancles 
    checkCollision() {
        this.game.enemies.forEach(enemy =>  {
            if(
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                // collision detected
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                } else {
                    this.setState(6, 0);
                }

            } 
        });
    }
}
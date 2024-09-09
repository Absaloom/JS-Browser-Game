import {Player} from './player.js';
import {InputHandler} from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy ,GroundEnemy  } from './enemies.js';
import { UI } from './UI.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            // this meint ihr das Game object in den ich mich befinde
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this); 
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            // array für alle vorhandenen collisions
            this.collisions = [];
            // maxParticle je nach performance anpassbar = begrenzung der fire/dust/splash particle
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 10000;
            this.gameOver = false;
            this.player.currentState = this.player.states[0];
            //initial default state
            this.player.currentState.enter();
            
        } 
        update(deltaTime) {
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            // handle Enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if(enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1)
            });
            // handle Particles
            this.particles.forEach((particle, index) => {
                particle.update();       
                if(particle.markedForDeletion) this.particles.splice(index, 1);         
            });
            // überprüfung ob dust particles aus array gelöscht werden
             // console.log(this.particles);

             if(this.particles.length > this.maxParticles) {
                // wenn mehr als 50 einträge in partikel array sind werden die letzten gelöscht(um sicher zu gehen das nicht zu viele partikel vorhanden sind)
                //this.particles = this.particles.slice(0, 50);
                 this.particles = this.maxParticles;        
            }
            // handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                if(collision.markedForDeletion) this.collisions.splice(index, 1);
            });
        }
        draw(context) { // deklariert in line player js
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy(){
            // fügt mit 50% chance einen GroundEnemy hinzu
            if(this.speed > 0 && Math.random() <0.5) this.enemies.push(new GroundEnemy(this));
            else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }
    }
    // greift auf class Game zu ---> auf Player class
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    // timestamp autogeneratet durch requestAnimationFrame jedes mal wenn es loopt
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // inbuild canvas method zum entfernen alter sachen --> animation und übermalen durch alte sachen
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
       if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});
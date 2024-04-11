"use strict";

window.addEventListener("load", start);

function start(){
    console.log("Js is running")
    
    document.addEventListener("keydown", keyPress);
    document.addEventListener("keyup", keyUp);

    requestAnimationFrame(tick);
}

let lastTimestamp = 0;

function tick(timestamp){
    requestAnimationFrame(tick);

    const deltatime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    movePlayer(deltatime);

    displayPlayerposition();
    displayPlayerAnimation();
}

function movePlayer(deltatime){
    player.moving = false;

    const newPos = {
        x: player.x,
        y: player.y
    }

    if(controls.up){
        player.moving = true;
        player.direction = "up";
        player.speed += player.acceleration * deltatime;
    }
    if(controls.down){
        player.moving = true;
        player.direction = "down";
        player.speed += player.acceleration * deltatime;
    }
    if(controls.left){
        player.moving = true;
        player.direction = "left";
        player.speed += player.acceleration * deltatime;
    }
    if(controls.right){
        player.moving = true;
        player.direction = "right";
        player.speed += player.acceleration * deltatime;
    }

    if(player.speed > 0){
      if(controls.up){
        newPos.y -= player.speed * deltatime;
      }
      if(controls.down){
        newPos.y += player.speed * deltatime;
      }
      if(controls.left){
        newPos.x -= player.speed * deltatime;
      }
      if(controls.right){
        newPos.x += player.speed * deltatime;
      }
    }

    player.speed = Math.min(player.speed, player.topspeed);

    if(canMoveTo(newPos)){
        player.x = newPos.x;
        player.y = newPos.y;
    } else {
        player.moving = false;
        if(newPos.x !== player.x && newPos.y !== player.y){
            const newXpos = {
                x: newPos.x,
                y: player.y
            }
            const newYpos = {
                x: player.x,
                y: newPos.y
            
            }

            if(canMoveTo(newXpos)){
                player.moving = true;
                player.x = newXpos.x;
            } else if(canMoveTo(newYpos)){
                player.moving = true;
                if(player.y < newPos.y){
                  player.direction = "down";
                } else {
                  player.direction = "up";
                }
                player.y = newYpos.y;

            }
        }
    }

    if(!player.moving){
      player.speed -= player.acceleration * deltatime + 10;
    }
    player.speed = Math.max(player.speed, 0);
}

function canMoveTo(pos){
    if(pos.x < 0 || pos.x > 484 ||
       pos.y < 0 || pos.y > 340){
        return false;
    }
    return true;
}


const player = {
    x: 0,
    y: 0,
    speed: 0,
    topspeed: 120,
    acceleration: 120,
    moving: false,
    direction: undefined
}

const controls = {
    up: false,
    down: false,
    left: false,
    right: false
}

function displayPlayerposition(){
    const visualPlayer = document.querySelector("#player");
    visualPlayer.style.translate = `${player.x}px ${player.y}px`;
}

function displayPlayerAnimation(){
    const visualPlayer = document.querySelector("#player");

    if(player.direction && !visualPlayer.classList.contains(player.direction)){
        visualPlayer.classList.remove("up", "down", "left", "right");
        visualPlayer.classList.add(player.direction);

    }
    
    if (!player.moving){
        visualPlayer.classList.remove("animate");
    } else if (!visualPlayer.classList.contains("animate")){
        visualPlayer.classList.add("animate");
    }

}


function keyPress(event) {
    if(event.key === "ArrowLeft") {
      controls.left = true;
    } else if(event.key === "ArrowRight") {
      controls.right = true;
    } else if(event.key === "ArrowUp") {
      controls.up = true;
    } else if(event.key === "ArrowDown") {
      controls.down = true;
    }
  }
  
  function keyUp(event) {
    if(event.key === "ArrowLeft") {
      controls.left = false;
    } else if(event.key === "ArrowRight") {
      controls.right = false;
    } else if(event.key === "ArrowUp") {
      controls.up = false;
    } else if(event.key === "ArrowDown") {
      controls.down = false;
    }
  }

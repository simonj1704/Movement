"use strict";

window.addEventListener("load", start);

function start(){
    console.log("Js is running")
    
    document.addEventListener("keydown", keyPress);
    document.addEventListener("keyup", keyUp);

    createTiles();
    displayTiles();
    requestAnimationFrame(tick);
}

//# region CONTROLLER 

let lastTimestamp = 0;
function tick(timestamp){
  requestAnimationFrame(tick);

  const deltatime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  movePlayer(deltatime);

  displayPlayerposition();
  displayPlayerAnimation();  
  showDebugging();
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
//

/* MODEL */

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
      player.speed -= player.acceleration * deltatime + 5;
    }
    player.speed = Math.max(player.speed, 0);
}

function canMoveTo(pos){
  const {row, col} = coordFromPos(pos);

  if(row < 0 || row >= GRID_height||
     col < 0 || col >= GRID_width){
    return false;
  }
  
  const tileType = getTileAtCoord({row, col});
  switch(tileType){
    case 0:
    case 1:
      return true;
    case 2:
    case 3:
    case 4:
    case 5:
      return false;
  }
  return true;
}


const player = {
    x: 0,
    y: 0,
    regX: 10,
    regY: 15,
    hitbox: {
      x: 4,
      y: 7,
      w: 12,
      h: 17
    },
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

const tiles = [
  [0,1,0,0,0,0,0,4,0,0,2,2,2,2,2,0],
  [0,1,0,5,5,0,0,4,0,0,2,0,6,0,2,0],
  [0,1,0,5,5,0,0,4,0,0,2,0,0,0,2,0],
  [0,1,0,0,0,0,0,4,0,0,2,2,3,2,2,0],
  [0,1,0,0,0,0,0,4,0,0,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0],
  [0,0,5,5,5,0,0,4,0,0,0,0,1,0,0,0],
  [0,0,5,6,5,0,0,4,0,0,0,0,1,0,0,0]
]

const GRID_width = tiles[0].length;
const GRID_height = tiles.length;
const tile_size = 32;

function getTileAtCoord({row, col}){
  /* const row = coord.row;
  const col = coord.col; */

  //const {row, col} = coord; // destructuring
  
  return tiles[row][col];
}

function getTilesUnderPLayer(player){
  const tiles = [];

  const topLeft = {x: player.x - player.rexX + player.hitbox.x, y: player.y};
  const topRight = {x: player.x - player.rexX + player.hitbox.x + player.hitbox.w, y: player.y};
}

function coordFromPos( {x, y} ){
  const row = Math.floor(y / tile_size);
  const col = Math.floor(x / tile_size);
  return {row, col};
}

function posFromCoord( {row, col} ){
  const x = col * tile_size;
  const y = row * tile_size;
  return {x, y};
}


/* VIEW */

function displayPlayerposition(){
    const visualPlayer = document.querySelector("#player");
    visualPlayer.style.translate = `${player.x - player.regX}px ${player.y - player.regY}px`;
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

function createTiles(){
  const background = document.querySelector("#background");

  for(let row = 0; row < GRID_height; row++){
    for(let col = 0; col < GRID_width; col++){
      const tile = document.createElement("div");
      tile.classList.add("tile");
    
      background.append(tile);

      background.style.setProperty("--GRID_WIDTH", GRID_width);
      background.style.setProperty("--GRID_HEIGHT", GRID_height);
      background.style.setProperty("--TILE_SIZE", tile_size + "px");
    }
  }
}

function displayTiles(){
  const visualTiles = document.querySelectorAll("#background .tile");

  for(let row = 0; row < GRID_height; row++){
    for(let col = 0; col < GRID_width; col++){
      const tile = getTileAtCoord({row, col});
      const visualTile = visualTiles[row * GRID_width + col];

      visualTile.classList.add(getClassForTileType(tile))
    }
  }
}

function getClassForTileType(tile){
  switch(tile){
    case 0: return "grass";
    case 1: return "path";
    case 2: return "wall";
    case 3: return "door";
    case 4: return "water";
    case 5: return "tree";
    case 6: return "chest";
  }
}


//#region DEBUGGING

function showDebugging(){
  showDebugTileUnderPlayer();
  showPlayerHitbox();
  showDebugPlayerRegPoint();
}

let lastCoord = {row: 1, col: 1};
function showDebugTileUnderPlayer(){
  const coord = coordFromPos(player);

  if(coord.row !== lastCoord.row || coord.col !== lastCoord.col){
    unhighlightTile(lastCoord);
    highlightTile(coord);
  }

  lastCoord = coord;  
}

function showPlayerHitbox(){
  const player = document.querySelector("#player");
  
  if(!player.classList.contains("show-rect")){
    player.classList.add("show-rect");
  }

}

function showDebugPlayerRegPoint(){
  const visualPlayer = document.querySelector("#player");

  if(!visualPlayer.classList.contains("show-reg-point")){
    visualPlayer.classList.add("show-reg-point");
  }

  visualPlayer.style.setProperty("--regX", player.regX + "px");
  visualPlayer.style.setProperty("--regY", player.regY + "px");
}

function highlightTile({row, col}){
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_width + col];
  visualTile.classList.add("highlight");
}

function unhighlightTile(coord){
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[coord.row * GRID_width + coord.col];
  visualTile.classList.remove("highlight");
}


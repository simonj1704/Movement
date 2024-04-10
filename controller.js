"use strict";

window.addEventListener("load", start);

function start(){
    console.log("Js is running")

    requestAnimationFrame(tick);
}

const player = {
    x: 0,
    y: 0
}

function displayPlayerposition(){
    const visualPlayer = document.querySelector("#player");
    visualPlayer.style.translate = `${player.x}px ${player.y}px`;
}

function tick(){
    requestAnimationFrame(tick);

    player.x++;

    displayPlayerposition();
}

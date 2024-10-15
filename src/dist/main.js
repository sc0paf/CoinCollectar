import { actKeys, ee, currentInputTarget, InputTarget } from './eventemitter.js';
import { player, saveGame, loadGame, resetGame, updatePlayerPosition } from './player.js';
import { drawBG, mousePosition, drawPlayer, foc, drawAllCoins, checkCoinCollisions, drawScoreBoard, initCanvas } from './canv.js';
import { drawAutoMenu, initAutomation } from './automation.js';
import { msToTime, mouseXY } from './helpers.js';
import { addCoin } from './coins.js';
import { createInitialUpgrades } from './upgrades.js';
const mainCanvasMouse = document.getElementById('main-mousedisplay');
const coinDisplay = document.getElementById('current-coins');
const footerDisplay = document.getElementById('footer');
const snapToggle = document.getElementById('snap-toggle');
const addCoinsDev = document.getElementById('gain-hax');
const upgrades = document.getElementById('upgrades');
// Temp reset button shiat
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    resetGame();
});
document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('main-canvas');
    initCanvas(ee, mainCanvas);
    initAutomation(ee, mainCanvas);
    loadGame();
    requestAnimationFrame(gameLoop);
    mainCanvas.addEventListener('mousedown', (event) => {
        const mousePos = mouseXY(mainCanvas, event);
        ee.emit('mousedown', mousePos);
    });
    mainCanvas.addEventListener('mouseup', (event) => {
        const mousePos = mouseXY(mainCanvas, event);
        ee.emit('mouseup', mousePos);
    });
    mainCanvas.addEventListener('mousemove', (event) => {
        const mousePos = mouseXY(mainCanvas, event);
        ee.emit('mousemove', mousePos);
    });
    mainCanvas.addEventListener('keydown', (event) => {
        if (!actKeys.includes(event.key.toLowerCase().toString()))
            return; // fuckin ts man
        ee.emit('keydown', event.key.toLowerCase().toString());
    });
    mainCanvas.addEventListener('keyup', (event) => {
        if (!actKeys.includes(event.key.toLowerCase()))
            return;
        ee.emit('keyup', event.key.toLowerCase());
    });
    // initializePlayerControls();
    snapToggle.addEventListener('click', () => {
        player.gridSnap = player.gridSnap === 0 ? 10 : 0;
        snapToggle.innerText = player.gridSnap === 0 ? 'Snap is off' : 'Snap is on';
    });
    addCoinsDev.addEventListener('click', () => {
        player.coins += 500;
    });
    upgrades.append(createInitialUpgrades());
});
let lastTime = 0;
let coinTimer = 0;
const gameLoop = (timestamp) => {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    player.playTime += deltaTime;
    coinTimer += deltaTime;
    if (coinTimer >= player.coinSpawnRate) {
        addCoin();
        coinTimer = 0;
    }
    // TODO
    checkCoinCollisions();
    updatePlayerPosition(deltaTime);
    drawBG(true);
    drawAllCoins();
    drawScoreBoard();
    drawPlayer();
    coinDisplay.innerText = player.coins.toString();
    footerDisplay.innerText = msToTime(player.playTime * 1000, true);
    mainCanvasMouse.innerText = `Mouse: ${mousePosition.x}, ${mousePosition.y}`;
    foc();
    if (currentInputTarget === InputTarget.AutoControl) {
        drawAutoMenu();
    }
    requestAnimationFrame(gameLoop);
};
setInterval(saveGame, 10000);
window.addEventListener('beforeunload', () => {
    saveGame();
});

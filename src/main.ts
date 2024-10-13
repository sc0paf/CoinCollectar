import { coord, sqe, Player } from './types/types';
import { EventEmitter } from './eventemitter.js';
import { player, saveGame, loadGame, resetGame, updatePlayerPosition, initializePlayerControls } from './player.js'
import { drawBG, initializeCanvas, mousePosition, drawPlayer, foc, drawAllCoins, checkCoinCollisions, drawScoreBoard } from './canv.js';
import { drawAutoMenu } from './automation.js';
import { msToTime } from './helpers.js';
import { coins, addCoin } from './coins.js';
import { availableUpgrades, createInitialUpgrades } from './upgrades.js';

const ee = new EventEmitter();

const mainCanvasMouse = document.getElementById('main-mousedisplay') as HTMLDivElement;
const coinDisplay = document.getElementById('current-coins') as HTMLDivElement;
const footerDisplay = document.getElementById('footer') as HTMLDivElement;
const snapToggle = document.getElementById('snap-toggle') as HTMLButtonElement;
const addCoinsDev = document.getElementById('gain-hax') as HTMLButtonElement;
const upgrades = document.getElementById('upgrades') as HTMLDivElement;

// Temp reset button shiat
const resetButton = document.getElementById('reset-button') as HTMLButtonElement;
resetButton.addEventListener('click', () => {
	resetGame();
})





let lastTime = 0;
let coinTimer = 0
const gameLoop = (timestamp: number):void => {
	const deltaTime = (timestamp - lastTime) / 1000;
	lastTime = timestamp;
	player.playTime += deltaTime;
	coinTimer += deltaTime
	if (coinTimer >= player.coinSpawnRate) {
		addCoin()
		coinTimer = 0
	}
	// TODO
	checkCoinCollisions();
	updatePlayerPosition(deltaTime)

	drawBG(true);
	drawAllCoins();
	drawScoreBoard();
	drawPlayer();



	coinDisplay.innerText = player.coins.toString();
	footerDisplay.innerText = msToTime(player.playTime * 1000, true);

	mainCanvasMouse.innerText = `Mouse: ${mousePosition.x}, ${mousePosition.y}`;
	foc();
	if (player.automation) {
		// AUTOM8
		drawAutoMenu()
	}


	requestAnimationFrame(gameLoop);
}

setInterval(saveGame, 10000);


document.addEventListener('DOMContentLoaded', () => {
	loadGame();
	requestAnimationFrame(gameLoop);
	initializeCanvas();
	initializePlayerControls();
	snapToggle.addEventListener('click', () => {
		player.gridSnap = player.gridSnap === 0 ? 10 : 0;
		snapToggle.innerText = player.gridSnap === 0 ? 'Snap is off' : 'Snap is on';
	})

	addCoinsDev.addEventListener('click', () => {
		player.coins += 500
	})

	upgrades.append(createInitialUpgrades())
})


window.addEventListener('beforeunload', () => {
	saveGame();
})
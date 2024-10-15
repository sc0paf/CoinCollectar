import { coord, sqe } from './types/types';
import { player } from './player.js'
import { coins } from './coins.js'
import { EventEmitter } from './eventemitter.js';

const mainCanvas = document.getElementById('main-canvas') as HTMLCanvasElement;
export const mtx = mainCanvas.getContext('2d') as CanvasRenderingContext2D;
export const mousePosition :coord = { x: 0, y: 0 }


export const frameBounds = {
	leftBound: 10,
	rightBound: 780,
	topBound: 10,
	bottomBound: 380
}

export const drawScoreBoard = () => {
	mtx.fillStyle = 'black'
	mtx.font = '18px Arial'
	mtx.fillText(`Coins: ${coins.length} / ${player.maxCoins}`, 680, 30)
	mtx.fillText(`Spawn Speed: ${player.coinSpawnRate.toFixed(2)}`, 620, 50)
}

const isColliding = (rect1: sqe, rect2: sqe): boolean => {
	return (
		rect1.x < rect2.x + rect2.size &&
		rect1.x + rect1.size > rect2.x &&
		rect1.y < rect2.y + rect2.size &&
		rect1.y + rect1.size > rect2.y
  );
}

export const checkCoinCollisions = () => {
	for (let i = coins.length - 1; i >= 0; i--) {
		if (isColliding(player.pickupArea, coins[i])) {
			coins.splice(i, 1)
			player.coins += player.coinValue
		}
	}
}

/** Calls focus to canvas */
export const foc = (): void => {
	mainCanvas.focus()
}

export const drawAllCoins = () => {
	mtx.fillStyle = '#8b5a2b'
	coins.forEach((coin) => {
		mtx.beginPath()
		mtx.arc(coin.x + coin.size / 2, coin.y + coin.size / 2, coin.size / 2, 0, Math.PI * 2)
		mtx.closePath()
		mtx.fill()
		mtx.strokeStyle = 'black'
		mtx.lineWidth = 1
		mtx.stroke()
	})
}


export const drawBG = (grid: boolean, gridSize: number = 10): void => {
	mtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	mtx.fillStyle = 'blue';
	mtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
	mtx.fillStyle = 'rgb(141,141,141)';
	mtx.fillRect(frameBounds.leftBound, frameBounds.topBound, frameBounds.rightBound, frameBounds.bottomBound);

	if (grid) {
		mtx.strokeStyle = 'rgba(200,200,200,0.5)';
		mtx.lineWidth = 1;
		for (let x = 0; x <= mainCanvas.width; x += gridSize) {
			mtx.beginPath();
			mtx.moveTo(x, 0);
			mtx.lineTo(x, mainCanvas.height);
			mtx.closePath();
			mtx.stroke();
		}
		for (let y = 0; y <= mainCanvas.height; y += gridSize) {
			mtx.beginPath();
			mtx.moveTo(0, y);
			mtx.lineTo(mainCanvas.width, y);
			mtx.closePath();
			mtx.stroke();
		}
	}
}

export const initCanvas = (ee: EventEmitter, canvas: HTMLCanvasElement): void => {
	ee.on('mousemove', handleMouseMove);
	ee.on('mousedown', handleMouseDown);
	ee.on('mouseup', handleMouseUp);
}

const handleMouseUp = (mousePos: coord) => {
	//click in canvas
	return
}

const handleMouseMove = (mousePos: coord) => {
	// mousemove in canvas
	const rect = mainCanvas.getBoundingClientRect();
	mousePosition.x = mousePos.x - rect.left;
	mousePosition.y = mousePos.y - rect.top;
}

const handleMouseDown = (mousePos: coord) => {
	//click in canvas
	return
}

export const drawPlayer = () => {
	player.pickupArea.x = player.x - (player.pickupArea.size - player.size) / 2;
	player.pickupArea.y = player.y - (player.pickupArea.size - player.size) / 2;
	mtx.fillStyle = player.pickupAreaColor;
	mtx.fillRect(player.pickupArea.x, player.pickupArea.y, player.pickupArea.size, player.pickupArea.size);
	mtx.fillStyle = player.color;
	mtx.fillRect(player.x, player.y, player.size, player.size);
}



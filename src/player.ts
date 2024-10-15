import { coord, ncoord, sqe, Player } from './types/types';
import { coins, loadCoinState, resetCoins } from './coins.js';
import { frameBounds } from './canv.js';
import { ee, InputTarget, currentInputTarget, setInputTarget } from './eventemitter.js';

// let growTimer = 0
// let growInterval = 8

export const defaultPlayerState: Player = {
	x: 400,
	y: 300,
	size: 20,
	speed: 80,
	coinValue: 1,
	pickupArea: { x: 0, y: 0, size: 20 },
	moveTo: { x: null, y: null },
	maxCoins: 10,
	coinSpawnRate: 3,
	coinSpawnAmount: 1,
	color: 'black',
	pickupAreaColor: 'rgba(40, 120, 181, 0.5)',
	playTime: 0,
	coins: 0,
	automation: false,
	speaking: false,
	gridSnap: 0,
	upgradeLevels: {
		coinValue: 0,
		coinSpeed: 0,
		maxCoins: 0,
		multiCoin: 0,
		moveSpeed: 0,
		pickupArea: 0
	}
}

function deepMerge (target: any, source: any) {
	for (const key in source) {
		if (source[key] instanceof Object && key in target) {
			deepMerge(target[key], source[key])
		} else {
			target[key] = source[key]
		}
	}
}

export let player: Player = JSON.parse(JSON.stringify(defaultPlayerState))

export function loadGame(): void {
	const playerState = localStorage.getItem('coinCPlayer')
	if (playerState) {
		const savedPlayer = JSON.parse(playerState)
		deepMerge(player, savedPlayer)
	}
	loadCoinState()
}

export function saveGame(): void {
	localStorage.setItem('coinCPlayer', JSON.stringify(player))
	localStorage.setItem('coinCCoins', JSON.stringify(coins))
}

export function resetGame(): void {
	localStorage.removeItem('coinCPlayer')
	resetCoins()
	
	player = JSON.parse(JSON.stringify(defaultPlayerState))
}


export function updatePlayerPosition(deltaTime: number): void {
	if (currentInputTarget === InputTarget.PlayerControl) {
		let moveX = 0;
		let moveY = 0;
		const keysDown = ee.getKeysDown();
		if (keysDown['w'] || keysDown['arrowup']) { moveY -= 1; }
		if (keysDown['s'] || keysDown['arrowdown']) { moveY += 1; }
		if (keysDown['a'] || keysDown['arrowleft']) { moveX -= 1; }
		if (keysDown['d'] || keysDown['arrowright']) { moveX += 1; }
		if (keysDown['m']) {
			setInputTarget(InputTarget.AutoControl)
		}

		if (moveX !== 0 || moveY !== 0) {
			const length = Math.hypot(moveX, moveY);
			moveX /= length;
			moveY /= length;
		}
		player.x += moveX * player.speed * deltaTime;
		player.y += moveY * player.speed * deltaTime;
		if (player.gridSnap > 0 && !ee.anyKeyDown()) {						
			let playerSnapx = Math.round(player.x / player.gridSnap) * player.gridSnap;
			let playerSnapy = Math.round(player.y / player.gridSnap) * player.gridSnap;
			const dx = playerSnapx - player.x;
			const dy = playerSnapy - player.y;
			const distance = Math.hypot(dx, dy);
			moveX = dx / distance;
			moveY = dy / distance;
			if (distance > 1) {
				player.x += moveX * player.speed * deltaTime;
				player.y += moveY * player.speed * deltaTime;
			}

		}
		player.x = Math.max(frameBounds.leftBound, Math.min(frameBounds.rightBound - player.size, player.x));
		player.y = Math.max(frameBounds.topBound, Math.min(frameBounds.bottomBound - player.size, player.y));
	}
}
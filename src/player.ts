import { coord, ncoord, sqe, Player } from './types/types';
import { coins, loadCoinState, resetCoins } from './coins.js';
import { frameBounds } from './canv.js';


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
	input: true,
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

const keysDown: {[key: string]: boolean} = {}


export function initializePlayerControls(): void {
	document.addEventListener('keydown', (event: KeyboardEvent): void => {
		keysDown[event.key.toLowerCase()] = true
	})

	document.addEventListener('keyup', (event: KeyboardEvent): void => {
		keysDown[event.key.toLowerCase()] = false
		if (event.key === 'm') {
			player.automation = !player.automation
		}
	})


}

export function updatePlayerPosition(deltaTime: number): void {
	if (player.input) {
		let moveX = 0;
		let moveY = 0;
		const isKeyDown = keysDown['w'] || keysDown['s'] || keysDown['a'] || keysDown['d'];
		if (keysDown['w']) { moveY -= 1; }
		if (keysDown['s']) { moveY += 1; }
		if (keysDown['a']) { moveX -= 1; }
		if (keysDown['d']) { moveX += 1; }
		if (moveX !== 0 || moveY !== 0) {
			const length = Math.hypot(moveX, moveY);
			moveX /= length;
			moveY /= length;
		}
		player.x += moveX * player.speed * deltaTime;
		player.y += moveY * player.speed * deltaTime;
		if (player.gridSnap > 0 && !isKeyDown) {						
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
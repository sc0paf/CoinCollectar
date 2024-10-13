import { player } from './player.js';
import { sqe } from './types/types.js';
import { frameBounds } from './canv.js';


export let coins: sqe[] = []

export const addCoin = () => {
	const coinsToSpawn = Math.min(player.coinSpawnAmount, player.maxCoins - coins.length)
	for (let i = 0; i < coinsToSpawn; i++) {
		const size = 10
		const maxX = frameBounds.rightBound -  frameBounds.leftBound - size
		const maxY = frameBounds.bottomBound - frameBounds.topBound - size

		const coinX = Math.floor(Math.random() * maxX) + frameBounds.leftBound
		const coinY = Math.floor(Math.random() * maxY) + frameBounds.topBound
		coins.push({ x: coinX, y: coinY, size})
	}
}

export const loadCoinState = () => {
	const coinState = localStorage.getItem('coinCCoins')
	if (coinState) {
		coins = JSON.parse(coinState)
	} 
}

export const resetCoins = () => {
	localStorage.removeItem('coinCCoins')
	coins = []
}
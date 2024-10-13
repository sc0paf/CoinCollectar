import { player } from './player.js'
import { UpgradeName } from './types/types.js'
type UpgradeProperties = ConstructorParameters<typeof Upgrade>

interface UpgradeData {
	id: UpgradeName
	displayName: string
	displayBody: string
	baseCost: number
	effect: () => void
	maxLevel: number
	multiplier: number
}

export const availableUpgrades: Upgrade[] = []

const upgradesData: UpgradeData[] = [
	{
    id: 'coinValue',
		displayName: 'Coin Value',
		displayBody: 'Increase the value of each coin by 1',
		baseCost: 12,
		effect: () => {
			player.coinValue++
		},
		maxLevel: 10,
		multiplier: 1.2,

	},
	{
		id: 'coinSpeed',
		displayName: 'Coin Spawn Speed',
		displayBody: 'Increase the speed at which coins appear',
		baseCost: 15,
		effect: () => {
			player.coinSpawnRate *= 0.9
		},
		maxLevel: 15,
		multiplier: 1.3,

	},
	{
		id: 'maxCoins',
		displayName: 'Max Coins',
		displayBody: 'Increase the maximum number of coins that can be on the map',
		baseCost: 20,
		effect: () => {
			player.maxCoins += 5
		},
		maxLevel: 10,
		multiplier: 1.3,

	},
	{
		id: 'multiCoin',
		displayName: 'Multi-Coin',
		displayBody: 'Increase the number of coins that appear at once',
		baseCost: 25,
		effect: () => {
			player.coinSpawnAmount++
		},
		maxLevel: 5,
		multiplier: 1.5,

	},
	{
		id: 'moveSpeed',
		displayName: 'Move Speed',
		displayBody: 'Increase the speed at which the player moves',
		baseCost: 30,
		effect: () => {
			player.speed += 10
		},
		maxLevel: 7,
		multiplier: 1.6,

	},
	{
		id: 'pickupArea',
		displayName: 'Pickup Area',
		displayBody: 'Increase the size of the pickup area',
		baseCost: 35,
		effect: () => {
			player.pickupArea.size += 10
		},
		maxLevel: 5,
		multiplier: 1.3,

	}
]

class Upgrade {
	constructor(
		public id: UpgradeName,
		public displayName: string,
		public displayBody: string,
		public baseCost: number,
		public effect: () => void,
		public maxLevel: number = 1,
		public multiplier: number,
		public level: number = 0
	) {}

	get cost(): number {
		return Math.floor(this.baseCost * Math.pow(this.multiplier, this.level))
	}

	buy(): boolean {
		if (this.level >= this.maxLevel) return false
		if (player.coins >= this.cost) {
			player.coins -= this.cost
			this.level++
			this.effect()
			return true
		} else {
			return false
		}
	}
}


const drawUpgradeButton = (upgrade: Upgrade): HTMLButtonElement => {
	const upgradeButton = document.createElement('button')
	const upgradeTitle = document.createElement('h2')
	upgradeTitle.innerText = `${upgrade.displayName} [${upgrade.level}/${upgrade.maxLevel}]`
	const upgradeCost = document.createElement('p')
	upgradeCost.innerText = `Cost: ${upgrade.cost}`
	const upgradeBody = document.createElement('p')
	upgradeBody.innerText = upgrade.displayBody
	upgradeButton.append(upgradeTitle, upgradeCost, upgradeBody)
	upgradeButton.addEventListener('click', () => {
		upgrade.buy()
		player.upgradeLevels[upgrade.id] += 1
		upgradeTitle.innerText = `${upgrade.displayName} [${upgrade.level}/${upgrade.maxLevel}]`
		upgradeCost.innerText = `Cost: ${upgrade.cost}`
	})

	return upgradeButton
}


export const createInitialUpgrades = (): DocumentFragment => {
	const upgrades: Upgrade[] = []
	upgradesData.forEach((upgrade) => {
		upgrades.push(
			new Upgrade(
				upgrade.id,
				upgrade.displayName,
				upgrade.displayBody,
				upgrade.baseCost,
				upgrade.effect,
				upgrade.maxLevel,
				upgrade.multiplier,
				player.upgradeLevels[upgrade.id] > 0 ? player.upgradeLevels[upgrade.id] : 0
			)
		)
	})
	const frag = document.createDocumentFragment()
	upgrades.forEach((upgrade) => {
		const newButton = drawUpgradeButton(upgrade)
		frag.append(newButton)
	})
	return frag;
}

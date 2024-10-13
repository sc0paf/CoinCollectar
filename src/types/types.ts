/**
 * A coordinate object
 */
export interface coord {
	/** left right */
	x: number;
	/** y-coordinate */
	y: number;
}

type effectFunction = () => void;


//helper
interface nullcoordinate {
	x: null;
	y: null;
}

export type UpgradeName = keyof Player['upgradeLevels']

/**
 * Coordinate where both are number or both are null
 */
export type ncoord = coord | nullcoordinate;

export type Color = 
  | `#${string}` 
  | `rgba(${number},${number},${number},${number})`
  | `rgb(${number},${number},${number})`
  | string;


/**
 * A square element
 */
export interface sqe {
	/** left right coordinate (+right) */
	x: number,
	/** up down coordinate (+down) */
	y: number,
	/** size size of the square */
	size: number
}


/** A rectangle */
export interface RectObj {
	/**Left/right (+right) */
	x: number,
	/**Up/Down (+down) */
	y: number,
	/**Width */
	width: number,
	/**Height */
	height: number
}

export interface DraggableRect extends RectObj {
	/**Is the object being dragged */
	dragging: boolean
}


/** Player object
 * @description x, y, size, speed, coinValue, cutArea, moveTo, maxCoins, coinSpawnRate, coinSpawnAmount, color, cutAreaColor, playTime, coins, input, automation, speaking
 */ 
export interface Player extends sqe {
	/** idk */
	speed: number;
	/** how much each coin is worth */
	coinValue: number;
	/** The size of the coin pickup area */
	pickupArea: sqe;
	/** Coordinates to move the player to (2 numbers or 2 null) */
	moveTo: ncoord,
	/** max coins that can be on the map. */
	maxCoins: number;
	/** speed coins spawn (default 3) */
	coinSpawnRate: number;
	/** How many coins spawn at once */
	coinSpawnAmount: number;
	/** color of the PC */
	color: Color;
	/** color of the pickup area */
	pickupAreaColor: Color;
	playTime: number;
	/** The amount of coins the player has */
	coins: number;
	/** Can player move */
	input: boolean;
	/** is automation available */
	automation: boolean;
	/** is PC speaking */
	speaking: boolean | string;
	/** gridsnap to grid size #, 0 = off */
	gridSnap: number;
	/** coinValue, SpawnRate, maxCoins, SpawnAmount, moveSpeed, pickupArea */
	upgradeLevels: {
		coinValue: number;
		coinSpeed: number;
		maxCoins: number;
		multiCoin: number;
		moveSpeed: number;
		pickupArea: number;
	}
}




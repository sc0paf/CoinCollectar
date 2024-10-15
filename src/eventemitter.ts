// Magical event emitter
export type MousePosition = { x: number, y: number };
export const actKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'm'];
export type KeyInput = typeof actKeys[number];

export type Events = 
	| { type: 'mousemove', payload: MousePosition }
	| { type: 'mousedown', payload: MousePosition }
	| { type: 'mouseup', payload: MousePosition }
	| { type: 'keydown', payload: KeyInput }
	| { type: 'keyup', payload: KeyInput };

type Callback<T> = (payload: T) => void

export class EventEmitter {
	private events: { [K in Events['type']]?: Callback<any>[] } = {};

	private keysDown: {[key in KeyInput]?: boolean} = {}


	on<K extends Events['type']>(event: K, listener: Callback<Extract<Events, {type: K}>['payload']>): void {
		if (!this.events[event]) {
			this.events[event] = []
		}
		this.events[event]!.push(listener)
	}

	off<K extends Events['type']>(event: K, listener: Callback<Extract<Events, { type: K }>['payload']>): void {
		if(!this.events[event]) return
		this.events[event] = this.events[event]!.filter((l) => l !== listener)
	}

	emit<K extends Events['type']>(
		event: K, 
		payload: Extract<Events, { type: K}>['payload']
	): void {
		if (event === 'keydown' && typeof payload === 'string') {
			this.keysDown[payload] = true
		} else if (event === 'keyup' && typeof payload === 'string') {
			this.keysDown[payload] = false
		}
		
		if (!this.events[event]) return
		this.events[event].forEach(listener => listener(payload))
	}

	emitNoPayload<K extends Exclude<Events['type'], 'mousemove' | 'mousedown'>>(event: K) {
		if (!this.events[event]) return
		this.events[event].forEach(listener => listener(undefined))	
	}

	getKeysDown(): {[key in KeyInput]?: boolean} {
		return { ...this.keysDown } // prob best to copy
	}

	isKeyDown(key: KeyInput): boolean {
		return !!this.keysDown[key]
	}

	anyKeyDown(): boolean {
		return Object.values(this.keysDown).some((v) => v)
	}
}

export enum InputTarget {
	PlayerControl,
	AutoControl,
	None
}

export let currentInputTarget: InputTarget = InputTarget.PlayerControl
let targetDebounce = false
export function setInputTarget(target: InputTarget): void {
	if (targetDebounce) return
	currentInputTarget = target
	targetDebounce = true
	setTimeout(() => {
		targetDebounce = false
	}, 100)
}

export const ee = new EventEmitter()
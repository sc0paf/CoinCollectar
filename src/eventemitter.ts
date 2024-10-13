// Magical event emitter
export type MousePosition = { x: number, y: number }

export type Events = 
	| { type: 'mousemove', payload: MousePosition }
	| { type: 'mousedown', payload: MousePosition }
	| { type: 'mouseup', payload: MousePosition };

type Callback<T> = (payload: T) => void

export class EventEmitter {
	private events: { [K in Events['type']]?: Callback<any>[] } = {};

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

	emit<K extends Events['type']>(event: K, payload: Extract<Events, { type: K}>['payload']): void {
		if (!this.events[event]) return
		this.events[event]!.forEach(listener => listener(payload))
	}


	emitNoPayload<K extends Exclude<Events['type'], 'mousemove' | 'mousedown'>>(event: K) {
		if (!this.events[event]) return
		this.events[event]!.forEach(listener => listener(undefined))	
	} 
}
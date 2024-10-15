import { coord } from './types/types';
 
export const msToTime = (duration: number, showMs: boolean): string => {
	let seconds = Math.floor((duration / 1000) % 60).toString().padStart(2, '0'),
		minutes = Math.floor((duration / (1000 * 60)) % 60).toString().padStart(2, '0'),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
		ms = Math.floor((duration % 1000) / 100);

	return `${hours}:${minutes}:${seconds}${showMs ? `.${ms}` : ''}`;
}


export const mouseXY = (canvas: HTMLCanvasElement, event: MouseEvent) => {
	const rect = canvas.getBoundingClientRect();
	const mousePos: coord = {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	}
	return mousePos;
}
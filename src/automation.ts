import { RectObj, DraggableRect, coord } from './types/types'
import { player } from './player.js'
import { mtx, frameBounds } from './canv.js'


class DragRect {
	public offset: coord = { x: 0, y: 0};
	public before: coord;
	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		public fillText: string = '',
		public dragging: boolean

	) {
		this.before = { x: this.x, y: this.y }
	}

	draw(canvas: CanvasRenderingContext2D) {
		canvas.strokeStyle = 'white'
		canvas.fillStyle = 'rgba(0, 0, 0, 0.5)'
		canvas.fillRect(this.x, this.y, this.width, this.height)
		canvas.strokeRect(this.x, this.y, this.width, this.height)
		canvas.fillStyle = 'white'
		canvas.font = '18px mono'
		canvas.fillText(this.fillText, this.x + 15, this.y + 16)
	}

	initMovement(mousePos: coord) {
		this.offset.x = mousePos.x - this.x
		this.offset.y = mousePos.y - this.y
		this.dragging = true
	}

	move(mousePos: coord) {
		this.x = mousePos.x - this.offset.x
		this.y = mousePos.y - this.offset.y
	}

	isMouseIn(mousePos: coord) {
		return (
			mousePos.x >= this.x &&
			mousePos.x <= this.x + this.width &&
			mousePos.y >= this.y &&
			mousePos.y <= this.y + this.height
		)
	}

	drop() {
		this.dragging = false
	}
}


export const draggables: DragRect[] = []


const draggableData =  [
	{ fillText: '\u2190 Go Left', dragging: false },
	{ fillText: '\u2192 Go Right', dragging: false },
	{ fillText: '\u2191 Go Up', dragging: false },
	{ fillText: '\u2193 Go Down', dragging: false }
]
const draggablesConfig = {
	x: 400,
	y: 60,
	width: 140,
	height: 20,
	spacing: 50
}


// const DragPullData: DragPullArea[] = [
// 	{ x: 410, y: 90, width: 180, height: 30, fillText: '\u2190 Go Left' },
// 	{ x: 410, y: 130, width: 180, height: 30, fillText: '\u2192 Go Right' },
// 	{ x: 410, y: 170, width: 180, height: 30, fillText: '\u2191 Go Up' },
// 	{ x: 410, y: 210, width: 180, height: 30, fillText: '\u2193 Go Down' }
// ]



// const DragServer = {
// 	serverX: 400,
// 	serverY: 80,
// 	serverWidth: 200,
// 	serverHeight: 170,
// 	serverSpacing: 40,
// 	draggableLeftPad: 20,
// 	draggableTopPad: 20,
// 	serverFill: 'rgba(0,0,0,0.5)',

// 	drawServer(canvas: CanvasRenderingContext2D) {
// 		canvas.fillStyle = this.serverFill
// 		canvas.strokeRect(this.serverX, this.serverY, this.serverWidth, this.serverHeight)
// 	},

// 	drawEachDraggable(canvas: CanvasRenderingContext2D) {
// 		DragPullData.forEach(data => {
// 			canvas.fillStyle = 'rgba(0,0,0,0.5)'
// 			canvas.fillRect(data.x, data.y, data.width, data.height)
// 			canvas.strokeStyle = 'white'
// 			canvas.strokeRect(data.x, data.y, data.width, data.height)
// 			canvas.fillStyle = 'white'
// 			canvas.font = '18px mono'
// 			canvas.fillText(data.fillText, data.x + 10, data.y + 20)
// 		})
// 	},
// }




export const autoMenu = {
	left: 30,
	top: 30,
	right: 740,
	bottom: 340
}




export const drawAutoMenu = () => {
	mtx.fillStyle = 'rgba(0,0,0,0.7)'
	mtx.fillRect(autoMenu.left, autoMenu.top, autoMenu.right, autoMenu.bottom)
	mtx.strokeStyle = 'white'
	mtx.strokeRect(autoMenu.left, autoMenu.top, autoMenu.right, autoMenu.bottom)
	mtx.fillStyle = 'white'
	mtx.font = '18px Arial'
	mtx.fillText('Automation', frameBounds.leftBound + 40, frameBounds.topBound + 55)


	mtx.strokeStyle = 'white'
	mtx.strokeRect(50, 80, 250, 200)

}

import { mtx, frameBounds } from './canv.js';
import { ee, setInputTarget, InputTarget, currentInputTarget } from './eventemitter.js';
class DragRect {
    x;
    y;
    width;
    height;
    fillText;
    dragging;
    offset = { x: 0, y: 0 };
    before;
    constructor(x, y, width, height, fillText = '', dragging) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillText = fillText;
        this.dragging = dragging;
        this.before = { x: this.x, y: this.y };
    }
    draw(canvas) {
        canvas.strokeStyle = 'white';
        canvas.fillStyle = 'rgba(0, 0, 0, 0.5)';
        canvas.fillRect(this.x, this.y, this.width, this.height);
        canvas.strokeRect(this.x, this.y, this.width, this.height);
        canvas.fillStyle = 'white';
        canvas.font = '18px mono';
        canvas.fillText(this.fillText, this.x + 15, this.y + 20);
    }
    makeCopy() {
        return new DragRect(this.x, this.y, this.width, this.height, this.fillText, true);
    }
    initMovement(mousePos) {
        this.offset.x = mousePos.x - this.x;
        this.offset.y = mousePos.y - this.y;
        this.dragging = true;
    }
    move(mousePos) {
        this.x = mousePos.x - this.offset.x;
        this.y = mousePos.y - this.offset.y;
    }
    isMouseIn(mousePos) {
        return (mousePos.x >= this.x &&
            mousePos.x <= this.x + this.width &&
            mousePos.y >= this.y &&
            mousePos.y <= this.y + this.height);
    }
    isThisIn(rect) {
        return (this.x >= rect.x &&
            this.x + this.width <= rect.x + rect.width &&
            this.y >= rect.y &&
            this.y + this.height <= rect.y + rect.height);
    }
    drop() {
        this.dragging = false;
    }
}
const dropArea = {
    x: 50,
    y: 70,
    width: 250,
    height: 280
};
let tempDraggable = null;
export const drawAutoMenu = () => {
    mtx.fillStyle = 'rgba(0,0,0,0.7)';
    mtx.fillRect(autoMenu.left, autoMenu.top, autoMenu.right, autoMenu.bottom);
    mtx.strokeStyle = 'white';
    mtx.strokeRect(autoMenu.left, autoMenu.top, autoMenu.right, autoMenu.bottom);
    mtx.fillStyle = 'white';
    mtx.font = '18px Arial';
    mtx.fillText('Automation', frameBounds.leftBound + 40, frameBounds.topBound + 50);
    mtx.strokeStyle = 'white';
    mtx.strokeRect(dropArea.x, dropArea.y, dropArea.width, dropArea.height);
    draggables.forEach(draggable => draggable.draw(mtx));
};
export const initAutomation = (ee, canvas) => {
    ee.on('keydown', handleKeyDown);
    ee.on('mousedown', handleMouseDown);
    ee.on('mousemove', handleMouseMove);
    ee.on('mouseup', handleMouseUp);
};
function handleKeyDown(key) {
    if (ee.isKeyDown('m') && currentInputTarget === InputTarget.AutoControl) {
        setInputTarget(InputTarget.PlayerControl);
    }
}
function handleMouseDown(mousePos) {
    if (currentInputTarget == InputTarget.AutoControl) {
        draggables.forEach(draggable => {
            if (draggable.isMouseIn(mousePos)) {
                const copy = new DragRect(draggable.x, draggable.y, draggable.width, draggable.height, draggable.fillText, true);
                draggables.push(copy);
                copy.initMovement(mousePos);
            }
        });
    }
}
function handleMouseMove(mousePos) {
    draggables.forEach(draggable => {
        if (draggable.dragging) {
            draggable.move(mousePos);
        }
    });
}
function handleMouseUp(mousePos) {
    draggables.forEach(draggable => {
        if (draggable.dragging && !draggable.isThisIn(dropArea)) {
            draggables.pop();
        }
        else {
            draggable.drop();
        }
    });
}
const DragData = [
    { x: 410, y: 90, width: 180, height: 30, fillText: '\u2190 Go Left' },
    { x: 410, y: 130, width: 180, height: 30, fillText: '\u2192 Go Right' },
    { x: 410, y: 170, width: 180, height: 30, fillText: '\u2191 Go Up' },
    { x: 410, y: 210, width: 180, height: 30, fillText: '\u2193 Go Down' }
];
export const draggables = [];
DragData.forEach(data => {
    draggables.push(new DragRect(data.x, data.y, data.width, data.height, data.fillText, false));
});
const draggableData = [
    { fillText: '\u2190 Go Left', dragging: false },
    { fillText: '\u2192 Go Right', dragging: false },
    { fillText: '\u2191 Go Up', dragging: false },
    { fillText: '\u2193 Go Down', dragging: false }
];
const draggablesConfig = {
    x: 400,
    y: 60,
    width: 140,
    height: 20,
    spacing: 50
};
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
};

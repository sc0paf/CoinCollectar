export const actKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'm'];
export class EventEmitter {
    events = {};
    keysDown = {};
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    off(event, listener) {
        if (!this.events[event])
            return;
        this.events[event] = this.events[event].filter((l) => l !== listener);
    }
    emit(event, payload) {
        if (event === 'keydown' && typeof payload === 'string') {
            this.keysDown[payload] = true;
        }
        else if (event === 'keyup' && typeof payload === 'string') {
            this.keysDown[payload] = false;
        }
        if (!this.events[event])
            return;
        this.events[event].forEach(listener => listener(payload));
    }
    emitNoPayload(event) {
        if (!this.events[event])
            return;
        this.events[event].forEach(listener => listener(undefined));
    }
    getKeysDown() {
        return { ...this.keysDown }; // prob best to copy
    }
    isKeyDown(key) {
        return !!this.keysDown[key];
    }
    anyKeyDown() {
        return Object.values(this.keysDown).some((v) => v);
    }
}
export var InputTarget;
(function (InputTarget) {
    InputTarget[InputTarget["PlayerControl"] = 0] = "PlayerControl";
    InputTarget[InputTarget["AutoControl"] = 1] = "AutoControl";
    InputTarget[InputTarget["None"] = 2] = "None";
})(InputTarget || (InputTarget = {}));
export let currentInputTarget = InputTarget.PlayerControl;
let targetDebounce = false;
export function setInputTarget(target) {
    if (targetDebounce)
        return;
    currentInputTarget = target;
    targetDebounce = true;
    setTimeout(() => {
        targetDebounce = false;
    }, 100);
}
export const ee = new EventEmitter();

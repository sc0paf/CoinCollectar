export class EventEmitter {
    events = {};
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
        if (!this.events[event])
            return;
        this.events[event].forEach(listener => listener(payload));
    }
    emitNoPayload(event) {
        if (!this.events[event])
            return;
        this.events[event].forEach(listener => listener(undefined));
    }
}

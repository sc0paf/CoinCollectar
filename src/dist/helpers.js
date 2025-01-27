export const msToTime = (duration, showMs) => {
    let seconds = Math.floor((duration / 1000) % 60).toString().padStart(2, '0'), minutes = Math.floor((duration / (1000 * 60)) % 60).toString().padStart(2, '0'), hours = Math.floor((duration / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'), ms = Math.floor((duration % 1000) / 100);
    return `${hours}:${minutes}:${seconds}${showMs ? `.${ms}` : ''}`;
};
export const mouseXY = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    const mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
    return mousePos;
};

export function positionAtTime(
    start: Point,
    end: Point,
    speed: number,
    t: number
): Point {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy); // khoảng cách
    const ux = dx / dist; // unit vector X
    const uy = dy / dist; // unit vector Y

    const travelled = Math.min(speed * t, dist); // clamp quãng đường
    return {
        x: start.x + ux * travelled,
        y: start.y + uy * travelled
    };
}



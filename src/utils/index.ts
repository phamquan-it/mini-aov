import { Point } from "@/types";

export function positionAtTime(
    start: Point,    // Starting point { x, y }
    end: Point,      // Ending point { x, y }
    speed: number,   // Movement speed (units per second)
    t: number        // Time elapsed (seconds)
): Point {
    // Calculate the difference in x and y between end and start points
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    // Calculate the straight-line distance between start and end points
    const dist = Math.hypot(dx, dy);

    // Calculate unit vector components (direction vector normalized)
    const ux = dx / dist;
    const uy = dy / dist;
    // Calculate the distance travelled after time t at given speed,
    // but clamp it so it does not exceed the total distance to end point
    const travelled = Math.min(speed * t, dist);

    // Return the current position after travelling along the direction vector
    return {
        x: start.x + ux * travelled,
        y: start.y + uy * travelled
    };
}


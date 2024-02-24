import { ShipView } from "../views/ShipView";

export class Dock {
    public dockedShip: ShipView | null;
    private docked: boolean;
    private filled: boolean;
    private actionTime: number = 5 * 1000;

    constructor() {
        this.dockedShip = null;
        this.docked = false;
        this.filled = false;
    }

    public dockShip(ship: ShipView): void {
        this.dockedShip = ship;
        this.docked = true;
    }

    public undockShip(): void {
        this.dockedShip = null;
        this.docked = false;
    }

    public isDocked(): boolean {
        return this.docked;
    }

    public isFilled(): boolean {
        return this.filled;
    }

    public setFilled(value: boolean): void {
        this.filled = value;
        this.dockedShip?.setShipLoad(value);
    }
}

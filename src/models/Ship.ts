import { DockView } from "../views/DockView";
import { ShipView } from "../views/ShipView";
import { Port } from "./Port";

export enum ShipType {
    toLoad = "toLoad",
    toUnload = "toUnload",
}

export class Ship {
    public type: ShipType;
    private loaded: boolean;
    public port: Port;

    constructor(port: Port, type: ShipType) {
        this.port = port;
        this.type = type;
        this.loaded = type === ShipType.toUnload;
    }

    public setLoaded(value: boolean): void {
        this.loaded = value;
    }

    public isLoaded(): boolean {
        return this.loaded;
    }

    public callToDock(shipContext: ShipView): void {
        const dock = this.port.tryToDockShip(shipContext);

        if (dock) {
            this.startProcessingInDock(dock);
        }
    }

    private startUndock(dock: DockView) {
        if (dock.dockedShip) this.port.tryToUndockShip(dock, dock.dockedShip);
    }

    private startProcessingInDock(dock: DockView): void {
        setTimeout(() => {
            if (this.type === ShipType.toLoad) {
                dock.setDockFilled(false);
            } else {
                dock.setDockFilled(true);
            }

            this.startUndock(dock);
        }, 3 * 1000);
    }
}

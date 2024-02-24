import { DockView } from "../views/DockView";
import { ShipView } from "../views/ShipView";
import { ShipType } from "./Ship";

interface QueueToUndock {
    ship: ShipView;
    dock: DockView;
}

export class Port {
    private docks: DockView[];
    private queueToLoad: ShipView[] = [];
    private queueToUnload: ShipView[] = [];

    private queueToUndock: QueueToUndock[] = [];

    private dockingProcess: NodeJS.Timeout | null = null;

    constructor(docks: DockView[]) {
        this.docks = docks;
    }

    private getAvailableDock(predicate: (dock: DockView) => boolean): DockView | undefined {
        return this.docks.find(predicate);
    }

    private startDockingProcess(ship: ShipView, dock: DockView): void {
        if (this.dockingProcess) {
            console.log(`Docking process already started.`);
            return;
        }
        console.log(`Starting docking process...`);
        this.dockingProcess = setTimeout(() => {
            this.dockingProcess = null;
            console.log(`Docking process finished.`);
            dock.dockShip(ship);

            const { x, y } = dock.getCoordinatesForChipDockPosition();
            ship.setCoordinates(x, y);
            console.log(`Ship successfully docked.`, ship);
        }, 2 * 1000);
    }

    private tryDockShip(ship: ShipView, predicate: (dock: DockView) => boolean, queue: ShipView[]): DockView | void {
        const dock = this.getAvailableDock(predicate);
        if (dock) {
            console.log(`Docking ship ${ship}...`);
            this.startDockingProcess(ship, dock);
            this.removeFromQueue(ship, queue);

            return dock;
        } else {
            console.log(`No available dock to dock ship . Adding to queue...`, ship);
            this.addToQueue(ship, queue);
            console.log(`Ship added to the queue.`, ship);
        }
    }

    public tryToDockShip(ship: ShipView): DockView | void {
        if (ship.type === ShipType.toLoad) {
            return this.tryDockShip(ship, (dock) => !dock.isDocked() && dock.isFilled(), this.queueToLoad);
        } else {
            return this.tryDockShip(ship, (dock) => !dock.isDocked() && !dock.isFilled(), this.queueToUnload);
        }
    }

    public tryToUndockShip(dock: DockView, ship: ShipView): void {
        if (this.dockingProcess) {
            console.log(`Docking process is already started.`, ship);
            this.queueToUndock.push({ ship, dock });
            return;
        } else {
            console.log(`Starting undocking process...`, ship);

            this.dockingProcess = setTimeout(() => {
                this.dockingProcess = null;
                console.log(`Undocking process finished.`, ship);
                dock.undockShip();
                ship.outOfPort();
                console.log(`Ship successfully undocked.`, ship);

                const nextShip = this.queueToUndock.shift();
                if (nextShip) {
                    this.tryToUndockShip(nextShip.dock, nextShip.ship);
                    return;
                }

                const nextShipToLoad = this.queueToLoad.shift();
                if (nextShipToLoad) {
                    this.tryToDockShip(nextShipToLoad);
                }

                const nextShipToUnload = this.queueToUnload.shift();
                if (nextShipToUnload) {
                    this.tryToDockShip(nextShipToUnload);
                }
            }, 2 * 1000);
        }
    }

    private addToQueue(ship: ShipView, queue: ShipView[]): void {
        queue.push(ship);
    }

    private removeFromQueue(ship: ShipView, queue: ShipView[]): void {
        const index = queue.indexOf(ship);
        if (index !== -1) {
            queue.splice(index, 1);
            console.log(`Ship ${ship} removed from the queue.`);
        }
    }

    public getQueueToLoadLength(): number {
        return this.queueToLoad.length;
    }

    public getQueueToUnloadLength(): number {
        return this.queueToUnload.length;
    }
}

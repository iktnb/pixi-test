import { Dock } from "../models/Dock";
import { Container, Graphics } from "pixi.js";
import { Color } from "../index";

export class DockView extends Dock {
    private view: Container;
    private rect: Graphics;
    private innerRect: Graphics;
    private coordinatesDock: { x: number; y: number };

    constructor(x: number, y: number) {
        super();
        this.coordinatesDock = { x, y };
        this.view = new Container();
        this.rect = new Graphics();

        this.rect.beginFill(Color.yellow);
        this.rect.drawRect(x, y, 40, 150);
        this.rect.endFill();

        this.innerRect = new Graphics();
        this.innerRect.beginFill(Color.blue);
        this.innerRect.drawRect(x + 5, y + 10, 30, 125);
        this.innerRect.endFill();

        this.view.addChild(this.rect, this.innerRect);

        this.renderDock();
    }

    // Логика отображение дока в зависимости от того, загружен он или пустой

    public renderDock(): void {
        const { x, y } = this.coordinatesDock;

        this.innerRect.clear();
        this.innerRect.beginFill(this.isFilled() ? Color.yellow : Color.blue);
        this.innerRect.drawRect(x + 5, y + 10, 30, 125);
        this.innerRect.endFill();
    }

    public getView(): Container {
        return this.view;
    }

    public setDockFilled(value: boolean): void {
        console.log("DockView -> setDockFilled -> value", value);
        this.setFilled(value);
        this.dockedShip?.setShipLoad(!value);
        this.renderDock();
    }

    public getCoordinatesForChipDockPosition(): { x: number; y: number } {
        const { x, y } = this.coordinatesDock;
        return { x: x + 20, y: y + 120 };
    }
}

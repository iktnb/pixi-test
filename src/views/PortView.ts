import { Container, Graphics } from "pixi.js";

import { Port } from "../models/Port";
import { DockView } from "./DockView";
import { Color, Settings } from "..";

export class PortView extends Port {
    private view: Container;
    private portWall: Graphics;
    private portchannel: Graphics;
    private portEntry: Container;

    constructor(docks_count: number = 4) {
        const docks = Array.from({ length: docks_count }, (_, i) => new DockView(0, 80 + i * 200));
        super(docks);
        this.view = new Container();
        docks.forEach((dock) => this.view.addChild(dock.getView()));

        this.portEntry = new Container();
        this.portWall = new Graphics();
        this.portWall.beginFill(Color.yellow);
        this.portWall.drawRect(Settings.wallsX, 0, 30, Settings.gameHeight);
        this.portWall.endFill();

        this.portchannel = new Graphics();
        this.portchannel.beginFill(Color.blue);

        this.portchannel.drawRect(Settings.wallsX, Settings.gameHeight / 2 - 200, 150, 350);
        this.portchannel.endFill();

        this.portEntry.addChild(this.portWall, this.portchannel);

        this.view.addChild(this.portEntry);
    }

    public getView(): Container {
        return this.view;
    }
}

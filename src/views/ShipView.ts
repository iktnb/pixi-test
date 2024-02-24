import { Container, Graphics } from "pixi.js";
import { Ship, ShipType } from "../models/Ship";
import { Color, Settings } from "..";
import { PortView } from "./PortView";

/* import TWEEN from "@tweenjs/tween.js"; */

export class ShipView extends Ship {
    private view: Container;
    private shipView: Container;
    private shipBody: Graphics;
    private shipBorder: Graphics;
    private color: Color;
    private speed: number;

    private stage: Container;

    private x: number;
    private y: number;

    constructor(port: PortView, type: ShipType, stage: Container) {
        super(port, type);

        this.x = Settings.gameWidth;
        this.y = type === ShipType.toLoad ? 100 : 700;

        this.stage = stage;

        this.speed = 10;

        this.view = new Container();
        this.shipView = new Container();

        this.color = type === ShipType.toLoad ? Color.green : Color.red;

        this.shipBorder = new Graphics();
        this.shipBorder.beginFill(this.color);
        this.shipBorder.drawRect(this.x, this.y, 100, 40);
        this.shipBorder.endFill();

        this.shipBody = new Graphics();
        this.shipBody.beginFill(Color.blue);
        this.shipBody.drawRect(this.x + 5, this.y + 5, 90, this.type === ShipType.toLoad ? 30 : 30);
        this.shipBody.endFill();

        this.shipView.addChild(this.shipBorder, this.shipBody);

        this.view.addChild(this.shipView);
    }

    private removeShip(): void {
        this.stage.removeChild(this.view);
    }

    public getView(): Container {
        return this.view;
    }

    private renderShip(): void {
        this.shipBody.clear();
        this.shipBody.beginFill(Color.blue);
        this.shipBody.drawRect(this.x + 5, this.y + 5, 90, super.isLoaded() ? 0 : 30);
        this.shipBody.endFill();

        this.shipBorder.clear();
        this.shipBorder.beginFill(this.color);
        this.shipBorder.drawRect(this.x, this.y, 100, 40);
        this.shipBorder.endFill();
    }

    public setShipLoad(value: boolean): void {
        super.setLoaded(value);
        this.renderShip();
    }

    public moveToPort(): void {
        // animate ship to port using tween.js
        /*    const tween = new TWEEN.Tween({ x: this.x, y: this.y })
            .to({ x: Settings.wallsX + 50, y: this.y }, 2000)
            .delay(1000)
            .onUpdate((object) => {
                this.x = object.x;
                this.y = object.y;
                this.renderShip();
            })

            .start();

        console.log(tween); */
        const moveInterval = setInterval(() => {
            if (this.x < Settings.wallsX + 50) {
                console.log("Ship has arrived at the wall");

                clearInterval(moveInterval);
                super.callToDock(this);
                return;
            }

            this.x -= this.speed;
            this.renderShip();
        }, 150);
    }

    public outOfPort(): void {
        this.setCoordinates(Settings.wallsX, this.y);
        this.moveToSea();
    }

    public moveToSea(): void {
        const moveInterval = setInterval(() => {
            if (this.x > Settings.gameWidth) {
                clearInterval(moveInterval);
                this.setCoordinates(Settings.gameWidth, this.y);
                this.removeShip();
                console.log("Ship has removed");
                return;
            }

            this.x += this.speed;
            this.renderShip();
        }, 150);
    }

    public setCoordinates(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.renderShip();
    }
}

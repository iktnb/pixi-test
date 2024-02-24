import "pixi-spine";
import "./style.css";
import { Application } from "pixi.js";

import { PortView } from "./views/PortView";
import { ShipView } from "./views/ShipView";
import { ShipType } from "./models/Ship";

const gameWidth = 900;
const gameHeight = 900;

export const Settings = {
    gameWidth,
    gameHeight,
    wallsX: 200,
};

export enum Color {
    blue = 0x6fa8dc,
    green = 0x00ff00,
    yellow = 0xffff00,
    red = 0xff0000,
}
const app = new Application<HTMLCanvasElement>({
    backgroundColor: Color.blue,
    width: gameWidth,
    height: gameHeight,
});

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);

    resizeCanvas();
    const port = new PortView();
    app.stage.addChild(port.getView());

    setInterval(() => {
        const ship = new ShipView(port, Math.random() > 0.5 ? ShipType.toLoad : ShipType.toUnload, app.stage);
        app.stage.addChild(ship.getView());
        ship.moveToPort();
    }, 8 * 1000);
};

// Метод, который будет генерировать корабли раз в 8 секунд с рандомным типом

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        app.stage.scale.x = window.innerWidth / gameWidth;
        app.stage.scale.y = window.innerHeight / gameHeight;
    };

    resize();

    window.addEventListener("resize", resize);
}

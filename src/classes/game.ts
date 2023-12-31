export type Coordinates = {
    x: number;
    y: number;
};

export type Neighbors = {
    left: boolean | undefined;
    right: boolean | undefined;

    top: boolean | undefined;
    bottom: boolean | undefined;

    topRight: boolean | undefined;
    topLeft: boolean | undefined;

    bottomRight: boolean | undefined;
    bottomLeft: boolean | undefined;
};

export default class Game {
    public data: boolean[][];
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        // oh my god, 2hrs wasted
        // this.data = new Array(y).fill(new Array(x).fill(false));

        this.data = new Array(y).fill(0).map(() => new Array(x).fill(false));
    }

    private setData(data: typeof this.data) {
        this.data = data;
    }

    clone(): Game {
        const newGame = new Game(this.x, this.y);
        newGame.setData(structuredClone(this.data));
        return newGame;
    }

    set(coordinates: Coordinates, active: boolean) {
        const { x, y } = coordinates;

        if (y >= this.data.length || y < 0) {
            throw new Error("trying to set y out of bounds");
        }

        const dataY = this.data[y] as boolean[];
        if (x >= dataY.length || x < 0) {
            throw new Error("trying to set x out of bounds");
        }

        dataY[x] = active;
    }

    get(coordinates: Coordinates): boolean | undefined {
        const { x, y } = coordinates;
        return this.data[y]?.[x];
    }

    neighbors(target: Coordinates): Neighbors {
        const left = this.get({ x: target.x - 1, y: target.y });
        const right = this.get({ x: target.x + 1, y: target.y });

        const top = this.get({ x: target.x, y: target.y + 1 });
        const bottom = this.get({ x: target.x, y: target.y - 1 });

        const topRight = this.get({ x: target.x + 1, y: target.y + 1 });
        const topLeft = this.get({ x: target.x - 1, y: target.y + 1 });

        const bottomRight = this.get({ x: target.x + 1, y: target.y - 1 });
        const bottomLeft = this.get({ x: target.x - 1, y: target.y - 1 });

        return {
            left,
            right,
            top,
            bottom,
            topRight,
            topLeft,
            bottomRight,
            bottomLeft,
        };
    }

    reset() {
        this.data = new Array(this.y)
            .fill(0)
            .map(() => new Array(this.x).fill(false));
    }
}

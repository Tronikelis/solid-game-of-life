import { Index, createSignal, onCleanup } from "solid-js";
import clsx from "clsx";

import "./main.css";
import Game, { Coordinates } from "./classes/game";

export default function App() {
    const SIZE = 140;
    const forArr: boolean[] = new Array(SIZE).fill(false);

    const [running, setRunning] = createSignal(false);
    const [iterationTime, setIterationTime] = createSignal(0);

    const [game, setGame] = createSignal(new Game(SIZE, SIZE), {
        equals: false,
    });

    const interval = setInterval(() => {
        if (!running()) return;

        const now = performance.now();
        const gameClone = game().clone();

        for (const [y, arr] of game().data.entries()) {
            for (const [x, cell] of arr.entries()) {
                const neighbors = game().neighbors({ x, y });

                const alive = Object.entries(neighbors).reduce(
                    (prev, [_, curr]) => prev + (curr === true ? 1 : 0),
                    0
                );

                // any live cell with two or three live neighbors survives
                if (cell && (alive === 2 || alive === 3)) {
                    continue;
                }

                // any dead cell with three live neighbors becomes a live cell
                if (!cell && alive === 3) {
                    gameClone.set({ x, y }, true);
                    continue;
                }

                gameClone.set({ x, y }, false);
            }
        }

        setIterationTime(performance.now() - now);
        setGame(gameClone);
    });

    function onClickCell(coordinates: Coordinates) {
        setGame(g => {
            g.set(coordinates, true);
            return g;
        });
    }

    function onClickRandom() {
        for (const [y, arr] of game().data.entries()) {
            for (const [x] of arr.entries()) {
                game().set({ x, y }, Math.random() > 0.5);
            }
        }

        setGame(x => x);
    }

    function onClickReset() {
        setGame(x => {
            x.reset();
            return x;
        });
    }

    onCleanup(() => {
        clearInterval(interval);
    });

    return (
        <div class="middle">
            <div class="cell-container">
                <Index each={forArr}>
                    {(_, y) => (
                        <Index each={forArr}>
                            {(_, x) => (
                                <div
                                    class={clsx(
                                        "cell",
                                        game().get({ x, y }) === true &&
                                            "active"
                                    )}
                                    onClick={() => onClickCell({ x, y })}
                                />
                            )}
                        </Index>
                    )}
                </Index>
            </div>

            <div>
                <button onClick={onClickRandom}>Random</button>

                <button onClick={() => setRunning(x => !x)}>
                    {running() ? "Stop" : "Run"}
                </button>

                <button onClick={onClickReset}>Reset</button>

                <p>Iteration time: {iterationTime()} ms</p>
            </div>
        </div>
    );
}

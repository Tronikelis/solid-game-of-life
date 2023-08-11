import { For, createSignal, onMount, on, onCleanup } from "solid-js";
import clsx from "clsx";

import "./main.css";
import Game from "./classes/game";

export default function App() {
    const SIZE = 24;
    const forArr: boolean[] = new Array(SIZE).fill(false);

    const [game, setGame] = createSignal(new Game(SIZE, SIZE), {
        equals: (a, b) => false,
    });

    let interval: ReturnType<typeof setInterval> | undefined;

    onMount(() => {
        interval = setInterval(() => {
            setGame(x => {
                x.set(
                    {
                        x: Math.floor(Math.random() * SIZE),
                        y: Math.floor(Math.random() * SIZE),
                    },
                    true
                );
                return x;
            });
        }, 0);
    });

    onCleanup(() => {
        clearInterval(interval);
    });

    return (
        <div class="middle">
            <div class="cell-container">
                <For each={forArr}>
                    {(_, y) => (
                        <For each={forArr}>
                            {(_, x) => (
                                <div
                                    class={clsx(
                                        "cell",
                                        game().get({ x: x(), y: y() }) ===
                                            true && "active",
                                        `x:${x()}`,
                                        `y:${y()}`
                                    )}
                                />
                            )}
                        </For>
                    )}
                </For>
            </div>
        </div>
    );
}

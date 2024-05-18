console.log("index.ts loaded");

/**
 * The url parameter.
 */
const urlParameter: URLSearchParams = new URLSearchParams(window.location.search);

/**
 * The drawing canvas.
 */
const canvas: HTMLCanvasElement = document.querySelector("canvas")!;

/**
 * The drawing context.
 */
const context: CanvasRenderingContext2D = canvas.getContext("2d")!;

/**
 * Dummy which contains real pendulums as children.
 */
let pendulum: Pendulum = new Pendulum();

/**
 * The pendulum count (of real pendulums).
 */
let pendulumCount: number = Math.max(2, parseInt(urlParameter.get("count") ?? randomIntInRange(5, 10).toFixed())) + 1;

/**
 * The animation speed.
 */
let speed: number = Math.max(0, parseFloat(urlParameter.get("speed") ?? "1"));

/**
 * The time that has passed since the start. (in seconds)
 */
let time: number = 0;

/**
 * Last draw time.
 */
let lastDraw: number = 0;

/**
 * Whether the drawing is paused.
 */
let paused: boolean = false;

// EVENTS
window.addEventListener("load", _ => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateRandomPendulumTree();
    time = performance.now();
    draw();
});
window.addEventListener("resize", _ => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
window.addEventListener("blur", _ => {
    paused = true;
    document.title = "The Pendulum (Paused)";
});
window.addEventListener("focus", _ => {
    document.title = "The Pendulum";
    lastDraw = performance.now();
    paused = false;
});

/**
 * Generates a random pendulum tree using the pruefer sequence.
 * @param count The pendulum count.
 * @see https://proofwiki.org/wiki/Labeled_Tree_from_Pr%C3%BCfer_Sequence
 */
function generateRandomPendulumTree(): void {
    // 0: create the pruefer sequence of length n-2 with values from 0 to n-1
    const pruefer_sequence: number[] = new Array(pendulumCount-2).fill(0).map(_ => randomIntInRange(0, pendulumCount-1));
    // 1: generate n nodes
    const nodes: Pendulum[] = new Array(pendulumCount).fill(undefined).map(_ => new Pendulum());
    // 2: make a list of all the integers (0, ..., n-1)
    const list: number[] = new Array(pendulumCount).fill(0).map((_, i) => i);

    // 3: while there are more than 2 elements in the list
    while (list.length > 2) {
        // 4: find the smallest number in the list which is not in the sequence
        const x = Math.min(...list.filter(v => !pruefer_sequence.includes(v)));
        // 4: get the first number in the sequence
        const y = pruefer_sequence[0];
        // 4: Add an edge to the tre connecting these two nodes
        connect(x, y);
        // 5: delete the first number (x) from the list
        list.splice(list.indexOf(x), 1);
        // 5: deletes the second number (y) from the sequence
        pruefer_sequence.shift();
    }
    // 3: connect the remaining two nodes
    connect(list[0], list[1]);

    // make graph directed
    makeDirected(nodes[0]);

    // the root pendulum is just a dummy (container)
    nodes[0].isDummy = true;

    // assign the root pendulum
    pendulum = nodes[0];

    function connect(a: number, b: number) {
        nodes[a].children.push(nodes[b]);
        nodes[b].children.push(nodes[a]);
    }
    function makeDirected(node: Pendulum): void {
        for (const child of node.children) {
            child.children.splice(child.children.indexOf(node), 1);
            makeDirected(child);
        }
    }
}

/**
 * Draws on the canvas.
 */
function draw(): void {
    requestAnimationFrame(draw);
    if (paused) return;

    const deltaTime = (performance.now() - lastDraw) / 1000 * speed;
    time += deltaTime;

    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(1, -1);

    context.lineCap = "round";
    pendulum?.draw(0, 0, 0, deltaTime);
    context.restore();

    lastDraw = performance.now();
}